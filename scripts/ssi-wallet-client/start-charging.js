/// DESCRIPTION/INSTRUCTIONS:

// Prompts for base64 encoded switchboard url
// Tested with node v16 but probably works with others

/////////////////

const { realpath } = require('fs');
const https = require('https');

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

const querystring = require('querystring');

const {
  chargingDataCredential,
  energyContractCredential,
} = require('./credentials');

const vcApiUrl = 'https://vc-api-dev.energyweb.org';

//https://nodejs.org/api/http.html#httprequestoptions-callback
async function request(url, options, postData) {
  return new Promise((resolve, reject) => {
    let data = '';
    const req = https.request(url, options, (res) => {
      console.log(`STATUS: ${res.statusCode}`);
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        data = `${data}${chunk}`;
      });
      res.on('end', () => {
        console.dir(JSON.parse(data), { depth: 20, colors: true });
        resolve(JSON.parse(data));
      });
    });

    req.on('error', (e) => {
      console.dir(JSON.parse(e), { depth: 10, colors: true });
      reject();
    });

    // Write data to request body
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

(async () => {
  // e.g. https://switchboard-staging.energyweb.org/?_oob=eyJwcmVzZW50YXRpb25MaW5rIjp7InR5cGUiOiJ2Yy1hcGktZXhjaGFuZ2UiLCJ1cmwiOiJodHRwczovL3dlYi5ldi1kYXNoYm9hcmQuZW5lcmd5d2ViLm9yZy92Yy1hcGkvZXhjaGFuZ2VzL2RpZDpldGhyOmJseG0tZGV2OjB4YkYwMUFFMkM4NDNiRWM4NDE5MWFBMzlkQjVGOTMxODUzZWJBM2Q3MCIsInNzaVNlc3Npb24iOiIifSwib2NwaVRva2VuVUlEIjoiMGIyYjdhOWEtNWIxMi00MDc5LWEyNmItNmM1NjExMmJiMTU1In0=
  const switchboardUrl = new URL(
    await new Promise((resolve) => {
      readline.question('Enter base64 encoded Switchboard URL:', resolve);
    })
  );

  const buff = Buffer.from(switchboardUrl.searchParams.get('_oob'), 'base64');
  const decoded = buff.toString('ascii');
  console.dir(decoded, { depth: 20, colors: true });
  const exchangeUrl = JSON.parse(decoded).url;

  console.log(`Calling startUrl at: ${exchangeUrl}`);

  // INITIATE EXCHANGE
  console.log('initiating exchange');
  const initiateOptions = {
    method: 'POST',
  };
  const initiateResult = await request(exchangeUrl, initiateOptions);
  const challenge = initiateResult.vpRequest.challenge;
  const continueUrl =
    initiateResult.vpRequest.interact.service[0].serviceEndpoint.replace(
      'http://localhost:3000',
      vcApiUrl
    );

  // CREATE DIDs
  console.log('create DIDs');
  const createDidUrl = `${vcApiUrl}/did`;
  const createDidBody = JSON.stringify({
    method: 'key',
  });
  const createDidOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(createDidBody),
    },
  };
  const issuerDIDDoc = await request(
    createDidUrl,
    createDidOptions,
    createDidBody
  );
  const holderDIDDoc = await request(
    createDidUrl,
    createDidOptions,
    createDidBody
  );

  // ISSUE CREDENTIAL FROM SUPPLIER TO CUSTOMER
  const issueCredentialUrl = `${vcApiUrl}/vc-api/credentials/issue`;
  const issueEWFRoleCredentialBody = JSON.stringify({
    credential: energyContractCredential(holderDIDDoc.id, issuerDIDDoc.id),
    options: {
      verificationMethod: issuerDIDDoc.verificationMethod[0].id,
      proofPurpose: 'assertionMethod',
    },
  });
  const issueEWFRoleCredentialOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(issueEWFRoleCredentialBody),
    },
  };
  const EWFRoleVc = await request(
    issueCredentialUrl,
    issueEWFRoleCredentialOptions,
    issueEWFRoleCredentialBody
  );

  // ISSUE CHARGING DATA CREDENTIAL
  const chargingDataConstraints =
    initiateResult.vpRequest.query[0].credentialQuery[0].presentationDefinition.input_descriptors.find(
      (d) => d.id === 'charging_data'
    ).constraints;
  const contractDID = chargingDataConstraints.fields.find((f) =>
    f.path.includes('$.credentialSubject.chargingData.contractDID')
  ).filter.const;
  const timeStamp = chargingDataConstraints.fields.find((f) =>
    f.path.includes('$.credentialSubject.chargingData.timeStamp')
  ).filter.const;
  const issueChargingDataCredentialBody = JSON.stringify({
    credential: chargingDataCredential(holderDIDDoc.id, contractDID, timeStamp),
    options: {
      verificationMethod: holderDIDDoc.verificationMethod[0].id,
      proofPurpose: 'assertionMethod',
    },
  });
  const issueChargingDataCredentialOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(issueChargingDataCredentialBody),
    },
  };
  const chargingDataVc = await request(
    issueCredentialUrl,
    issueChargingDataCredentialOptions,
    issueChargingDataCredentialBody
  );

  // PROVE PRESENTATION
  console.log('prove presentation');
  const proveUrl = `${vcApiUrl}/vc-api/presentations/prove`;
  const proveBody = JSON.stringify({
    presentation: {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://www.w3.org/2018/credentials/examples/v1',
      ],
      type: ['VerifiablePresentation'],
      verifiableCredential: [EWFRoleVc, chargingDataVc],
      holder: holderDIDDoc.id,
    },
    options: {
      verificationMethod: holderDIDDoc.verificationMethod[0].id,
      proofPurpose: 'authentication',
      challenge,
    },
  });
  const proveOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(proveBody),
    },
  };
  const proveResponse = await request(proveUrl, proveOptions, proveBody);
  // console.log(proveResponse);

  // CONTINUE EXCHANGE
  console.log('continue exchange');
  const continueBody = JSON.stringify(proveResponse);
  const continueOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(continueBody),
    },
  };
  const continueResult = await request(
    continueUrl,
    continueOptions,
    continueBody
  );
  console.log(continueResult);

  console.log('done');
})();

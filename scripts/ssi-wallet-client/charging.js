/// DESCRIPTION/INSTRUCTIONS:

// Prompts for base64 encoded switchboard url. Starts or stops charging depending on exchange id contained in url
// Tested with node v16 but probably works with others
// For start-charging issuerDID and holderDID can be omitted
// For stop-charging issuerDID should be taken from issuer property of Rebeam credential
// and holderDID is credentialSubject.id

/////////////////

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

const { inspect } = require('util');
const {
  chargingDataCredential,
  energyContractCredential,
} = require('./credentials');
const { vcApiUrl, request, createDID, getDID } = require('./vc-api');

(async () => {
  // e.g. to start charging https://switchboard-staging.energyweb.org/dashboard?_oob=eyJ0eXBlIjoidmMtYXBpLWV4Y2hhbmdlIiwidXJsIjoiaHR0cHM6Ly92Yy1hcGktZGV2LmVuZXJneXdlYi5vcmcvdmMtYXBpL2V4Y2hhbmdlcy9kaWQ6ZXRocjpibHhtLWRldjoweDc4ZWRCMTU0MDdFMUJiMEM2ODJlQjUwZTY4OTJlMUM0NDk0RkQzNzYiLCJzc2lTZXNzaW9uIjoiIn0%3D
  // to stop charging https://switchboard-staging.energyweb.org/dashboard?_oob=eyJ0eXBlIjoidmMtYXBpLWV4Y2hhbmdlIiwidXJsIjoiaHR0cHM6Ly92Yy1hcGktZGV2LmVuZXJneXdlYi5vcmcvdmMtYXBpL2V4Y2hhbmdlcy9kaWQ6ZXRocjpibHhtLWRldjoweDc4ZWRCMTU0MDdFMUJiMEM2ODJlQjUwZTY4OTJlMUM0NDk0RkQzNzZlbmQiLCJzc2lTZXNzaW9uIjoiIn0%3D
  // issuerDID did:key:z6MkfzF7NHeDFXjZDAXVPrG1NaRcvGX8oioSKWJ8pHzLpVki
  // holderDID did:key:z6Mkr7qGV2ThNgzR4W2u8We2ye2bFwDiP1n14VGU2A7ck5J4
  const switchboardUrl = new URL(
    await new Promise((resolve) =>
      readline.question('Enter base64 encoded Switchboard URL:', resolve)
    )
  );
  let issuerDID = await new Promise((resolve) =>
    readline.question('Enter issuer DID or leave empty to generate:', resolve)
  );
  let holderDID = await new Promise((resolve) =>
    readline.question('Enter holder DID or leave empty to generate:', resolve)
  );

  const buff = Buffer.from(switchboardUrl.searchParams.get('_oob'), 'base64');
  const decoded = buff.toString('ascii');
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
  const input_descriptors =
    initiateResult.vpRequest.query[0].credentialQuery[0].presentationDefinition
      .input_descriptors;

  // CREATE DIDs
  console.log('create DIDs');
  const issuerDIDDoc = issuerDID ? await getDID(issuerDID) : await createDID();
  const holderDIDDoc = holderDID ? await getDID(holderDID) : await createDID();

  // ISSUE CREDENTIALS
  const verifiableCredential = [];
  const issueCredentialUrl = `${vcApiUrl}/vc-api/credentials/issue`;

  // ISSUE CREDENTIAL FROM SUPPLIER TO CUSTOMER
  if (
    input_descriptors.find(
      (desc) => desc.id === 'energy_supplier_customer_contract'
    )
  ) {
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
    const ewfRoleVc = await request(
      issueCredentialUrl,
      issueEWFRoleCredentialOptions,
      issueEWFRoleCredentialBody
    );
    console.log(
      'Issued Rebeam customer credential:',
      inspect(ewfRoleVc, { depth: 10 })
    );
    verifiableCredential.push(ewfRoleVc);
  }

  // ISSUE CHARGING DATA CREDENTIAL
  if (input_descriptors.find((desc) => desc.id === 'charging_data')) {
    const chargingDataConstraints = input_descriptors.find(
      (d) => d.id === 'charging_data'
    ).constraints;
    const contractDID = chargingDataConstraints.fields.find((f) =>
      f.path.includes('$.credentialSubject.chargingData.contractDID')
    ).filter.const;
    const evseId = chargingDataConstraints.fields.find((f) =>
      f.path.includes('$.credentialSubject.chargingData.evseId')
    ).filter.const;
    const timeStamp = chargingDataConstraints.fields.find((f) =>
      f.path.includes('$.credentialSubject.chargingData.timeStamp')
    ).filter.const;
    const kwh = chargingDataConstraints.fields.find((f) =>
      f.path.includes('$.credentialSubject.chargingData.kwh')
    )?.filter.const;
    const issueChargingDataCredentialBody = JSON.stringify({
      credential: chargingDataCredential(holderDIDDoc.id, {
        contractDID,
        evseId,
        timeStamp,
        kwh,
      }),
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
    console.log(
      'Issued charging data credential:',
      inspect(chargingDataVc, { depth: 10 })
    );
    verifiableCredential.push(chargingDataVc);
  }

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
      verifiableCredential,
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

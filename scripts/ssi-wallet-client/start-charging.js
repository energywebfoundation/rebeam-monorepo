/// DESCRIPTION/INSTRUCTIONS:

// Prompts for base64 encoded switchboard url
// Tested with node v16 but probably works with others

/////////////////

const { realpath } = require("fs");
const https = require("https");

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

const baseUrl = "https://web.ev-dashboard.energyweb.org";

//https://nodejs.org/api/http.html#httprequestoptions-callback
async function request(url, options, postData) {
  return new Promise((resolve, reject) => {
    let data;
    const req = https.request(url, options, (res) => {
      console.log(`STATUS: ${res.statusCode}`);
      // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
      res.setEncoding("utf8");
      res.on("data", (chunk) => {
        console.log(`BODY: ${chunk}`);
        data = chunk;
      });
      res.on("end", () => {
        console.log("No more data in response.");
        resolve(JSON.parse(data));
      });
    });

    req.on("error", (e) => {
      console.error(`problem with request: ${e.message}`);
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
  const switchboardUrl = await new Promise((resolve) => {
    readline.question("Enter base64 encoded Switchboard URL:", resolve);
  });

  const buff = Buffer.from(switchboardUrl.split("oob=")[1], "base64");
  const decoded = buff.toString("ascii");
  const startUrl = JSON.parse(decoded).url;

  console.log(`Calling startUrl at: ${startUrl}`);

  // CREATE DIDs
  console.log("create DIDs");
  const createDidUrl = `${baseUrl}/did`;
  const createDidBody = JSON.stringify({
    method: "key",
  });
  const createDidOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(createDidBody),
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
  const issueCredentialUrl = `${baseUrl}/vc-api/credentials/issue`;
  const issuerCredentialBody = JSON.stringify({
    credential: {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        {
          issuerFields: {
            "@id": "ew:issuerFields",
            "@type": "ew:IssuerFields",
          },
          namespace: "ew:namespace",
          role: {
            "@id": "ew:role",
            "@type": "ew:Role",
          },
          ew: "https://energyweb.org/ld-context-2022#",
          version: "ew:version",
          EWFRole: "ew:EWFRole",
        },
      ],
      id: "urn:uuid:7f94d397-3e70-4a43-945e-1a13069e636f",
      type: ["VerifiableCredential", "EWFRole"],
      credentialSubject: {
        id: holderDIDDoc.id,
        issuerFields: [],
        role: {
          namespace: "customer.roles.rebeam.apps.eliagroup.iam.ewc",
          version: "1",
        },
      },
      issuer: issuerDIDDoc.id,
      issuanceDate: "2022-03-18T08:57:32.477Z",
    },
    options: {
      verificationMethod: issuerDIDDoc.verificationMethod[0].id,
      proofPurpose: "assertionMethod",
    },
  });
  const issueCredentialOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(issuerCredentialBody),
    },
  };
  const vc = await request(
    issueCredentialUrl,
    issueCredentialOptions,
    issuerCredentialBody
  );

  // INITIATE EXCHANGE
  console.log("initiating exchange");
  const initiateOptions = {
    method: "POST",
  };
  const initiateResult = await request(startUrl, initiateOptions);
  const challenge = initiateResult.vpRequest.challenge;
  const continueUrl =
    initiateResult.vpRequest.interact.service[0].serviceEndpoint.replace(
      "http://localhost:3000",
      baseUrl
    );

  // PROVE PRESENTATION
  console.log("prove presentation");
  const proveUrl = `${baseUrl}/vc-api/presentations/prove`;
  const proveBody = JSON.stringify({
    presentation: {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://www.w3.org/2018/credentials/examples/v1",
      ],
      type: ["VerifiablePresentation"],
      verifiableCredential: [vc],
      holder: holderDIDDoc.id,
    },
    options: {
      verificationMethod: holderDIDDoc.verificationMethod[0].id,
      proofPurpose: "authentication",
      challenge,
    },
  });
  const proveOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(proveBody),
    },
  };
  const proveResponse = await request(proveUrl, proveOptions, proveBody);
  console.log(proveResponse);

  // CONTINUE EXCHANGE
  console.log("continue exchange");
  const continueBody = JSON.stringify(proveResponse);
  const continueOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(continueBody),
    },
  };
  const continueResult = await request(
    continueUrl,
    continueOptions,
    continueBody
  );
  console.log(continueResult);

  console.log("done");
})();

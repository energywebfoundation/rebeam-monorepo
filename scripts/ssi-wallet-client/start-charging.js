/// DESCRIPTION/INSTRUCTIONS:

// Prompts for base64 encoded switchboard url
// Tested with node v16 but probably works with others

/////////////////

const { realpath } = require("fs");
const https = require("https");

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

// Created using POST /did
const holderDIDDoc = {
  id: "did:key:z6MksBH4LMy8SoYFUNjDXtQ2Rq4dHnyuemowxXqzLpuB6nvc",
  verificationMethod: [
    {
      id: "did:key:z6MksBH4LMy8SoYFUNjDXtQ2Rq4dHnyuemowxXqzLpuB6nvc#z6MksBH4LMy8SoYFUNjDXtQ2Rq4dHnyuemowxXqzLpuB6nvc",
      type: "Ed25519VerificationKey2018",
      controller: "did:key:z6MksBH4LMy8SoYFUNjDXtQ2Rq4dHnyuemowxXqzLpuB6nvc",
      publicKeyJwk: {
        kty: "OKP",
        crv: "Ed25519",
        x: "vQ_IRFshaPvKIyaaYOR-47OesC3CobvjTCTo2ehHu6E",
        kid: "beSd3rrBevVfJhmBdmMy0LWtWenmSGQSyXLkZMC7K4E",
      },
    },
  ],
};

// Created using POST /did
const issuerDIDDoc = {
  id: "did:key:z6Mki3utG1yXtxGW5NYTsA6SjiXu55DNb1nEiKYLuAyMj87H",
  verificationMethod: [
    {
      id: "did:key:z6Mki3utG1yXtxGW5NYTsA6SjiXu55DNb1nEiKYLuAyMj87H#z6Mki3utG1yXtxGW5NYTsA6SjiXu55DNb1nEiKYLuAyMj87H",
      type: "Ed25519VerificationKey2018",
      controller: "did:key:z6Mki3utG1yXtxGW5NYTsA6SjiXu55DNb1nEiKYLuAyMj87H",
      publicKeyJwk: {
        kty: "OKP",
        crv: "Ed25519",
        x: "NXOX1eLtojrpqN1v4a21BdW0BMyFpibVHx5zSqorO3g",
        kid: "sdSk0PNrBGkeM_XPxxyLC_8baL12KgtKJkLXUmscEM4",
      },
    },
  ],
};

// Contains pre-issued customer credential
const presentation = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1",
  ],
  type: ["VerifiablePresentation"],
  verifiableCredential: [
    {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        {
          EWFRole: "ew:EWFRole",
          issuerFields: {
            "@id": "ew:issuerFields",
            "@type": "ew:IssuerFields",
          },
          namespace: "ew:namespace",
          ew: "https://energyweb.org/ld-context-2022#",
          version: "ew:version",
          role: {
            "@id": "ew:role",
            "@type": "ew:Role",
          },
        },
      ],
      id: "urn:uuid:7f94d397-3e70-4a43-945e-1a13069e636f",
      type: ["VerifiableCredential", "EWFRole"],
      credentialSubject: {
        id: "did:key:z6MksBH4LMy8SoYFUNjDXtQ2Rq4dHnyuemowxXqzLpuB6nvc",
        role: {
          namespace: "customer.roles.rebeam.apps.eliagroup.iam.ewc",
          version: "1",
        },
        issuerFields: [],
      },
      issuer: "did:key:z6Mki3utG1yXtxGW5NYTsA6SjiXu55DNb1nEiKYLuAyMj87H",
      issuanceDate: "2022-03-18T08:57:32.477Z",
      proof: {
        type: "Ed25519Signature2018",
        proofPurpose: "assertionMethod",
        verificationMethod:
          "did:key:z6Mki3utG1yXtxGW5NYTsA6SjiXu55DNb1nEiKYLuAyMj87H#z6Mki3utG1yXtxGW5NYTsA6SjiXu55DNb1nEiKYLuAyMj87H",
        created: "2022-03-25T16:04:05.872Z",
        jws: "eyJhbGciOiJFZERTQSIsImNyaXQiOlsiYjY0Il0sImI2NCI6ZmFsc2V9..sNxxEaSbT-jSD-3OM1OvvvT4fAtEbdomz9biBaNbrj27ndR7Vk8IA-CfDo5CXoMwDXcrbk42XAFGLRC-H-UiAA",
      },
    },
  ],
  holder: holderDIDDoc.id,
};

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
  const switchboardUrl = await new Promise(resolve => {
    readline.question("Enter base64 encoded Switchboard URL:", resolve)
  });

  const buff = Buffer.from(switchboardUrl.split('oob=')[1], 'base64');
  const startUrl = JSON.parse(buff.toString('ascii')).presentationLink.url;

  console.log(`Calling startUrl at: ${startUrl}`);

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
      "https://web.ev-dashboard.energyweb.org"
    );

  // PROVE PRESENTATION
  console.log("prove presentation");
  const proveUrl =
    "https://web.ev-dashboard.energyweb.org/vc-api/presentations/prove";
  const proveBody = JSON.stringify({
    presentation,
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

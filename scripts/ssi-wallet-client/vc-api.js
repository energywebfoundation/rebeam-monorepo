const https = require('https');

const vcApiUrl = 'https://vc-api-dev.energyweb.org';

//https://nodejs.org/api/http.html#httprequestoptions-callback
async function request(url, options, postData) {
  return new Promise((resolve, reject) => {
    let data = '';
    const req = https.request(url, options, (res) => {
      // console.log(`STATUS: ${res.statusCode}`);
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        data = `${data}${chunk}`;
      });
      res.on('end', () => {
        // console.dir(JSON.parse(data), { depth: 20, colors: true });
        resolve(JSON.parse(data));
      });
    });

    req.on('error', (e) => {
      // console.dir(JSON.parse(e), { depth: 10, colors: true });
      reject();
    });

    // Write data to request body
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function createDID() {
  const url = `${vcApiUrl}/did`;
  const body = JSON.stringify({
    method: 'key',
  });
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
    },
  };
  return request(url, options, body);
}

async function getDID(did) {
  const url = `${vcApiUrl}/did/${did}`;
  return request(url, { method: 'GET' });
}

module.exports = { vcApiUrl, request, createDID, getDID };

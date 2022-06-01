const energyContractCredential = (subjectDID, issuerDID) => ({
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    {
      namespace: 'ew:namespace',
      ew: 'https://energyweb.org/ld-context-2022#',
      role: { '@id': 'ew:role', '@type': 'ew:Role' },
      EWFRole: 'ew:EWFRole',
    },
  ],
  id: 'urn:uuid:7f94d397-3e70-4a43-945e-1a13069e636f',
  type: ['VerifiableCredential', 'EWFRole'],
  credentialSubject: {
    id: subjectDID,
    role: {
      namespace: 'customer.roles.rebeam.apps.eliagroup.iam.ewc',
    },
  },
  issuer: issuerDID,
  issuanceDate: '2022-03-18T08:57:32.477Z',
});

const chargingDataCredential = (
  subjectDID,
  /**contractDID, timeStamp, kwh?*/ chargingData
) => {
  console.dir(chargingData);
  return {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      {
        timeStamp: 'ew:timeStamp',
        chargingData: { '@id': 'ew:chargingData', '@type': 'ew:chargingData' },
        ChargingData: 'ew:ChargingData',
        contractDID: 'ew:contractDID',
        evseId: 'ew:evseId',
        kwh: 'ew:kwh',
        ew: 'https://energyweb.org/ld-context-2022#',
      },
    ],
    id: 'urn:uuid:a6032135-75d6-4019-b59d-420168c7cd85',
    type: ['VerifiableCredential', 'ChargingData'],
    credentialSubject: {
      id: subjectDID,
      chargingData,
      // : {
      //   contractDID,
      //   evseId: '892',
      //   timeStamp,
      //   kwh,
      // }
    },
    issuer: subjectDID,
    issuanceDate: '2022-03-18T08:57:32.477Z',
  };
};

module.exports = { energyContractCredential, chargingDataCredential };

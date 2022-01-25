# ReBeam-Backend Environment Variables

## OCN

The OCN Component uses the [OCN Bridge](https://github.com/energywebfoundation/ocn-bridge/tree/v3). It runs an embedded server which handles OCPI requests over the OCN.

Registration to the OCN should be done once, manually.

### OCN_OCPI_SERVER_PORT

Dictates which port the embedded OCPI server will run on.

### OCN_SIGNER

The secp256k1 private key used to sign OCPI messages on the OCN. This should
match the same key used to register on the OCN.

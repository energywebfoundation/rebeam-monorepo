# ReBeam-Backend Environment Variables

## Server

### `SERVER_PORT`

Dictates which port the eMSP backend server will run on.

## Database

The default driver is PostgreSQL. The following variables should be provided to connect to a PostgreSQL server instance.

### `TYPEORM_CONNECTION`

The type of driver to use. Should be `postgres`.

### `TYPEORM_HOST`

The hostname of the database, e.g. `localhost` or `https://my.postgres.instance`

### `TYPEORM_USERNAME`

The postgres user to authenticate as.

### `TYPEORM_PASSWORD`

The password used to authenticate as the user.

### `TYPEORM_DATABASE`

The name of the database to use.

### `TYPEORM_PORT`

The port to connect to, commonly `5432`.

### `TYPEORM_SYNCHRONIZE`

Boolean switch for whether the application will handle updates to the database
schema. Can be `true` for development environments but staging and production
should have proper migrations defined.

### `TYPEORM_LOGGING`

Boolean switch for whether to log details of driver usage. Normally `false` but
can be set to `true` during debugging.



## OCN

The OCN Component uses the [OCN Bridge](https://github.com/energywebfoundation/ocn-bridge/tree/v3). It runs an embedded server which handles OCPI requests over the OCN.

Registration to the OCN should be done once, manually.

### `OCN_OCPI_SERVER_PORT`

Dictates which port the embedded OCPI server will run on.

### `OCN_SIGNER`

The secp256k1 private key used to sign OCPI messages on the OCN. This should
match the same key used to register on the OCN.

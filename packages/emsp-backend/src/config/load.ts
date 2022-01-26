export default () => ({
  server: {
    port: process.env.SERVER_PORT,
  },
  ocn: {
    ocpiServerPort: process.env.OCN_OCPI_SERVER_PORT,
    signer: process.env.OCN_SIGNER,
  },
});

# Architecture

See [Architecture and Flow](https://energyweb.atlassian.net/wiki/spaces/REB/pages/2925953053/Architecture+and+Flow).

## Relation to EV Dashboard

There are architectural similarities to the previous "EV Dashboard" project with
Elia. They both implement OCPI to communicate with a Charge Point Operator (CPO)
over the Open Charging Network (OCN).

The main differences are:
- This component acts as an eMobility Service Provider (eMSP). We wish to send
messages directly to the CPO on behalf of our EV Drivers. The "EV Dashboard" is
an OCN "App" which has been granted permissions to read certain messages the CPO
is sending to a separate eMSP.
- The ReBeam frontend component is used by EV Drivers (customers of a supplier).
They use the frontend to remotely request the start (and stop) of a charging
session. The EV Dashboard frontend component is used by companies (TSO, DSO,
eMSP and CPO) to manage devices (Vehicles and Charge Points).

### EV Dashboard Components

- [PoC Repo](https://github.com/energywebfoundation/elia-poc/)
- [Frontend](https://github.com/energywebfoundation/ev-dashboard-frontend)
- ["Legacy" Backend](https://github.com/energywebfoundation/flex-backend/tree/ocn-bridge-component)
  - [Newer Backend](https://github.com/energywebfoundation/ev-dashboard-backend/tree/develop) (unfinished)

### OCN Components

- [OCN Bridge](https://github.com/energywebfoundation/ocn-bridge/tree/v4) - an
embedded OCPI Server used to aid OCN integration.
- [OCN Tools](https://github.com/energywebfoundation/ocn-tools) - eMSP and CPO
mock (simulation) servers.

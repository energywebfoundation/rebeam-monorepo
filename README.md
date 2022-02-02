<p align="center">
  <a href="https://www.energyweb.org" target="blank"><img src="./images/EW.png" width="120" alt="Energy Web Foundation Logo" /></a>
</p>


# Elia ReBeam Project Monorepo

Supplier switching for EV Drivers

## Description
Contains the following packages:

| Name | Description |
|------|-------------|
| emsp-backend | NestJS server that manages EV Driver charging sessions over the OCN |

## Installation
### Requirements

Before installing, download and install Node.js. Node.js 14 (LTS) or higher is required.
NPM 8.3.2 or higher is also required.

For development, we use Docker, including `docker-compose`.

This monorepo uses [lerna](https://github.com/lerna/lerna).

Installation is done using the following commands:

``` sh
$ npm install
$ npm run init
```

## Build
``` sh
$ npm run build
```

## Update dependencies
```
$ npm run update
```

## Run
``` sh
$ docker-compose up # requires docker-compose
```

Next, run the setup script to create your local OCN and register the eMSP
backend with the OCN Node:
```
node scripts/setup.js
```

The docker network persists data in the `storage` directory (ganache state,
OCN Node DB, eMSP Backend DB). Running `docker-compose down` or deleting this
directory will reset the state on future restarts.

## Testing

### Combined Unit & Integration Tests
``` sh
$ npm run test
```

## Deployment

To build the EMSP Backend:
```bash
$ cd packages/emsp-backend
$ docker build -t emsp-backend .
```

When running the container, please refer to the required [environment variables](./packages/emsp-backend/ENV.md).

## Contributing Guidelines
See [contributing.md](./contributing.md)


## Questions and Support
For questions and support please use Energy Web's [Discord channel](https://discord.com/channels/706103009205288990/843970822254362664)

Or reach out to our contributing team members

- Adam Staveley: adam.staveley@energyweb.org


# EW-DOS
The Energy Web Decentralized Operating System is a blockchain-based, multi-layer digital infrastructure.

The purpose of EW-DOS is to develop and deploy an open and decentralized digital operating system for the energy sector in support of a low-carbon, customer-centric energy future.

We develop blockchain technology, full-stack applications and middleware packages that facilitate participation of Distributed Energy Resources on the grid and create open market places for transparent and efficient renewable energy trading.

- To learn about more about the EW-DOS tech stack, see our [documentation](https://app.gitbook.com/@energy-web-foundation/s/energy-web/).

- For an overview of the energy-sector challenges our use cases address, go [here](https://app.gitbook.com/@energy-web-foundation/s/energy-web/our-mission).

For a deep-dive into the motivation and methodology behind our technical solutions, we encourage you to read our White Papers:

- [Energy Web White Paper on Vision and Purpose](https://www.energyweb.org/reports/EWDOS-Vision-Purpose/)
- [Energy Web  White Paper on Technology Detail](https://www.energyweb.org/wp-content/uploads/2020/06/EnergyWeb-EWDOS-PART2-TechnologyDetail-202006-vFinal.pdf)


## Connect with Energy Web
- [Twitter](https://twitter.com/energywebx)
- [Discord](https://discord.com/channels/706103009205288990/843970822254362664)
- [Telegram](https://t.me/energyweb)

## License

This project is licensed under the GNU General Public License v3.0 or later - see the [LICENSE](LICENSE) file for details

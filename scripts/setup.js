const ethers = require('ethers')

/**
 * TODO:
 *   - deploy smart contracts
 *   - register node
 *   - register emsp
 */

const wallet = new ethers.Wallet(
  'c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3',
  new ethers.providers.JsonRpcProvider('http://localhost:8545')
)
console.log('DEPLOYER =', wallet.address)

const Registry = require('./contracts/Registry.json')
const Permissions = require('./contracts/Permissions.json')


const registryFactory = new ethers.ContractFactory(
  Registry.abi,
  Registry.bytecode,
  wallet
)
const permissionsFactory = new ethers.ContractFactory(
  Permissions.abi,
  Permissions.bytecode,
  wallet
  )

async function main() {
  console.log('Deploying OCN Registry contract...')
  const registry = await registryFactory.deploy()
  await registry.deployTransaction.wait()
  console.log('REGISTRY =', registry.address)

  console.log('Deploying OCN Permissions contract...')
  const permissions = await permissionsFactory.deploy(registry.address)
  await permissions.deployTransaction.wait()
  console.log('PERMISSIONS =', permissions.address)

}

main()

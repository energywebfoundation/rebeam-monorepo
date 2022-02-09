const ethers = require('ethers')
const axios = require('axios')

/**
 * TODO:
 *   - register node
 *   - register emsp
 */

const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545')

const deployer = new ethers.Wallet(
  'c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3',
  provider
)
console.log('DEPLOYER =', deployer.address)

const Registry = require('./contracts/Registry.json')
const Permissions = require('./contracts/Permissions.json')


const registryFactory = new ethers.ContractFactory(
  Registry.abi,
  Registry.bytecode,
  deployer
)
const permissionsFactory = new ethers.ContractFactory(
  Permissions.abi,
  Permissions.bytecode,
  deployer
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

  console.log('Registering OCN Node...')
  const node = new ethers.Wallet(
    'ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f',
    provider
  )
  const asNode = new ethers.Contract(registry.address, Registry.abi, node)
  const setNodeTx = await asNode.setNode('http://ocn-node:8080')
  await setNodeTx.wait()
  const registeredUrl = await asNode.getNode(node.address)
  console.log('Node registered on', registeredUrl)

  console.log('Registering eMSP...')
  console.log('Generating OCPI TOKEN_A for eMSP...')
  const { data: { token} } = await axios.post(
    'http://localhost:8080/admin/generate-registration-token',
    [{
      country_code: 'DE',
      party_id: 'REB'
    }],
    { headers: { Authorization: 'Token randomkey'} }
  )
  console.log('TOKEN_A =', token)
  console.log('Registering eMSP credentials with OCN Node...')
  await axios.post('http://localhost:3000/ocn/register', {
    tokenA: token,
    nodeURL: registeredUrl
  })
  console.log('Registered eMSP. Setup complete!')
}

main()

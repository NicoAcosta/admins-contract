// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat')

async function main() {
	// Hardhat always runs the compile task when running scripts with its command
	// line interface.
	//
	// If this script is run directly using `node` you may want to call compile
	// manually to make sure everything is compiled
	// await hre.run('compile');

	// We get the contract to deploy
	const Admins = await hre.ethers.getContractFactory('Admin')
	const contract = await Admins.deploy()

	await contract.deployed()
	;[owner, addr1, addr2, addr3, addr4] = await ethers.getSigners()

	console.log('Admins contract deployed to:')
	console.log(contract.address)
	console.log('Deployed by:')
	console.log(owner.address)

	const addAdmin1 = await contract.addAdmin(addr1.address)
	await addAdmin1.wait()

	const addAdmin2 = await contract.addAdmin(addr2.address)
	await addAdmin2.wait()

	console.log('New admins:')
	console.log('Address 1: ', addr1.address)
	console.log('Address 2: ', addr2.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})

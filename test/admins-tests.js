const {expect} = require('chai')
// const {ethers} = require('ethers')

describe('Admins', function () {
	let Admins
	let contract
	let owner
	let addr1
	let addr2
	let addr3
	let addr4

	beforeEach(async function () {
		Admins = await ethers.getContractFactory('Admins')
		contract = await Admins.deploy()
		await contract.deployed()
		;[owner, addr1, addr2, addr3, addr4] = await ethers.getSigners()
	})

	describe('Deployment', function () {
		// Ownable
		it('Should set the sender as owner', async function () {
			expect(await contract.owner()).to.equal(owner.address)
		})

		it('Should set the owner as admin', async function () {
			expect(await contract.isAdmin()).to.equal(true)
		})

		it('Should not set other addresses as admins', async function () {
			expect(await contract.connect(addr1).isAdmin()).to.equal(false)
			expect(await contract.connect(addr2).isAdmin()).to.equal(false)
		})
	})

	describe('Adding admins', function () {
		it('Should add admins', async function () {
			expect(await contract.connect(addr1).isAdmin()).to.equal(false)
			expect(await contract.connect(addr2).isAdmin()).to.equal(false)

			const addAdmin1 = await contract.addAdmin(addr1.address)
			await addAdmin1.wait()

			const addAdmin2 = await contract.addAdmin(addr2.address)
			await addAdmin2.wait()

			expect(await contract.connect(addr1).isAdmin()).to.equal(true)
			expect(await contract.connect(addr2).isAdmin()).to.equal(true)
		})

		it('Should fail if address is already admin', async function () {
			expect(await contract.connect(addr1).isAdmin()).to.equal(false)

			const addAdmin1 = await contract.addAdmin(addr1.address)
			await addAdmin1.wait()

			expect(await contract.connect(addr1).isAdmin()).to.equal(true)

			await expect(contract.addAdmin(addr1.address)).to.be.revertedWith(
				'Admins: Address is already admin.'
			)
		})

		it('Should fail if sender is not the owner', async function () {
			await expect(
				contract.connect(addr1).addAdmin(addr2.address)
			).to.be.revertedWith('Ownable: caller is not the owner')

			// even if it is an admin
			const addAdmin1 = await contract.addAdmin(addr1.address)
			await addAdmin1.wait()

			expect(await contract.connect(addr1).isAdmin()).to.equal(true)
			await expect(
				contract.connect(addr1).addAdmin(addr2.address)
			).to.be.revertedWith('Ownable: caller is not the owner')
		})

		it('Should add multiple admins', async function () {
			expect(await contract.connect(addr1).isAdmin()).to.equal(false)
			expect(await contract.connect(addr2).isAdmin()).to.equal(false)
			expect(await contract.connect(addr3).isAdmin()).to.equal(false)

			const addAdmins = await contract.addAdmins([
				addr1.address,
				addr2.address,
				addr3.address,
			])
			await addAdmins.wait()

			expect(await contract.connect(addr1).isAdmin()).to.equal(true)
			expect(await contract.connect(addr2).isAdmin()).to.equal(true)
			expect(await contract.connect(addr3).isAdmin()).to.equal(true)
		})
	})

	describe('Removing admins', function () {
		beforeEach(async function () {
			const addAdmin1 = await contract.addAdmin(addr1.address)
			await addAdmin1.wait()
		})

		it('Should remove admins', async function () {
			expect(await contract.connect(addr1).isAdmin()).to.equal(true)

			const removeAdmin1 = await contract.removeAdmin(addr1.address)
			await removeAdmin1.wait()

			expect(await contract.connect(addr1).isAdmin()).to.equal(false)
		})

		it('Should fail if address is not admin', async function () {
			expect(await contract.connect(addr3).isAdmin()).to.equal(false)

			await expect(contract.removeAdmin(addr3.address)).to.be.revertedWith(
				'Admins: Address is not admin.'
			)
		})

		it('Should fail if sender is not the owner', async function () {
			await expect(
				contract.connect(addr2).addAdmin(addr3.address)
			).to.be.revertedWith('Ownable: caller is not the owner')

			// even if it is an admin
			expect(await contract.connect(addr1).isAdmin()).to.equal(true)
			await expect(
				contract.connect(addr1).addAdmin(addr3.address)
			).to.be.revertedWith('Ownable: caller is not the owner')
		})
	})

	describe('Modifier', function () {
		beforeEach(async function () {
			const addAdmin1 = await contract.addAdmin(addr1.address)
			await addAdmin1.wait()

			const addAdmin2 = await contract.addAdmin(addr2.address)
			await addAdmin2.wait()
		})

		//	isAdminAddress uses onlyAdmins modifier
		//	reverts if sender is not an admin

		it('Should call function if sender is admin', async function () {
			expect(await contract.connect(addr1).isAdmin()).to.equal(true)

			expect(
				await contract.connect(addr1).isAdminAddress(addr2.address)
			).to.equal(true)

			expect(
				await contract.connect(addr1).isAdminAddress(addr3.address)
			).to.equal(false)
		})

		it('Should fail is sender is not admin', async function () {
			expect(await contract.connect(addr3).isAdmin()).to.equal(false)

			await expect(
				contract.connect(addr3).isAdminAddress(addr4.address)
			).to.be.revertedWith('Admins: caller is not an admin.')
		})
	})
})

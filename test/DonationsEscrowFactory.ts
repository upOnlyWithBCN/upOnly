import '@nomiclabs/hardhat-ethers'
import { expect } from 'chai'
import hre from 'hardhat'

describe('DonationsEscrowFactory', function () {
    test('Should deploy fine', async function () {
        const EscrowFactory = await hre.ethers.getContractFactory(
            'DonationsEscrowFactory'
        )
        const deployedFactory = await EscrowFactory.deploy(
            '0x73E05Ef7775ecA892251C76C084a8fE3CD6A391D',
            '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
        )

        const [owner, otherAccount] = await hre.ethers.getSigners()
        expect(await deployedFactory.owner()).to.equal(owner.address)
        console.log(owner, 'owner')
    })
})

const chai = require('chai');

const { expect } = chai;
const BN = require('bn.js');
const crypto = require('crypto');
const erc20 = require('./erc20_interface.js');

describe('ERC20 Huff contract', () => {
    const owner = new BN(crypto.randomBytes(20), 16);
    const user1 = new BN(crypto.randomBytes(20), 16);
    const value1 = new BN(12000);

    before(async () => {
        await erc20.init(owner);
    });

    it('balances and totalSupply initialised to 0', async () => {
        const balance1 = await erc20.getBalanceOf(owner);
        expect(balance1.eq(new BN(0))).to.equal(true);
        const balance2 = await erc20.getBalanceOf(user1);
        expect(balance2.eq(new BN(0))).to.equal(true);
    });

    it('mint tokens to owner', async () => {
        await erc20.mint(owner, owner, value1);
        const ownerBalance = await erc20.getBalanceOf(owner);
        expect(ownerBalance.eq(value1)).to.equal(true);
    });

    it('test that sqrt function', async () => {
        const totalSupply = await erc20.getTotalSupply();
        console.log(totalSupply.toString());
        // Check that sqrt(400) = 20
        expect(totalSupply.eq(new BN(20))).to.equal(true);
    });
});

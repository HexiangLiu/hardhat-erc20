import { deployments, ethers, getNamedAccounts, network } from 'hardhat';
import { expect, assert } from 'chai';
import { developmentChanins, initialSupply } from '../../const';
import { XIANGToken } from '../../typechain-types';

!developmentChanins.includes(network.name)
  ? describe.skip
  : describe('Zeppelin Unit test', () => {
      let deployer: string;
      let user1: string;
      let XIANGToken: XIANGToken;
      beforeEach(async () => {
        await deployments.fixture(['XIANGToken']);
        ({ deployer, user1 } = await getNamedAccounts());
        XIANGToken = await ethers.getContract('XIANGToken', deployer);
      });
      describe('Constructor', () => {
        it('Should have correct INITIAL_SUPPLY of token', async () => {
          const balance = await XIANGToken.balanceOf(deployer);
          expect(balance.toString()).to.equal(initialSupply);
        });
        it('Initialize the token with correct name and symbol', async () => {
          const name = await XIANGToken.name();
          const symbol = await XIANGToken.symbol();
          expect(name).to.equal('XiangToken');
          expect(symbol).to.equal('XT');
        });
      });
      describe('Transfer', () => {
        it('Should be able to transfer tokens to an address', async () => {
          const tokenToSend = ethers.parseEther('10');
          await XIANGToken.transfer(user1, tokenToSend);
          expect(await XIANGToken.balanceOf(user1)).to.equal(tokenToSend);
        });
      });
      describe('Allowances', () => {
        let PLAYERToken: XIANGToken;
        const amount = (20 * 10 * 10 ** 18).toString();
        beforeEach(async () => {
          PLAYERToken = await ethers.getContract('XIANGToken', user1);
        });
        it('Should approve other address to spend token', async () => {
          const tokensToSpend = ethers.parseEther('5');
          //Deployer is approving that user1 can spend 5 of their precious OT's
          await XIANGToken.approve(user1, tokensToSpend);
          await PLAYERToken.transferFrom(deployer, user1, tokensToSpend);
          expect(await PLAYERToken.balanceOf(user1)).to.equal(tokensToSpend);
        });
        it("doesn't allow an unnaproved member to do transfers", async () => {
          await expect(
            XIANGToken.transferFrom(deployer, user1, amount)
          ).to.be.revertedWith('ERC20: transfer amount exceeds allowance');
        });
        it('the allowance being set is accurate', async () => {
          await XIANGToken.approve(user1, amount);
          const allowance = await XIANGToken.allowance(deployer, user1);
          assert.equal(allowance.toString(), amount);
        });
      });
    });

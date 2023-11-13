import { network } from 'hardhat';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { developmentChanins, initialSupply } from '../const';
import { verify } from '../utils/verify';

async function main(hre: HardhatRuntimeEnvironment) {
  const {
    getNamedAccounts,
    deployments: { deploy, log },
  } = hre;
  const { deployer } = await getNamedAccounts();
  const args = [initialSupply];
  const XIANGToken = await deploy('XIANGToken', {
    from: deployer,
    args,
    log: true,
  });
  if (!developmentChanins.includes(network.name)) {
    log('Verifying...');
    await verify(XIANGToken.address, args);
  }
  log('--------------------------');
}

main.tags = ['XIANGToken'];

export default main;

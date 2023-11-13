import { run } from 'hardhat';

export const verify = async (address: string, args: any[]) => {
  await run('verify:verify', {
    address,
    constructorArguments: args,
    contract: 'contracts/XIANGToken.sol:XIANGToken',
  });
};

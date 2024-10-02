import { useChainId } from 'wagmi';

const contractAddresses: {
    [key: number]: `0x${string}`;
} = {
    1: '0x5a7901d2c9C52C7149F9D4dA35f92242eB5d9992', // mainnet
    4: '0xF3aE5E81E6469bAD34D429b2E8b94cc07Bee32ee', // rinkeby
    11155111: '0x116E48351fdeAf2CF313eDF2435E150Cb94Db0A9', // sepolia
    1337: '0xb30994e8201462CB402c2e43Cf3FF0F3070E2b8b', // ganache
};

export function useContractAddress(): `0x${string}` | undefined {
    const chainId = useChainId();
    return contractAddresses[chainId];
}

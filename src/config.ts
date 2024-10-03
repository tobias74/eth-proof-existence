import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia } from 'wagmi/chains';
import { defineChain } from 'viem';

// Define the local Ganache chain
const ganacheChain = defineChain({
    id: 1337,
    name: 'Ganache',
    network: 'ganache',
    nativeCurrency: {
        decimals: 18,
        name: 'Ethereum',
        symbol: 'ETH',
    },
    rpcUrls: {
        default: { http: ['http://localhost:7545'] },
        public: { http: ['http://localhost:7545'] },
    },
    blockExplorers: {
        default: { name: 'Ganache Explorer', url: 'http://localhost:7545' },
    },
    testnet: true,
});

export const config = getDefaultConfig({
    appName: 'Proof Of Existence',
    projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
    chains: [mainnet, ganacheChain, sepolia],
});
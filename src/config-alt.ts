import { createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { defineChain } from 'viem';
import { http } from 'viem';
import { injected, walletConnect } from 'wagmi/connectors';

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

// Create the wagmi config
export const config = createConfig({
    chains: [/*mainnet,*/ ganacheChain, sepolia],
    connectors: [
        injected(),
        walletConnect({ projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID }),
    ],
    transports: {
        //[mainnet.id]: http(),
        [sepolia.id]: http(),
        [ganacheChain.id]: http('http://localhost:7545'),
    },
});
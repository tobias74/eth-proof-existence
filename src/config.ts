import { http, createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { injected, metaMask, safe } from 'wagmi/connectors';
import { defineChain } from 'viem';

// Define the local Ganache chain
export const ganacheChain = defineChain({
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

export const config = createConfig({
    connectors: [
        injected(),  // Browser extensions like MetaMask, Brave, etc.
        metaMask(),  // Direct MetaMask connector
        safe(),      // Safe (formerly Gnosis Safe) for multisig wallets
    ],
    chains: [mainnet, sepolia, ganacheChain],
    transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
        [ganacheChain.id]: http('http://localhost:7545'),
    },
});
import { useChainId } from 'wagmi';

export function useBlockExplorerUrl() {
    const chainId = useChainId();

    const getBlockExplorerUrl = (blockNumber: bigint) => {
        switch (chainId) {
            case 1: // Mainnet
                return `https://etherscan.io/block/${blockNumber}`;
            case 11155111: // Sepolia
                return `https://sepolia.etherscan.io/block/${blockNumber}`;
            case 1337: // Ganache
                return `http://localhost:7545/block/${blockNumber}`;
            // Add more networks as needed
            default:
                return null;
        }
    };

    return getBlockExplorerUrl;
}

import { useChainId } from 'wagmi';

interface NetworkInfo {
    name: string;
    chainId: number;
}

export function useNetworkName(): NetworkInfo {
    const chainId = useChainId();

    const getNetworkName = (id: number): string => {
        switch (id) {
            case 1:
                return 'Ethereum Mainnet';
            case 11155111:
                return 'Sepolia Testnet';
            case 1337:
                return 'Ganache Testnet';
            default:
                return 'Unknown Network';
        }
    };

    return {
        name: getNetworkName(chainId),
        chainId,
    };
}
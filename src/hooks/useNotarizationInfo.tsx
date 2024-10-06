import { useState, useEffect } from 'react';
import { usePublicClient, useReadContract } from 'wagmi';
import NotarizerABI from '../eth/notarizer-abi';
import { useContractAddress } from './useContractAddress';

interface NotarizationInfo {
    isPending: boolean;
    isNotarized: boolean;
    blockNumber: bigint | undefined;
    miningTime: string | undefined;
    refetchHashData: () => void;
}

export function useNotarizationInfo(fileHash: any): NotarizationInfo {

    const [isNotarized, setIsNotarized] = useState(false);
    const [blockNumber, setBlockNumber] = useState<bigint | undefined>(undefined);
    const [miningTime, setMiningTime] = useState<string | undefined>(undefined);
    const publicClient = usePublicClient();

    const contractAddress = useContractAddress();

    const { data: hashData, refetch: refetchHashData, isPending } = useReadContract({
        address: contractAddress,
        abi: NotarizerABI,
        functionName: 'getByHash',
        args: fileHash ? [`0x${fileHash}`] : undefined,
    });

    useEffect(() => {
        console.log('filehash changed!!!!!!!!!!!!!!!!!!!!!!!!!!');
        if (!fileHash) {
            setIsNotarized(false);
            setBlockNumber(undefined);
            setMiningTime(undefined);
        }
    }, [fileHash]);


    useEffect(() => {
        async function updateNotarizationInfo() {
            if (hashData) {
                const [timestamp, blockNumberBigInt] = hashData;
                if (BigInt(timestamp) > 0n) {
                    setIsNotarized(true);
                    setBlockNumber(BigInt(blockNumberBigInt.toString()));
                    try {
                        const block = await publicClient!.getBlock({ blockNumber: BigInt(blockNumberBigInt.toString()) });
                        setMiningTime(new Date(Number(block.timestamp) * 1000).toLocaleString());
                    } catch (error) {
                        console.error('Error fetching block details:', error);
                        setMiningTime(undefined);
                    }
                } else {
                    setIsNotarized(false);
                    setBlockNumber(undefined);
                    setMiningTime(undefined);
                }
            }
        }
        updateNotarizationInfo();
    }, [hashData, publicClient]);

    return { isPending, isNotarized, blockNumber, miningTime, refetchHashData };
}

import React from 'react';
import { useChainId, usePublicClient, useAccount } from 'wagmi';
import { useContractAddress } from '../../hooks/useContractAddress';

export function NetworkInfo() {
    const chainId = useChainId();
    const publicClient = usePublicClient();
    const { address } = useAccount();
    const contractAddress = useContractAddress();

    return (
        <div className="mb-4 p-4 bg-blue-100 rounded">
            <h2 className="text-lg font-semibold mb-2">Network Information</h2>
            <p><strong>Chain ID:</strong> {chainId}</p>
            <p><strong>Network Name:</strong> {publicClient!.chain.name || 'Unknown'}</p>
            <p><strong>Network Type:</strong> {publicClient!.chain.testnet ? 'Testnet' : 'Mainnet'}</p>
            <p><strong>Your Address:</strong> {address}</p>
            {contractAddress ? (
                <p><strong>Contract Address:</strong> {contractAddress}</p>
            ) : (
                <p className="text-red-500">No contract deployed on this network</p>
            )}
        </div>
    );
}
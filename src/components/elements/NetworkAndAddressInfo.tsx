import React from 'react';
import { useTranslation } from 'react-i18next';
import { AbbreviatedHex } from './AbbreviatedHex';

interface NetworkAndAddressInfoProps {
    networkName: string;
    chainId: number;
    address: string;
    contractAddress: string;
}

export const NetworkAndAddressInfo: React.FC<NetworkAndAddressInfoProps> = ({
    networkName,
    chainId,
    address,
    contractAddress,
}) => {
    const { t } = useTranslation();

    return (
        <>
            <div className="flex flex-col items-center mb-4">
                <h1 className="text-2xl font-bold">{networkName}</h1>
                <span className="text-sm text-gray-500">(Chain ID: {chainId})</span>
            </div>

            <div className="text-sm text-gray-600 mb-6">
                <div className="flex flex-col items-center gap-y-2">
                    <AbbreviatedHex value={address || ''} label={t('yourAddress')} />
                    <AbbreviatedHex value={contractAddress || ''} label={t('contractAddress')} />
                </div>
            </div>
        </>
    );
};
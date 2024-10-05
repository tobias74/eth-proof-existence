import React from 'react';
import { useTranslation } from 'react-i18next';
import { AccountConnector } from './AccountConnector'; // Assuming this is the correct import path
import { useAppState } from '../../AppState';

export const ConnectWalletPrompt: React.FC = () => {
    const { t } = useTranslation();
    const { walletConnectEnabled, setWalletConnectEnabled } = useAppState();

    return (
        <div className="flex flex-col items-center bg-gray-100 p-4">
            <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
                <h2 className="text-2xl font-bold mb-4">{t('connectWalletTitle')}</h2>
                <p className="text-gray-600 mb-6">
                    {t('connectWalletDescription')}
                </p>
                <div className="mb-6">
                    <AccountConnector />
                </div>
                <p className="text-sm text-gray-500">
                    {/*t('connectWalletHelp')*/}
                </p>
            </div>
        </div>
    );
};

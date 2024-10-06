import React from 'react';
import { useTranslation } from 'react-i18next';
import { Switch } from '@headlessui/react';
import { AccountConnector } from './AccountConnector';
import { useAppState } from '../../AppState';

export const ConnectWalletPrompt: React.FC = () => {
    const { t } = useTranslation();
    const { walletConnectEnabled, setWalletConnectEnabled } = useAppState();

    return (
        <div className="flex flex-col items-center bg-gray-100 py-4">
            <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
                <h2 className="text-2xl font-bold mb-4">{t('connectWalletTitle')}</h2>
                <p className="text-gray-600 mb-6">
                    {t('connectWalletDescription')}
                </p>
                <div className="mb-6">
                    <AccountConnector />
                </div>
                {/* Added mt-8 for more vertical space */}
                <div className="mt-12 flex items-center justify-between mb-4">
                    <span className="text-sm font-medium">{t('enableWalletConnectCloud')}</span>
                    <Switch
                        checked={walletConnectEnabled}
                        onChange={setWalletConnectEnabled}
                        className={`${walletConnectEnabled ? 'bg-blue-600' : 'bg-gray-300'
                            } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    >
                        <span className="sr-only">{t('enableWalletConnectCloud')}</span>
                        <span
                            className={`${walletConnectEnabled ? 'translate-x-2' : '-translate-x-2'
                                } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                        />
                    </Switch>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                    {t('walletConnectPrivacyInfo')}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                    {t('ipAddressVisibility')}
                </p>
                <a
                    href="https://reown.com/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                >
                    {t('reownPrivacyPolicyLink')}
                </a>
            </div>
        </div>
    );
};
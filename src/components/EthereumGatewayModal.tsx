import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useTranslation } from 'react-i18next';

interface EthereumGatewayModalProps {
    onAccept: () => void;
    onDecline: () => void;
}

export const EthereumGatewayModal: React.FC<EthereumGatewayModalProps> = ({ onAccept, onDecline }) => {
    const [isOpen, setIsOpen] = useState(true);
    const { t } = useTranslation();

    const handleAccept = () => {
        setIsOpen(false);
        onAccept();
    };

    const handleDecline = () => {
        setIsOpen(false);
        onDecline();
    };

    return (
        <Dialog open={isOpen} onClose={() => { }} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
                <Dialog.Panel className="mx-auto max-w-2xl rounded bg-white p-6">
                    <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 mb-4">
                        {t('ethereumGatewayNotice')}
                    </Dialog.Title>
                    <Dialog.Description className="text-sm text-gray-500 mb-4">
                        {t('ethereumGatewayDescription')}
                    </Dialog.Description>
                    <div className="text-sm text-gray-700 mb-4">
                        <p className="mb-2">{t('privacyImplications')}</p>
                        <ul className="list-disc list-inside mb-2">
                            <li>{t('ipAddressSharing')}</li>
                            <li>{t('dataProcessing')}</li>
                            <li>{t('thirdPartyAccess')}</li>
                        </ul>
                        <p>
                            {t('cloudflarePrivacyPolicy')}{' '}
                            <a
                                href="https://www.cloudflare.com/privacypolicy/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                {t('cloudflarePrivacyPolicyLink')}
                            </a>
                        </p>
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={handleDecline}
                            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        >
                            {t('decline')}
                        </button>
                        <button
                            onClick={handleAccept}
                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        >
                            {t('accept')}
                        </button>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};
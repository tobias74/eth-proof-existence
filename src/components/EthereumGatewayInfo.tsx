import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface EthereumGatewayInfoProps {
    onAccept: () => void;
    onDecline: () => void;
}

export const EthereumGatewayInfo: React.FC<EthereumGatewayInfoProps> = ({ onAccept, onDecline }) => {
    const { t } = useTranslation();

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">{t('ethereumGatewayTitle')}</h1>

            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6" role="alert">
                <p className="font-bold">{t('importantNotice')}</p>
                <p>{t('gatewayDescription')}</p>
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">{t('whatIsEthereumGateway')}</h2>
                <p className="mb-2">{t('gatewayExplanation')}</p>
                <p>{t('gatewayUsage')}</p>
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">{t('whyWeNeedThis')}</h2>
                <ul className="list-disc list-inside">
                    <li>{t('enableBlockchainInteraction')}</li>
                    <li>{t('provideFeatures')}</li>
                    <li>{t('ensureReliability')}</li>
                </ul>
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">{t('privacyConsiderations')}</h2>
                <p className="mb-2">{t('dataShared')}</p>
                <p>{t('privacyMeasures')}</p>
                <p>
                    <Link to="/privacy" className="text-blue-600 hover:underline">
                        {t('privacyPolicyLink')}
                    </Link>
                </p>
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">{t('yourChoice')}</h2>
                <p className="mb-4">{t('choiceExplanation')}</p>
                <div className="flex space-x-4">
                    <button
                        onClick={onAccept}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                    >
                        {t('acceptGateway')}
                    </button>
                    <button
                        onClick={onDecline}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                    >
                        {t('declineGateway')}
                    </button>
                </div>
            </div>

            <div className="mt-8 text-sm text-gray-600">
                <p>{t('exploreAppNotice')} <Link to="/" className="text-blue-600 hover:underline">{t('homePage')}</Link>.</p>
            </div>
        </div>
    );
};
import React from 'react';
import { useTranslation } from 'react-i18next';


export const GatewayAccessDenied: React.FC<{
    onReopen: () => void;
}> = ({ onReopen }) => {
    const { t } = useTranslation();

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">{t('gatewayAccessDeniedTitle')}</h1>

            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
                <p className="font-bold">{t('limitedAccessWarning')}</p>
                <p>{t('limitedAccessDescription')}</p>
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">{t('whyThisHappened')}</h2>
                <p className="mb-2">{t('gatewayExplanationDenied')}</p>
                <p>{t('privacyChoiceRespect')}</p>
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">{t('whatYouCanDo')}</h2>
                <ul className="list-disc list-inside">
                    <li>{t('exploreNonBlockchainFeatures')}</li>
                    <li>{t('learnMoreAboutBlockchain')}</li>
                    <li>{t('reconsiderDecision')}</li>
                </ul>
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">{t('changeYourMind')}</h2>
                <p className="mb-4">{t('decisionNotFinal')}</p>
                <button
                    onClick={onReopen}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                >
                    {t('reviewDecision')}
                </button>
            </div>
        </div>
    );
};
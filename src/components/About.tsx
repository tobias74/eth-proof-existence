import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export function About() {
    const { t } = useTranslation();

    return (
        <>
            <h1 className="text-3xl font-bold mb-6">{t('aboutTitle')}</h1>

            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6" role="alert">
                <p className="font-bold">{t('aboutMission')}</p>
                <p>{t('aboutMissionDescription')}</p>
            </div>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">{t('whatWeDoTitle')}</h2>
                <p className="mb-4">{t('whatWeDoDescription')}</p>
                <ul className="list-disc list-inside space-y-2">
                    <li>{t('featureNotarization')}</li>
                    <li>{t('featureVerification')}</li>
                    <li>{t('featureTimestamping')}</li>
                    <li>{t('featureAccessibility')}</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">{t('howItWorksTitle')}</h2>
                <ol className="list-decimal list-inside space-y-4">
                    <li>
                        <span className="font-semibold">{t('stepUpload')}</span>
                        <p className="ml-6 mt-2">{t('stepUploadDescription')}</p>
                    </li>
                    <li>
                        <span className="font-semibold">{t('stepHash')}</span>
                        <p className="ml-6 mt-2">{t('stepHashDescription')}</p>
                    </li>
                    <li>
                        <span className="font-semibold">{t('stepBlockchain')}</span>
                        <p className="ml-6 mt-2">{t('stepBlockchainDescription')}</p>
                    </li>
                    <li>
                        <span className="font-semibold">{t('stepVerify')}</span>
                        <p className="ml-6 mt-2">{t('stepVerifyDescription')}</p>
                    </li>
                </ol>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">{t('whyUseUsTitle')}</h2>
                <ul className="list-disc list-inside space-y-2">
                    <li>{t('benefitSecurity')}</li>
                    <li>{t('benefitTransparency')}</li>
                    <li>{t('benefitImmutability')}</li>
                    <li>{t('benefitAccessibility')}</li>
                    <li>{t('benefitCostEffective')}</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">{t('privacySecurityTitle')}</h2>
                <p className="mb-4">{t('privacySecurityDescription')}</p>
                <p>
                    <Link to="/privacy" className="text-blue-600 hover:underline">
                        {t('privacyPolicyLink')}
                    </Link>
                </p>
            </section>

            <div className="mt-8 text-sm text-gray-600">
                <p>{t('getStartedPrompt')} <Link to="/" className="text-blue-600 hover:underline">{t('homePage')}</Link>.</p>
            </div>
        </>
    );
}
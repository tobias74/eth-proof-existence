import React from 'react';
import { useTranslation } from 'react-i18next';
import { PrivacyEN } from './privacy/PrivacyEN';
import { PrivacyDE } from './privacy/PrivacyDE';

export function Privacy() {
    const { i18n } = useTranslation();

    return (
        <div className="privacy-page">
            <h1 className="text-2xl font-bold mb-4">
                {i18n.language === 'de' ? 'Datenschutzerklärung' : 'Privacy Policy'}
            </h1>
            {i18n.language === 'de' ? <PrivacyDE /> : <PrivacyEN />}
        </div>
    );
}
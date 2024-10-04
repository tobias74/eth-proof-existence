import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export function About() {
    const { t } = useTranslation();

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">{t('aboutTitle')}</h1>

            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6" role="alert">
                <p className="font-bold">{t('aboutMission')}</p>
                <p>{t('aboutMissionDescription')}</p>
            </div>

            <section className="mb-8">
                <p className="mb-4">{t('aboutExperimentalDescription')}</p>
                <p className="mb-4">{t('aboutTechnicalDetails')}</p>
            </section>

        </div>
    );
}
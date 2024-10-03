import React from 'react';
import { useTranslation } from 'react-i18next';

interface GatewayAccessDeniedProps {
    onReopen: () => void;
}

export const GatewayAccessDenied: React.FC<GatewayAccessDeniedProps> = ({ onReopen }) => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('accessDenied')}</h2>
                <p className="text-gray-600 mb-6">{t('accessDeniedDescription')}</p>
                <button
                    onClick={onReopen}
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                    {t('reevaluateDecision')}
                </button>
            </div>
        </div>
    );
};
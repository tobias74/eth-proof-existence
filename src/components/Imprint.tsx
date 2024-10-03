import React from 'react';
import { useTranslation } from 'react-i18next';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';

export function Imprint() {
    const { t } = useTranslation();

    return (
        <>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">{t('imprint')}</h1>

            <div className="bg-white rounded-lg overflow-hidden">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">tobiga UG (haftungsbeschränkt)</h2>

                <div className="space-y-2 text-gray-600">
                    <p>Tobias Gassmann</p>
                    <p>Bodenseestr. 4a</p>
                    <p>81241 München</p>
                </div>

                <div className="mt-6 space-y-2 text-gray-600">
                    <p><span className="font-medium">HRB:</span> 219431</p>
                    <p><span className="font-medium">USt-IdNr.:</span> DE 301206623</p>
                </div>

            </div>
        </>
    );
}
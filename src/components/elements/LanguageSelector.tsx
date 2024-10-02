import React from 'react';
import { useTranslation } from 'react-i18next';
import { GlobeAltIcon } from '@heroicons/react/24/outline';

export const LanguageSelector: React.FC = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        i18n.changeLanguage(event.target.value);
    };

    return (
        <div className="relative inline-block">
            <GlobeAltIcon className="h-5 w-5 text-gray-300 absolute left-2 top-1/2 transform -translate-y-1/2" />
            <select
                onChange={changeLanguage}
                value={i18n.language}
                className="bg-gray-700 text-gray-300 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white py-1 pl-8 pr-2 appearance-none cursor-pointer hover:bg-gray-600 transition duration-150 ease-in-out"
            >
                <option value="en">EN</option>
                <option value="de">DE</option>
            </select>
        </div>
    );
};
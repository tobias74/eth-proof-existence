import React from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageSelector: React.FC = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        i18n.changeLanguage(event.target.value);
    };

    return (
        <select
            onChange={changeLanguage}
            value={i18n.language}
            className="bg-gray-700 text-gray-300 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white py-1 px-2 appearance-none cursor-pointer hover:bg-gray-600 transition duration-150 ease-in-out"
        >
            <option value="en">English</option>
            <option value="de">Deutsch</option>
        </select>
    );
};
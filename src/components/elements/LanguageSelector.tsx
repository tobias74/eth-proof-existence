import React from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageSelector: React.FC = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        i18n.changeLanguage(event.target.value);
    };

    return (
        <select onChange={changeLanguage} value={i18n.language}>
            <option value="en">English</option>
            <option value="de">Deutsch</option>
        </select>
    );
};
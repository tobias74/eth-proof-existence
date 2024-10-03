import React from 'react';
import { useTranslation } from 'react-i18next';
import { PrivacyEN } from './privacy/PrivacyEN';
import { PrivacyDE } from './privacy/PrivacyDE';
import styles from './Privacy.module.css';

export function Privacy() {
    const { i18n } = useTranslation();

    return (
        <div className={styles.container}>
            {i18n.language === 'de' ? <PrivacyDE /> : <PrivacyEN />}
        </div>
    );
}
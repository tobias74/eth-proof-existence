import React from 'react';
import { useTranslation } from 'react-i18next';

interface NotarizationInfoProps {
    blockNumber: bigint | undefined;
    miningTime: string | undefined;
    isNotarized: boolean;
    blockExplorerUrl: string | null;
}

export const NotarizationInfo: React.FC<NotarizationInfoProps> = ({
    blockNumber,
    miningTime,
    isNotarized,
    blockExplorerUrl
}) => {
    const { t } = useTranslation();

    if (!isNotarized) {
        return (
            <div className="mt-4 p-4 bg-gray-100 rounded">
                <p>{t('fileNotNotarized')}</p>
            </div>
        );
    }

    return (
        <div className="mt-4 p-4 bg-gray-100 rounded">
            <p>
                {t('fileNotarizedAt', { blockNumber: blockNumber?.toString() })}
                {blockExplorerUrl && (
                    <> (
                        <a
                            href={blockExplorerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                        >
                            {t('viewOnExplorer')}
                        </a>
                        )</>
                )}
            </p>
            {miningTime && <p>{t('minedOn', { miningTime })}</p>}
        </div>
    );
};
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
            <div className="text-yellow-700">
                <p>{t('fileNotNotarized')}</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <p>
                <span className="font-medium">{t('notarizedAtBlock')}:</span> {blockNumber?.toString()}
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
            {miningTime && (
                <p>
                    <span className="font-medium">{t('minedOn')}:</span> {miningTime}
                </p>
            )}
        </div>
    );
};
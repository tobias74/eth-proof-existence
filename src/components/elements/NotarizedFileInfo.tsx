import React from 'react';
import { useTranslation } from 'react-i18next';
import { useBlockExplorerUrl } from '../../hooks/useBlockExplorerUrl';

interface NotarizedFileInfoProps {
    networkName: string;
    blockNumber: bigint | undefined;
    miningTime: string | undefined;
}

export const NotarizedFileInfo: React.FC<NotarizedFileInfoProps> = ({ networkName, blockNumber, miningTime }) => {
    const { t } = useTranslation();
    const getBlockExplorerUrl = useBlockExplorerUrl();

    return (
        <div className="mt-2 text-sm text-center">
            <p className="text-green-600 font-medium text-xl">{t('fileNotarized', { networkName })}</p>
            <p>
                {t('notarizedAtBlock', { block: blockNumber?.toString() })}
                {getBlockExplorerUrl(blockNumber!) && (
                    <> (
                        <a
                            href={getBlockExplorerUrl(blockNumber!) as string}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                        >
                            {t('viewOnExplorer')}
                        </a>
                        )</>
                )}
            </p>
            {miningTime && <p>{t('minedOn', { time: miningTime })}</p>}
        </div>
    );
};

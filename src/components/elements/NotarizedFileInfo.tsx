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
        <div className="mt-3 sm:mt-4 text-center">
            <p className="text-green-600 font-medium text-lg sm:text-xl mb-2 sm:mb-3">
                {t('fileNotarized', { networkName })}
            </p>
            <p className="text-sm sm:text-base mb-1 sm:mb-2">
                {t('notarizedAtBlock', { block: blockNumber?.toString() })}
                {getBlockExplorerUrl(blockNumber!) && (
                    <span className="block sm:inline mt-1 sm:mt-0">
                        {' '}(
                        <a
                            href={getBlockExplorerUrl(blockNumber!) as string}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                        >
                            {t('viewOnExplorer')}
                        </a>
                        )
                    </span>
                )}
            </p>
            {miningTime && (
                <p className="text-xs sm:text-sm text-gray-600">
                    {t('minedOn', { time: miningTime })}
                </p>
            )}
        </div>
    );
};
import React from 'react';
import { useTranslation } from 'react-i18next';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { AbbreviatedHex } from './AbbreviatedHex';
import { NotarizedFileInfo } from './NotarizedFileInfo';

interface FileInfoDisplayProps {
    isLoading: boolean;
    file: File;
    fileHash: string;
    isNotarized: boolean;
    networkName: string;
    blockNumber: bigint | undefined;
    miningTime: string | undefined;
    onReset: () => void;
}

export const FileInfoDisplay: React.FC<FileInfoDisplayProps> = ({
    isLoading,
    file,
    fileHash,
    isNotarized,
    networkName,
    blockNumber,
    miningTime,
    onReset,
}) => {
    const { t } = useTranslation();

    const LoadingPlaceholder = () => (
        <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4 mx-auto"></div>
            <div className="h-20 bg-gray-200 rounded w-full"></div>
        </div>
    );

    return (
        <div className="relative p-4 bg-gray-50 rounded-md text-left">
            <button onClick={onReset} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                <XMarkIcon className="w-5 h-5" />
            </button>
            {isLoading ? (
                <LoadingPlaceholder />
            ) : (
                <>
                    <p className="font-medium text-center">{file.name}</p>
                    <p className="text-sm text-gray-500 mt-1 text-center">
                        <AbbreviatedHex value={fileHash} label={t('fileHash')} />
                    </p>
                    {isNotarized ? (
                        <NotarizedFileInfo
                            networkName={networkName}
                            blockNumber={blockNumber}
                            miningTime={miningTime}
                        />
                    ) : (
                        <p className="mt-2 text-yellow-600 text-center text-xl">{t('fileNotNotarized')}</p>
                    )}
                </>
            )}
        </div>
    );
};
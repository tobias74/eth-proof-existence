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
    file,
    fileHash,
    isNotarized,
    networkName,
    blockNumber,
    miningTime,
    onReset,
}) => {
    const { t } = useTranslation();

    return (
        <div className="relative p-4 bg-gray-50 rounded-md text-left">
            <button onClick={onReset} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                <XMarkIcon className="w-5 h-5" />
            </button>
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
        </div>
    );
};
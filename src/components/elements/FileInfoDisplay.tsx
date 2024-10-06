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
        <div className="relative p-4 sm:p-6 bg-gray-50 rounded-md text-left">
            {/* Close button for larger screens */}
            <button
                onClick={onReset}
                className="hidden sm:block absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-700"
                aria-label="Reset"
            >
                <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {isLoading ? (
                <LoadingPlaceholder />
            ) : (
                <>
                    <p className="font-medium text-center text-base sm:text-lg break-words pr-6 sm:pr-0">{file.name}</p>
                    <div className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-3 text-center">
                        <AbbreviatedHex value={fileHash} label={t('fileHash')} />
                    </div>
                    {isNotarized ? (
                        <NotarizedFileInfo
                            networkName={networkName}
                            blockNumber={blockNumber}
                            miningTime={miningTime}
                        />
                    ) : (
                        <p className="mt-3 sm:mt-4 text-yellow-600 text-center text-base sm:text-lg font-medium">
                            {t('fileNotNotarized')}
                        </p>
                    )}

                    {/* Close button for mobile screens */}
                    <button
                        onClick={onReset}
                        className="sm:hidden w-full mt-4 py-2 bg-gray-200 text-gray-700 rounded-md flex items-center justify-center"
                        aria-label="Reset"
                    >
                        <XMarkIcon className="w-5 h-5 mr-2" />
                        {t('close')}
                    </button>
                </>
            )}
        </div>
    );
};
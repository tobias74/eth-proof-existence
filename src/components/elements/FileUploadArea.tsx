import React from 'react';
import { useTranslation } from 'react-i18next';
import { DocumentIcon } from '@heroicons/react/24/outline';

interface FileUploadAreaProps {
    isDragging: boolean;
    onDragEnter: (e: React.DragEvent<HTMLLabelElement>) => void;
    onDragLeave: (e: React.DragEvent<HTMLLabelElement>) => void;
    onDragOver: (e: React.DragEvent<HTMLLabelElement>) => void;
    onDrop: (e: React.DragEvent<HTMLLabelElement>) => void;
    onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FileUploadArea: React.FC<FileUploadAreaProps> = ({
    isDragging,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDrop,
    onFileChange,
}) => {
    const { t } = useTranslation();

    return (
        <label
            htmlFor="file-upload"
            className={`flex flex-col justify-center items-center w-full min-h-[10rem] px-4 py-6 transition bg-white border-2 ${isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
                } border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none`}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
        >
            <DocumentIcon className="w-10 h-10 text-gray-600 mb-2" />
            <span className="font-medium text-gray-600 text-center text-sm sm:text-base">
                {isDragging ? t('dropFileHere') : t('chooseFileToNotarize')}
            </span>
            <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="hidden"
                onChange={onFileChange}
            />
        </label>
    );
};
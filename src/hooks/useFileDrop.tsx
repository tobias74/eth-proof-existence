import { useState, useCallback } from 'react';
import { sha256 } from 'js-sha256';

interface UseFileDropResult {
    file: File | null;
    fileHash: string;
    isDragging: boolean;
    handleDragEnter: (e: React.DragEvent<HTMLElement>) => void;
    handleDragLeave: (e: React.DragEvent<HTMLElement>) => void;
    handleDragOver: (e: React.DragEvent<HTMLElement>) => void;
    handleDrop: (e: React.DragEvent<HTMLElement>) => void;
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    resetFile: () => void;
}

export function useFileDrop(): UseFileDropResult {
    const [file, setFile] = useState<File | null>(null);
    const [fileHash, setFileHash] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    const handleFileSelection = useCallback((selectedFile: File) => {
        setFile(selectedFile);
        const reader = new FileReader();
        reader.onload = (e) => {
            const hash = sha256(e.target?.result as ArrayBuffer);
            setFileHash(hash);
        };
        reader.readAsArrayBuffer(selectedFile);
    }, []);

    const handleDragEnter = useCallback((e: React.DragEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            handleFileSelection(droppedFile);
        }
    }, [handleFileSelection]);

    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            handleFileSelection(selectedFile);
        }
    }, [handleFileSelection]);

    const resetFile = useCallback(() => {
        setFile(null);
        setFileHash('');
    }, []);

    return {
        file,
        fileHash,
        isDragging,
        handleDragEnter,
        handleDragLeave,
        handleDragOver,
        handleDrop,
        handleFileChange,
        resetFile,
    };
}
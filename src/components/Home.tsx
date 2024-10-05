import React, { useState, useCallback, useEffect } from 'react';
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt, usePublicClient, useChainId } from 'wagmi';
import { useContractAddress } from '../hooks/useContractAddress';
import { useTranslation } from 'react-i18next';
import { useBlockExplorerUrl } from '../hooks/useBlockExplorerUrl';
import NotarizerABI from '../eth/notarizer-abi';
import { XMarkIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { AbbreviatedHex } from './elements/AbbreviatedHex';
import { useFileDrop } from '../hooks/useFileDrop';
import { useNetworkName } from '../hooks/useNetworkName';
import { useNotarizationInfo } from '../hooks/useNotarizationInfo';
import { NotarizedFileInfo } from './elements/NotarizedFileInfo';

export function Home() {
  const { t } = useTranslation();

  const { isConnected, address } = useAccount();
  const contractAddress = useContractAddress();
  const getBlockExplorerUrl = useBlockExplorerUrl();

  const {
    file,
    fileHash,
    isDragging,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleFileChange,
    resetFile,
  } = useFileDrop();


  const { writeContract, data: writeData } = useWriteContract();

  const { isLoading: isNotarizing, isSuccess: notarizationCompleted } = useWaitForTransactionReceipt({
    hash: writeData,
  });



  const handleNotarize = useCallback(() => {
    if (fileHash && contractAddress) {
      writeContract({
        address: contractAddress,
        abi: NotarizerABI,
        functionName: 'notarize',
        args: [`0x${fileHash}`],
      });
    }
  }, [fileHash, writeContract, contractAddress]);

  const { isNotarized, blockNumber, miningTime, refetchHashData } = useNotarizationInfo(fileHash);

  useEffect(() => {
    if (notarizationCompleted) {
      refetchHashData();
    }
  }, [notarizationCompleted, refetchHashData]);

  const resetState = () => {
    resetFile();
  };

  const { name: networkName, chainId } = useNetworkName();

  return (
    <div className="max-w-3xl mx-auto p-4">        {isConnected && (
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 text-center">

          <div className="flex flex-col items-center mb-4">
            <h1 className="text-2xl font-bold">{networkName}</h1>
            <span className="text-sm text-gray-500">(Chain ID: {chainId})</span>
          </div>

          <div className="text-sm text-gray-600 mb-6">
            <div className="flex flex-col items-center gap-y-2">
              <AbbreviatedHex value={address || ''} label={t('yourAddress')} />
              <AbbreviatedHex value={contractAddress || ''} label={t('contractAddress')} />
            </div>
          </div>

          <div className="mb-6">
            {!file ? (
              <label
                htmlFor="file-upload"
                className={`flex flex-col justify-center items-center w-full h-40 px-4 transition bg-white border-2 ${isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
                  } border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <DocumentIcon className="w-10 h-10 text-gray-600 mb-2" />
                <span className="font-medium text-gray-600">
                  {isDragging ? t('dropFileHere') : t('chooseFileToNotarize')}
                </span>
                <input id="file-upload" name="file-upload" type="file" className="hidden" onChange={handleFileChange} />
              </label>
            ) : (
              <div className="relative p-4 bg-gray-50 rounded-md text-left">
                <button onClick={resetState} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                  <XMarkIcon className="w-5 h-5" />
                </button>
                <p className="font-medium text-center">{file.name}</p>
                <p className="text-sm text-gray-500 mt-1 text-center">
                  <AbbreviatedHex value={fileHash} label={t('fileHash')} />
                </p>
                {isNotarized ?
                  <NotarizedFileInfo
                    networkName={networkName}
                    blockNumber={blockNumber}
                    miningTime={miningTime}
                  />
                  : (
                    <p className="mt-2 text-yellow-600 text-center text-xl">{t('fileNotNotarized')}</p>
                  )}
              </div>
            )}
          </div>

          <button
            onClick={handleNotarize}
            disabled={!fileHash || isNotarizing || !contractAddress || isNotarized}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded disabled:opacity-50 transition duration-300"
          >
            {isNotarizing ? t('notarizing') : t('notarizeFile')}
          </button>
        </div>
      </div>
    )}

    </div>
  );
}
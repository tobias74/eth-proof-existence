import React, { useState, useCallback, useEffect } from 'react';
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt, usePublicClient, useChainId } from 'wagmi';
import { useContractAddress } from '../hooks/useContractAddress';
import { useTranslation } from 'react-i18next';
import NotarizerABI from '../eth/notarizer-abi';
import { useFileDrop } from '../hooks/useFileDrop';
import { useNetworkName } from '../hooks/useNetworkName';
import { useNotarizationInfo } from '../hooks/useNotarizationInfo';
import { FileInfoDisplay } from './elements/FileInfoDisplay';
import { FileUploadArea } from './elements/FileUploadArea';
import { NetworkAndAddressInfo } from './elements/NetworkAndAddressInfo';
import { ConnectWalletPrompt } from './elements/ConnectWalletPrompt';

export function Home() {
  const { t } = useTranslation();

  const { isConnected, address } = useAccount();
  const contractAddress = useContractAddress();

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

  const { isPending: isLoadingDataFromBlockChain, isNotarized, blockNumber, miningTime, refetchHashData } = useNotarizationInfo(fileHash);

  useEffect(() => {
    if (notarizationCompleted) {
      refetchHashData();
    }
  }, [notarizationCompleted, refetchHashData]);

  const { name: networkName, chainId } = useNetworkName();

  if (!isConnected) {
    return <ConnectWalletPrompt />;
  } else {
    return (
      <div className="max-w-2xl mx-auto p-4 bg-gray-100">
        {
          isConnected && (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6 text-center">

                <NetworkAndAddressInfo
                  networkName={networkName}
                  chainId={chainId}
                  address={address || ''}
                  contractAddress={contractAddress || ''}
                />

                <div className="mb-6">
                  {!file ?
                    <FileUploadArea
                      isDragging={isDragging}
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onFileChange={handleFileChange}
                    />
                    :
                    <FileInfoDisplay
                      file={file}
                      fileHash={fileHash}
                      isNotarized={isNotarized}
                      networkName={networkName}
                      blockNumber={blockNumber}
                      miningTime={miningTime}
                      isLoading={isLoadingDataFromBlockChain}
                      onReset={resetFile}
                    />
                  }
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
          )
        }

      </div>
    );
  }

}
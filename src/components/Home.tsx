import React, { useState, useCallback, useEffect } from 'react';
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt, usePublicClient, useChainId } from 'wagmi';
import { sha256 } from 'js-sha256';
import { useContractAddress } from '../hooks/useContractAddress';
import { useTranslation } from 'react-i18next';
import { useBlockExplorerUrl } from '../hooks/useBlockExplorerUrl';
import NotarizerABI from '../eth/notarizer-abi';
import { XMarkIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { AbbreviatedHex } from './elements/AbbreviatedHex';

export function Home() {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [fileHash, setFileHash] = useState('');
  const [blockNumber, setBlockNumber] = useState<bigint | undefined>(undefined);
  const [miningTime, setMiningTime] = useState<string | undefined>(undefined);
  const [isNotarized, setIsNotarized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const contractAddress = useContractAddress();
  const publicClient = usePublicClient();
  const getBlockExplorerUrl = useBlockExplorerUrl();

  const { data: hashData, refetch: refetchHashData } = useReadContract({
    address: contractAddress,
    abi: NotarizerABI,
    functionName: 'getByHash',
    args: fileHash ? [`0x${fileHash}`] : undefined,
  });

  const { writeContract, data: writeData } = useWriteContract();

  const { isLoading: isNotarizing, isSuccess: notarizationCompleted } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  const handleFileSelection = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (e) => {
      const hash = sha256(e.target?.result as ArrayBuffer);
      setFileHash(hash);
    };
    reader.readAsArrayBuffer(selectedFile);
  }, []);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        const hash = sha256(e.target?.result as ArrayBuffer);
        setFileHash(hash);
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelection(droppedFile);
    }
  }, [handleFileSelection]);


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

  useEffect(() => {
    async function updateNotarizationInfo() {
      if (hashData) {
        const [timestamp, blockNumberBigInt] = hashData;
        if (BigInt(timestamp) > 0n) {
          setIsNotarized(true);
          setBlockNumber(BigInt(blockNumberBigInt.toString()));
          try {
            const block = await publicClient.getBlock({ blockNumber: BigInt(blockNumberBigInt.toString()) });
            setMiningTime(new Date(Number(block.timestamp) * 1000).toLocaleString());
          } catch (error) {
            console.error('Error fetching block details:', error);
            setMiningTime(undefined);
          }
        } else {
          setIsNotarized(false);
          setBlockNumber(undefined);
          setMiningTime(undefined);
        }
      }
    }
    updateNotarizationInfo();
  }, [hashData, publicClient]);

  useEffect(() => {
    if (notarizationCompleted) {
      refetchHashData();
    }
  }, [notarizationCompleted, refetchHashData]);

  const resetState = () => {
    setFile(null);
    setFileHash('');
    setBlockNumber(undefined);
    setMiningTime(undefined);
    setIsNotarized(false);
  };

  const getNetworkName = () => {
    switch (chainId) {
      case 1: return 'Ethereum Mainnet';
      case 11155111: return 'Sepolia Testnet';
      case 1337: return 'Ganache Testnet';
      default: return 'Unknown Network';
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">        {isConnected && (
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 text-center">
          <div className="flex flex-col items-center mb-4">
            <h1 className="text-2xl font-bold">{getNetworkName()}</h1>
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
                {isNotarized ? (
                  <div className="mt-2 text-sm text-center">
                    <p className="text-green-600 font-medium text-xl">{t('fileNotarized', { networkName: getNetworkName() })}</p>
                    <p>
                      {t('notarizedAtBlock', { block: blockNumber?.toString() })}
                      {getBlockExplorerUrl(blockNumber!) && (
                        <> (
                          <a
                            href={getBlockExplorerUrl(blockNumber!)}
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
                ) : (
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
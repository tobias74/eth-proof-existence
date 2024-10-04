import React, { useState, useCallback, useEffect } from 'react';
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt, usePublicClient, useChainId } from 'wagmi';
import { sha256 } from 'js-sha256';
import { useContractAddress } from '../hooks/useContractAddress';
import { useTranslation } from 'react-i18next';
import { useBlockExplorerUrl } from '../hooks/useBlockExplorerUrl';
import NotarizerABI from '../eth/notarizer-abi';
import { Transition } from '@headlessui/react';
import { XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { AbbreviatedHex } from './elements/AbbreviatedHex';

export function Home() {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [fileHash, setFileHash] = useState('');
  const [blockNumber, setBlockNumber] = useState<bigint | undefined>(undefined);
  const [miningTime, setMiningTime] = useState<string | undefined>(undefined);
  const [isNotarized, setIsNotarized] = useState(false);
  const [showToast, setShowToast] = useState(false);

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
      setShowToast(true);
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
    <div className="max-w-3xl mx-auto p-4">
      {isConnected && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-baseline mb-4">
              <h1 className="text-2xl font-bold mr-2">{getNetworkName()}</h1>
              <span className="text-sm text-gray-500">(Chain ID: {chainId})</span>
            </div>

            <div className="text-sm text-gray-600 mb-6">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <AbbreviatedHex value={address || ''} label={t('yourAddress')} />
                <AbbreviatedHex value={contractAddress || ''} label={t('contractAddress')} />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
                {t('chooseFileToNotarize')}
              </label>
              <div className="flex items-center space-x-4">
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer py-2 px-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition duration-150 ease-in-out"
                >
                  {file ? t('changeFile') : t('selectFile')}
                </label>
                {file && (
                  <span className="text-sm text-gray-600">
                    {file.name} <AbbreviatedHex value={fileHash} />
                  </span>
                )}
              </div>
            </div>

            {file && (
              <div className="mb-6">
                {isNotarized ? (
                  <div className="text-sm">
                    <p className="text-green-600 font-medium mb-1">{t('fileNotarized')}</p>
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
                  <p className="text-sm text-yellow-600">{t('fileNotNotarized')}</p>
                )}
              </div>
            )}

            <div className="flex space-x-4">
              <button
                onClick={handleNotarize}
                disabled={!fileHash || isNotarizing || !contractAddress || isNotarized}
                className="flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 transition duration-300"
              >
                {isNotarizing ? t('notarizing') : t('notarizeFile')}
              </button>
              <button
                onClick={resetState}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition duration-300"
              >
                <ArrowPathIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <Transition
        show={showToast}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center">
          <span>{t('notarizationSuccess')}</span>
          <button onClick={() => setShowToast(false)} className="ml-2 focus:outline-none">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </Transition>
    </div>
  );
}
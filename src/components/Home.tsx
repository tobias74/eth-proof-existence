import React, { useState, useCallback, useEffect } from 'react';
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt, usePublicClient, useChainId } from 'wagmi';
import { sha256 } from 'js-sha256';
import { NetworkInfo } from './elements/NetworkInfo';
import { NotarizationInfo } from './elements/NotarizationInfo';
import { useContractAddress } from '../hooks/useContractAddress';
import { useTranslation } from 'react-i18next';
import NotarizerABI from '../eth/notarizer-abi';
import { useBlockExplorerUrl } from '../hooks/useBlockExplorerUrl';


export function Home() {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [fileHash, setFileHash] = useState('');
  const [blockNumber, setBlockNumber] = useState<bigint | undefined>(undefined);
  const [miningTime, setMiningTime] = useState<string | undefined>(undefined);
  const [isNotarized, setIsNotarized] = useState(false);
  const [notarizationSuccess, setNotarizationSuccess] = useState(false);

  const { isConnected } = useAccount();
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
    setNotarizationSuccess(false);
    setFileHash('');
    setIsNotarized(false);
    setBlockNumber(undefined);
    setMiningTime(undefined);
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
      setNotarizationSuccess(false);
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
      setNotarizationSuccess(true);
      refetchHashData();
    }
  }, [notarizationCompleted, refetchHashData]);

  return (
    <React.Fragment>
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">{t('fileNotarizer')}</h1>
        {isConnected && (
          <>
            <NetworkInfo />

            <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">{t('selectFile')}</h2>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('chooseFile')}
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100 cursor-pointer"
                  />
                </div>
                {file && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">{t('selectedFile')}:</span> {file.name}
                    </p>
                    <p className="text-sm text-gray-600 break-all">
                      <span className="font-medium">{t('fileHash')}:</span> {fileHash}
                    </p>
                  </div>
                )}
                <button
                  onClick={handleNotarize}
                  disabled={!fileHash || isNotarizing || !contractAddress || isNotarized}
                  className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 transition duration-300"
                >
                  {isNotarizing ? t('notarizing') : t('notarizeFile')}
                </button>
              </div>
            </div>

            {notarizationSuccess && (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
                <p className="font-bold">{t('success')}</p>
                <p>{t('notarizationSuccess')}</p>
              </div>
            )}

            {fileHash && (
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">{t('notarizationStatus')}</h2>
                  <NotarizationInfo
                    blockNumber={blockNumber}
                    miningTime={miningTime}
                    isNotarized={isNotarized}
                    blockExplorerUrl={blockNumber ? getBlockExplorerUrl(blockNumber) : null}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </React.Fragment>
  );
}
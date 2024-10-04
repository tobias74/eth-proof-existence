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
      <h1 className="text-2xl font-bold mb-4">{t('fileNotarizer')}</h1>
      {isConnected && (
        <>
          <NetworkInfo />

          <div className="mb-4">
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-violet-50 file:text-violet-700
                hover:file:bg-violet-100"
            />
          </div>
          {file && (
            <div className="mb-4">
              <p className="text-sm text-gray-600">{t('selectedFile')}: {file.name}</p>
              <p className="text-sm text-gray-600">{t('fileHash')}: {fileHash}</p>
            </div>
          )}
          <div className="space-x-2">
            <button
              onClick={handleNotarize}
              disabled={!fileHash || isNotarizing || !contractAddress || isNotarized}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {isNotarizing ? t('notarizing') : t('notarizeFile')}
            </button>
          </div>
          {notarizationSuccess && (
            <div className="mt-4 p-4 bg-green-100 rounded">
              <p className="text-green-700">{t('notarizationSuccess')}</p>
            </div>
          )}
          {fileHash && (
            <NotarizationInfo
              blockNumber={blockNumber}
              miningTime={miningTime}
              isNotarized={isNotarized}
              blockExplorerUrl={blockNumber ? getBlockExplorerUrl(blockNumber) : null}
            />
          )}
        </>
      )}
    </React.Fragment>
  );
}
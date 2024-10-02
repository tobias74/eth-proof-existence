import React, { useState, useCallback, useEffect } from 'react';
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { sha256 } from 'js-sha256';
import { AccountConnector } from './elements/AccountConnector';
import { NetworkInfo } from './elements/NetworkInfo';
import { useContractAddress } from '../hooks/useContractAddress';

// Note: This ABI should be imported from a separate file in a real application
import NotarizerABI from '../eth/notarizer-abi';

export function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [fileHash, setFileHash] = useState('');
  const [status, setStatus] = useState('');
  const [notarizationSuccess, setNotarizationSuccess] = useState(false);

  const { isConnected } = useAccount();
  const contractAddress = useContractAddress();

  const { data: hashData, refetch: refetchHashData } = useReadContract({
    address: contractAddress,
    abi: NotarizerABI,
    functionName: 'getByHash',
    args: fileHash ? [`0x${fileHash}`] : undefined,
  });

  const { writeContract, data: writeData } = useWriteContract();

  const { isLoading: isNotarizing, isSuccess: isNotarized } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files![0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        const hash = sha256(e.target!.result!);
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
      setNotarizationSuccess(false); // Reset success state when starting a new notarization
    }
  }, [fileHash, writeContract, contractAddress]);

  useEffect(() => {
    if (hashData) {
      const [timestamp, blockNumber] = hashData;
      if (parseInt(timestamp.toString()) > 0) {
        setStatus(`File was notarized at block ${blockNumber}`);
      } else {
        setStatus('File has not been notarized yet.');
      }
    }
  }, [hashData]);

  useEffect(() => {
    if (isNotarized) {
      setNotarizationSuccess(true);
      refetchHashData(); // Refetch the hash data to update the status
    }
  }, [isNotarized, refetchHashData]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">File Notarizer</h1>

      <AccountConnector />

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
              <p className="text-sm text-gray-600">Selected file: {file.name}</p>
              <p className="text-sm text-gray-600">File hash: {fileHash}</p>
            </div>
          )}
          <div className="space-x-2">
            <button
              onClick={handleNotarize}
              disabled={!fileHash || isNotarizing || !contractAddress}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {isNotarizing ? 'Notarizing...' : 'Notarize File'}
            </button>
          </div>
          {notarizationSuccess && (
            <div className="mt-4 p-4 bg-green-100 rounded">
              <p className="text-green-700">File successfully notarized on the blockchain!</p>
            </div>
          )}
          {status && (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <p>{status}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
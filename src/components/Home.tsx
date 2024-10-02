import React, { useState, useCallback, useEffect } from 'react';
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt, useChainId } from 'wagmi';
import { sha256 } from 'js-sha256';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { WalletOptions } from '../components/elements/WalletOptions';
import { Account } from '../components/elements/Account';

// Note: This ABI and contract addresses should be imported from a separate file in a real application
const NotarizerABI = [
  {
    inputs: [{ name: 'hash', type: 'bytes32' }],
    name: 'notarize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'hash', type: 'bytes32' }],
    name: 'getByHash',
    outputs: [
      { name: 'timestamp', type: 'uint256' },
      { name: 'blockNumber', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

const contractAddresses: {
  [key: number]: `0x${string}`;
} = {
  1: '0x5a7901d2c9C52C7149F9D4dA35f92242eB5d9992', // mainnet
  4: '0xF3aE5E81E6469bAD34D429b2E8b94cc07Bee32ee', // rinkeby
  11155111: '0x116E48351fdeAf2CF313eDF2435E150Cb94Db0A9', // sepolia
  1337: '0xb30994e8201462CB402c2e43Cf3FF0F3070E2b8b', // ganache
};

export function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [fileHash, setFileHash] = useState('');
  const [status, setStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { isConnected } = useAccount();
  const chainId = useChainId();
  console.log('we are using chain id', chainId);

  const contractAddress: `0x${string}` = contractAddresses[chainId]; // Assuming mainnet for this example
  console.log('contract address', contractAddress);


  const { data: hashData, refetch: refetchHashData } = useReadContract({
    address: contractAddress,
    abi: NotarizerABI,
    functionName: 'getByHash',
    args: fileHash ? [`0x${fileHash}`] : undefined,
  });

  const { writeContract, data: writeData } = useWriteContract();

  const { isLoading: isNotarizing, isSuccess: isNotarized } = useWaitForTransactionReceipt({
    hash: writeData?.hash,
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
    if (fileHash) {
      writeContract({
        address: contractAddress,
        abi: NotarizerABI,
        functionName: 'notarize',
        args: [`0x${fileHash}`],
      });
    }
  }, [fileHash, writeContract, contractAddress]);

  const checkFileStatus = useCallback(() => {
    if (fileHash) {
      refetchHashData();
    }
  }, [fileHash, refetchHashData]);

  useEffect(() => {
    if (hashData) {
      const [timestamp, blockNumber] = hashData;
      if (parseInt(timestamp) > 0) {
        setStatus(`File was notarized at block ${blockNumber}`);
      } else {
        setStatus('File has not been notarized yet.');
      }
    }
  }, [hashData]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">File Notarizer</h1>

      {!isConnected ? <WalletOptions /> : <Account />}

      {isConnected && (
        <>
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
              disabled={!fileHash || isNotarizing}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {isNotarizing ? 'Notarizing...' : 'Notarize File'}
            </button>
            <button
              onClick={checkFileStatus}
              disabled={!fileHash}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              Check Status
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            >
              Show Info
            </button>
          </div>
          {status && (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <p>{status}</p>
            </div>
          )}
        </>
      )}

      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    File Notarizer Info
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      This dapp allows you to notarize files on the Ethereum blockchain.
                      The file's hash is stored, not the file itself.
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Got it, thanks!
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
import React from 'react';
import { useAccount, useDisconnect } from 'wagmi';

export function Account() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <div className="mb-4">
      <p className="text-sm text-gray-600">Connected: {address}</p>
      <button
        onClick={() => disconnect()}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2"
      >
        Disconnect
      </button>
    </div>
  );
}

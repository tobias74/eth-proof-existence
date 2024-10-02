import { ConnectButton } from '@rainbow-me/rainbowkit';
import React from 'react';
import { useAccount, useDisconnect } from 'wagmi';

export function AccountConnector() {
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();


  return (
    <div className="mb-4">

      {!isConnected ? <ConnectButton /> : <React.Fragment>
        <button
          onClick={() => disconnect()}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2"
        >
          Disconnect
        </button>

      </React.Fragment>}

    </div>
  );
}

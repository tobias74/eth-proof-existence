import React from 'react';
import { useConnect } from 'wagmi';
import { WalletOption } from './WalletOption';

export function WalletOptions() {
  const { connectors, connect } = useConnect();

  console.log('my connectors', connectors);

  return (
    <div>
      {connectors.map((connector) => (
        <WalletOption
          key={connector.uid}
          connector={connector}
          onClick={() => {console.log('calling connect');connect({ connector });}}
        />
      ))}
    </div>
  );
}
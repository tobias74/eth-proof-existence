import React, { useEffect, useState } from 'react';

export function WalletOption({ connector, onClick }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const provider = await connector.getProvider();
      setReady(!!provider);
    })();
  }, [connector]);

  return (
    <button
      onClick={onClick}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2 mr-2 disabled:opacity-50"
    >
      Connect with {connector.name}
    </button>
  );
}
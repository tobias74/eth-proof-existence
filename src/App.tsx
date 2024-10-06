import React, { useEffect, useState } from 'react';
import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, Locale } from '@rainbow-me/rainbowkit';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n-config';
import MainContent from './MainContent'; // Import the new component
import { AppStateProvider } from './AppState';
import { QueryClient } from '@tanstack/react-query';
import { config as configOnlyInjected } from './config-alt';
import { config as configWithWalletConnect } from './config';

const queryClient = new QueryClient();

function App() {
  const [rainbowKitLocale, setRainbowKitLocale] = useState<Locale>('en');
  const [gatewayStatus, setGatewayStatus] = useState<'pending' | 'accepted' | 'declined'>('pending');

  useEffect(() => {
    const languageMap: { [key: string]: Locale } = {
      en: 'en',
      de: 'en', // rainbowkit does not support German yet, so we use English as a fallback
      fr: 'fr',
    };

    const handleLanguageChange = () => {
      setRainbowKitLocale(languageMap[i18n.language] || 'en');
    };

    handleLanguageChange();
    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  const handleAcceptGateway = () => setGatewayStatus('accepted');
  const handleDeclineGateway = () => setGatewayStatus('declined');
  const handleReopenModal = () => setGatewayStatus('pending');

  return (
    <I18nextProvider i18n={i18n}>
      <AppStateProvider>
        <MainContent
          gatewayStatus={gatewayStatus}
          handleAcceptGateway={handleAcceptGateway}
          handleDeclineGateway={handleDeclineGateway}
          handleReopenModal={handleReopenModal}
          rainbowKitLocale={rainbowKitLocale}
          queryClient={queryClient}
          configWithWalletConnect={configWithWalletConnect}
          configOnlyInjected={configOnlyInjected}
        />
      </AppStateProvider>
    </I18nextProvider>
  );
}

export default App;

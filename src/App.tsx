import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, Locale } from '@rainbow-me/rainbowkit';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n-config';
import { config } from './config-alt';
import Layout from './components/Layout';
import { Home } from './components/Home';
import { About } from './components/About';
import { Imprint } from './components/Imprint';
import { Privacy } from './components/Privacy';
import { EthereumGatewayModal } from './components/EthereumGatewayModal';
import { GatewayAccessDenied } from './components/GatewayAccessDenied';

const queryClient = new QueryClient();

function App() {
  const [rainbowKitLocale, setRainbowKitLocale] = useState<Locale>('en');
  const [gatewayStatus, setGatewayStatus] = useState<'pending' | 'accepted' | 'declined'>('pending');

  useEffect(() => {
    const languageMap: { [key: string]: Locale } = {
      en: 'en',
      de: 'en', // rainbowkit does not support german yet, so we use english as a fallback
      fr: 'fr',
      // Add more mappings as needed
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

  const handleAcceptGateway = () => {
    setGatewayStatus('accepted');
  };

  const handleDeclineGateway = () => {
    setGatewayStatus('declined');
  };

  const handleReopenModal = () => {
    setGatewayStatus('pending');
  };

  const renderContent = () => {
    const commonRoutes = (
      <>
        <Route path="/about" element={<About />} />
        <Route path="/imprint" element={<Imprint />} />
        <Route path="/privacy" element={<Privacy />} />
      </>
    );

    switch (gatewayStatus) {
      case 'pending':
        return (
          <Layout wagmiEnabled={false}>
            <Routes>
              <Route path="/" element={<EthereumGatewayModal onAccept={handleAcceptGateway} onDecline={handleDeclineGateway} />} />
              {commonRoutes}
            </Routes>
          </Layout>
        );
      case 'declined':
        return (
          <Layout wagmiEnabled={false}>
            <Routes>
              <Route path="/" element={<GatewayAccessDenied onReopen={handleReopenModal} />} />
              {commonRoutes}
            </Routes>
          </Layout>
        );
      case 'accepted':
        return (
          <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
              <RainbowKitProvider locale={rainbowKitLocale}>
                <Layout wagmiEnabled={true}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    {commonRoutes}
                  </Routes>
                </Layout>
              </RainbowKitProvider>
            </QueryClientProvider>
          </WagmiProvider>
        );
    }
  };

  return (
    <I18nextProvider i18n={i18n}>
      {renderContent()}
    </I18nextProvider>
  );
}

export default App;
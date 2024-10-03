import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, Locale } from '@rainbow-me/rainbowkit';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n-config';
import { config } from './config';
import Layout from './components/Layout';
import { Home } from './components/Home';
import { About } from './components/About';
import { Imprint } from './components/Imprint';
import { Privacy } from './components/Privacy';

const queryClient = new QueryClient();

function App() {
  const [rainbowKitLocale, setRainbowKitLocale] = useState<Locale>('en');

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

    // Set initial locale
    handleLanguageChange();

    // Listen for language changes
    i18n.on('languageChanged', handleLanguageChange);

    // Cleanup
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);


  console.log('rendering app component....');

  return (
    <I18nextProvider i18n={i18n}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider locale={rainbowKitLocale}>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/imprint" element={<Imprint />} />
                <Route path="/privacy" element={<Privacy />} />
                {/* Add more routes as needed */}
              </Routes>
            </Layout>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </I18nextProvider>
  );
}

export default App;
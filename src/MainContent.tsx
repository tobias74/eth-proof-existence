import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, Locale } from '@rainbow-me/rainbowkit';
import Layout from './components/Layout';
import { Home } from './components/Home';
import { About } from './components/About';
import { Imprint } from './components/Imprint';
import { Privacy } from './components/Privacy';
import { GatewayAccessDenied } from './components/GatewayAccessDenied';
import { EthereumGatewayInfo } from './components/EthereumGatewayInfo';
import { useAppState } from './AppState';

interface MainContentProps {
    gatewayStatus: 'pending' | 'accepted' | 'declined';
    handleAcceptGateway: () => void;
    handleDeclineGateway: () => void;
    handleReopenModal: () => void;
    rainbowKitLocale: Locale;
    queryClient: QueryClient;
    configWithWalletConnect: any;
    configOnlyInjected: any;
}

const MainContent: React.FC<MainContentProps> = ({
    gatewayStatus,
    handleAcceptGateway,
    handleDeclineGateway,
    handleReopenModal,
    rainbowKitLocale,
    queryClient,
    configWithWalletConnect,
    configOnlyInjected,
}) => {
    const { walletConnectEnabled } = useAppState();

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
                        <Route
                            path="/"
                            element={<EthereumGatewayInfo onAccept={handleAcceptGateway} onDecline={handleDeclineGateway} />}
                        />
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
                <WagmiProvider config={walletConnectEnabled ? configWithWalletConnect : configOnlyInjected}>
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

export default MainContent;

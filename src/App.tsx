import { Routes, Route } from 'react-router-dom'
import { Home } from './components/Home'
import { config } from './config';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider, } from '@rainbow-me/rainbowkit';

const queryClient = new QueryClient();


function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            {/* Add more routes as needed */}
          </Routes>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}


function About() {
  return <h1>About Page</h1>
}

export default App

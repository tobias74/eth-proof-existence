import { Routes, Route } from 'react-router-dom'
import { Home } from './components/Home'
import { config } from './config';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();


function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      {/* Add more routes as needed */}
    </Routes>

    </QueryClientProvider>
    </WagmiProvider>    
  )
}


function About() {
  return <h1>About Page</h1>
}

export default App

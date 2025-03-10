import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import EthConverterPage from "./pages/EthConverter";
import HexConverterPage from "./pages/HexConverter";
import EpochConverterPage from "./pages/EpochConverter";
import DiscoverChainsPage from "./pages/GetChains";
import NotFound from "./pages/NotFound";

import { WalletProvider } from "@/context/WalletContext";
import '@rainbow-me/rainbowkit/styles.css';
import {
  RainbowKitProvider,
  darkTheme,
  cssStringFromTheme,
} from '@rainbow-me/rainbowkit';
import { WagmiConfig } from 'wagmi';
import { http } from 'viem';
import { createConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, base, avalanche } from 'wagmi/chains';

// Create a custom RainbowKit theme
const customTheme = darkTheme({
  accentColor: '#0ff550',
  accentColorForeground: 'black',
  borderRadius: 'small',
  fontStack: 'system',
});

// Add custom CSS
const customCSS = `
  :root {
    --rk-colors-accentColor: #0ff550;
    --rk-colors-accentColorForeground: #000000;
    --rk-colors-modalBackground: #000000;
    --rk-colors-modalBorder: #0ff55033;
    --rk-fonts-body: 'Courier New', monospace;
  }
  
  .rk-modal {
    border: 1px solid #0ff55080 !important;
    box-shadow: 0 0 20px rgba(15, 255, 80, 0.2) !important;
  }
`;

// Add style element with custom CSS
const styleElement = document.createElement('style');
styleElement.textContent = cssStringFromTheme(customTheme) + customCSS;
document.head.appendChild(styleElement);

// Define the chains and WalletConnect projectId
const projectId = '16f35f6911d7a724931eb523d507f64d'; // Project ID for WalletConnect

// Define supported chains for wagmi
const wagmiChains = [mainnet, polygon, optimism, arbitrum, avalanche, base];

// Create Query Client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Set up the wagmi config with WalletConnect
const config = createConfig({
  chains: wagmiChains,
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [avalanche.id]: http(),
    [base.id]: http(),
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <WagmiConfig config={config}>
      <RainbowKitProvider theme={customTheme} appInfo={{ appName: 'BlockUtils' }}>
        <TooltipProvider>
          <div className="relative min-h-screen">
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <WalletProvider>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/token-utilities" element={<Index />} />
                  <Route path="/contract-execution" element={<Index />} />
                  <Route path="/hex-converter" element={<HexConverterPage />} />
                  <Route path="/eth-converter" element={<EthConverterPage />} />
                  <Route path="/epoch-converter" element={<EpochConverterPage />} />
                  <Route path="/get-chains" element={<DiscoverChainsPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </WalletProvider>
            </BrowserRouter>
          </div>
        </TooltipProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  </QueryClientProvider>
);

export default App;

// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import RtlLayout from './components/RtlLayout';
import ScrollToTop from './components/ScrollToTop';
import { ProgressBarStyle } from './components/ProgressBar';
import ThemeColorPresets from './components/ThemeColorPresets';
import MotionLazyContainer from './components/animate/MotionLazyContainer';
// ----------------------------------------------------------------------


//wagmi
import { WagmiConfig, createConfig, configureChains, mainnet } from 'wagmi';

import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'


import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
// ----------------------------------------------------------------------

//buffer to invoke wallet connect and coinbase popup
window.Buffer = window.Buffer || require("buffer").Buffer;

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [alchemyProvider({ apiKey: process.env.REACT_APP_BASE_RPC_URL }), publicProvider()],
)


// Set up wagmi config
const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: process.env.REACT_APP_WALLET_CONNECT_ID,
      },
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'AceDen',
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
})


export default function App() {

  return (
    <ThemeProvider>
      <ThemeColorPresets>
        <RtlLayout>
          <MotionLazyContainer>
            <ProgressBarStyle />
            <ScrollToTop />
            <WagmiConfig config={config}>
              <AceDenApp />
            </WagmiConfig>
          </MotionLazyContainer>
        </RtlLayout>
      </ThemeColorPresets>
    </ThemeProvider>
  );
}


const AceDenApp = () => {

   //localstorage clear 24hr
   var hours = 24;
   var now = new Date().getTime();
   var setupTime = localStorage.getItem('access_token');
 
   if (setupTime !== null) {
    var parsed = JSON.parse(setupTime);
    if (now - parsed.expiry > hours * 60 * 60 * 1000) {
      localStorage.clear();
      window.location.reload();
    }
  }

  
  return <Router />;
}



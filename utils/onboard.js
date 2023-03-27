import { init } from '@web3-onboard/react'
import injectedModule from '@web3-onboard/injected-wallets'
import walletConnectModule from '@web3-onboard/walletconnect'
import coinbaseModule from '@web3-onboard/coinbase'
import fortmaticModule from '@web3-onboard/fortmatic'

import Easyzoom_icon from '../easyzoomicon'

const RPC_URL = process.env.PROVIDER_URL
console.log(RPC_URL)
const fortmatic = fortmaticModule({
  apiKey: process.env.NEXT_PUBLIC_FORTMATIC_KEY
})

const injected = injectedModule()
const walletConnect = walletConnectModule()
const coinbaseWallet = coinbaseModule()

const initOnboard = init({
  wallets: [walletConnect, coinbaseWallet, injected, fortmatic],
  chains: [
    // {
    //   id: '0x1',
    //   token: 'ETH',
    //   label: 'Ethereum Mainnet',
    //   rpcUrl: RPC_URL
    // },
    // {
    //   id: '0x3',
    //   token: 'tROP',
    //   label: 'Ethereum Ropsten Testnet',
    //   rpcUrl: RPC_URL
    // },
    // {
    //   id: '0x5',
    //   token: 'gETH',
    //   label: 'Ethereum Goerli Testnet',
    //   rpcUrl: RPC_URL
    // }
    {
      id: '0x11155111',
      token: 'SepoliaETH',
      label: 'Sepolia Testnet',
      rpcUrl: RPC_URL.toString()
    }
  ],
  appMetadata: {
    name: 'Easyzoom',
    icon: Easyzoom_icon,
    description: 'A tool that evolves, a community that thrives',
    recommendedInjectedWallets: [
      { name: 'MetaMask', url: 'https://metamask.io' },
      { name: 'Coinbase', url: 'https://wallet.coinbase.com/' }
    ],
    agreement: {
      version: '1.0.0',
      termsUrl: 'https://www.blocknative.com/terms-conditions',
      privacyUrl: 'https://www.blocknative.com/privacy-policy'
    },
    gettingStartedGuide: 'https://blocknative.com',
    explore: 'https://blocknative.com'
  }
})

export { initOnboard }

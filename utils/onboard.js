import { init } from '@web3-onboard/react'
import injectedModule from '@web3-onboard/injected-wallets'
import walletConnectModule from '@web3-onboard/walletconnect'
import coinbaseModule from '@web3-onboard/coinbase'
import fortmaticModule from '@web3-onboard/fortmatic'

import Easyzoom_icon from '../easyzoomicon'

const rpc_url = 'https://sepolia.infura.io/v3/ff526ca8ef12400d997abd0bd663bb00'
const fortmatic = fortmaticModule({
  apiKey: 'pk_live_1BD1E59D49759BBD'
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
    //   rpcUrl: rpc_url
    // },
    // {
    //   id: '0x3',
    //   token: 'tROP',
    //   label: 'Ethereum Ropsten Testnet',
    //   rpcUrl: rpc_url
    // },
    // {
    //   id: '0x5',
    //   token: 'gETH',
    //   label: 'Ethereum Goerli Testnet',
    //   rpcUrl: rpc_url
    // }
    {
      id: '0x11155111',
      token: 'SepoliaETH',
      label: 'Sepolia Testnet',
      rpcUrl: rpc_url
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

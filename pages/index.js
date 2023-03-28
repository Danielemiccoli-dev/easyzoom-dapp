import { useState, useEffect } from 'react'
import { initOnboard } from '../utils/onboard'
import { useConnectWallet, useWallets } from '@web3-onboard/react'
import { config } from '../dapp.config'
import axios from 'axios'
import {
  whitelistMint
} from '../utils/interact'
import moment from 'moment';

// const {createClient} = require('redis')
const MINT_DATE = "2023-03-29 16:00:00"
const mintDateLocal = moment.utc(MINT_DATE).local().format("DD MMMM HH:mm")


export default function Home() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  //const [{ chains, connectedChain, settingChain }, setChain] = useSetChain()
  const connectedWallets = useWallets()
  const [maxSupply, setMaxSupply] = useState(0)
  const [totalMinted, setTotalMinted] = useState(0)
  const [maxMintAmount, setMaxMintAmount] = useState(0)
  const [status, setStatus] = useState(null)
  const [mintAmount, setMintAmount] = useState(1)
  const [isMinting, setIsMinting] = useState(false)
  const [isWlMint, setIsWlMint] = useState(false)
  const [onboard, setOnboard] = useState(null)

  const getData = async () =>{
  axios.get('https://dapp-api-easyzoom.vercel.app')
        .then(response => {
          console.log(response)
          setIsWlMint(response.data.is_mint_active);
          setTotalMinted(response.data.total_minted);
        })
        .catch(error => {
          console.error('API error:', error);
        });
}
  useEffect(() => {
    setOnboard(initOnboard)
  }, [])

  useEffect(() => {
    if (!connectedWallets.length) return

    const connectedWalletsLabelArray = connectedWallets.map(
      ({ label }) => label
    )
    window.localStorage.setItem(
      'connectedWallets',
      JSON.stringify(connectedWalletsLabelArray)
    )
  }, [connectedWallets])

  useEffect(() => {
    if (!onboard) return

    const previouslyConnectedWallets = JSON.parse(
      window.localStorage.getItem('connectedWallets')
    )

    if (previouslyConnectedWallets?.length) {
      async function setWalletFromLocalStorage() {
        await connect({
          autoSelect: {
            label: previouslyConnectedWallets[0],
            disableModals: true
          }
        })
      }

      setWalletFromLocalStorage()
    }
  }, [onboard, connect])

  useEffect(() => {
    const init = async () => {
      setMaxSupply(888)
      await getData()
      setInterval(async () => {
        await getData()
      }, 5100)
      setMaxMintAmount(config.maxMintAmount)
    }

    init()
  }, [])

  const incrementMintAmount = () => {
    if (mintAmount < maxMintAmount) {
      setMintAmount(mintAmount + 1)
    }
  }

  const decrementMintAmount = () => {
    if (mintAmount > 1) {
      setMintAmount(mintAmount - 1)
    }
  }

  const whitelistMintHandler = async () => {
    setIsMinting(true)
    const { success, status } = await whitelistMint(mintAmount)

    setStatus({
      success,
      message: status
    })

    setIsMinting(false)
  }


  return (
    <div className="min-h-screen h-full w-full overflow-hidden flex flex-col items-center justify-center bg-brand-background ">
      {/* video bg */}
      <video muted autoPlay loop className="dapp-bg"><source src="/images/Background-MINTPAGE.mp4" type="video/mp4"/></video>
      <div className="relative w-full h-full flex flex-col items-center justify-center">

        <div className="flex flex-col items-center justify-center h-full w-full px-2 md:px-10 custom-margin">
          <div className="relative z-1 md:max-w-3xl w-full custom-color filter backdrop-blur-md  rounded-2xl px-4 py-4 md:px-8 md:py-8 flex flex-col items-center light-bg">
            <div className="p-1 rounded-2xl animated-border-wrapper relative">
              <div className="animated-border"></div>
              <div className="black-bg rounded-2xl px-4 py-4 md:px-8 md:py-8">
                <div className="flex flex-col items-center pb-8 w-full">
                  <h3 className="font-poppins tracking-widest text-xl main-pink mt-2">
                    <span className="text-white px-8 py-3 uppercase"><b>Easyzoom Mint</b></span>
                  </h3>
                </div>
                {wallet && (
                  <button
                    className="absolute right-5 md:right-10 transition duration-200 ease-in-out font-chalk border-2 border-white-500 rounded-xl active:shadow-none px-4 py-2 rounded-full text-sm text-white tracking-wide uppercase"
                    onClick={() =>
                      disconnect({
                        label: wallet.label
                      }) && setStatus(null)
                    }
                  >
                    Disconnect
                  </button>
                )}
                <h1 className="font-poppins tracking-widest font-bold text-2xl md:text-2xl bg-gradient-to-br primary bg-clip-text text-transparent mt-3">
                  <span className="text-white"></span>
                  {isWlMint=='true' ? `Mint is Live!` : mintDateLocal}
                </h1>
                <h3 className="text-sm text-white tracking-widest">
                  {wallet?.accounts[0]?.address
                    ? wallet?.accounts[0]?.address.slice(0, 8) +
                      '...' +
                      wallet?.accounts[0]?.address.slice(-4)
                    : ''}
                </h3>

                <div className="flex flex-col md:flex-row md:space-x-14 w-full mt-10 md:mt-14">
                  <div className="relative w-full">
                    <div className="font-poppins font-bold z-10 absolute top-2 left-2 opacity-80 filter backdrop-blur-lg text-base px-4 py-2 bg-black rounded-full flex items-center justify-center text-white font-semibold">
                      <p>
                        <span className="main-violet">{totalMinted}</span> /{' '}
                        {maxSupply}
                      </p>
                    </div>

                    <video className="rounded-xl" muted autoPlay loop><source src="/images/easyzoom_pass_video.mp4" type="video/mp4"/></video>
                  </div>

                  <div className="flex flex-col items-center w-full px-4 mt-16 md:mt-0">
                    <div className="font-poppins font-bold flex items-center justify-between w-full">
                      <div className="p-3 bg-secondary-o rounded-full">
                        <button
                          className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center white hover:shadow-lg bg-secondary font-bold rounded-full"
                          onClick={decrementMintAmount}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 md:h-8 md:w-8"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M18 12H6"
                            />
                          </svg>
                        </button>
                      </div>
                      

                      <p className="font-poppins flex items-center justify-center flex-1 grow text-center font-bold white text-3xl md:text-5xl">
                        {mintAmount}
                      </p>
                      <div className="p-3 bg-primary-o rounded-full">
                        <button
                          className="w-10 h-10 md:w-12 md:h-12 font-bold flex items-center justify-center white hover:shadow-lg bg-primary font-bold rounded-full"
                          onClick={incrementMintAmount}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 md:h-8 md:w-8"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                        </button>
                      </div>
                      

                    </div>

                    <p className="text-sm text-white tracking-widest mt-3">Max mint amount per wallet: {config.maxMintAmount}
                    </p>

                    <div className="border-t border-b py-4 mt-16 w-full">
                      <div className="w-full text-xl font-poppins font-bold flex items-center justify-between main-violet">
                        <p className="white">Total</p>

                        <div className="flex items-center space-x-3">
                          <p className="primary">
                            {Number.parseFloat(config.price * mintAmount).toFixed(3)} ETH
                          </p>{' '}
                          <span className="text-white">+ GAS</span>
                        </div>
                      </div>
                    </div>

                    {/* Mint Button && Connect Wallet Button */}
                    {wallet ? (
                      <button
                        className={` ${
                            !isWlMint=='true' || isMinting
                            ? 'cursor-not-allowed font-bold'
                            : 'shadow-lg font-bold hover:shadow-pink-400/50'
                        } bg-transparent text-white-700 font-semibold py-2 px-4 border-4 border-secondary rounded-xl font-poppins mt-12 w-full px-6 py-3 rounded-full text-2xl text-white  mx-4 tracking-wide uppercase`}
                        disabled={!isWlMint=='true' || isMinting}
                        onClick={ isWlMint=='true' ? whitelistMintHandler : null}
                      >
                        {isMinting ? 'Minting...' : 'Mint Now'}
                      </button>
                    ) : (
                      <button
                        className="bg-transparent text-white-700 font-semibold py-2 px-4 border-4 border-secondary rounded-xl font-poppins font-bold mt-10 w-full shadow-lg px-6 py-3 rounded-full text-xl text-white hover:shadow-pink-400/50 mx-4 tracking-wide uppercase"
                        onClick={() => connect()}
                      >
                        Connect Wallet
                      </button>
                    )}
                  </div>
                </div>

                {/* Status */}
                {!isMinting && wallet?.accounts[0]?.address ? status && (
                  <div
                    className={`border ${
                      status.success ? 'border-secondary' : 'border-brand-pink-400 '
                    } rounded-md text-start h-full px-4 py-4 w-full mx-auto mt-8 md:mt-4"`}
                  >
                    <p className="flex flex-col space-y-2 text-white text-sm md:text-base break-words ...">
                      {status.message}
                    </p>
                  </div>
                ): null}

                {/* Contract Address */}
                <div className="border-t flex flex-col items-center mt-10 py-2 w-full">
                  <h4 className="font-poppins tracking-widest text-l main-pink mt-6">
                    <span className="text-white px-8 py-3 rounded-full bg-primary-o"><b>Contract Address</b></span>
                  </h4>
                  <a
                    href={`https://etherscan.io/address/${config.contractAddress}#readContract`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-poppins text-white mt-4 uppercase"
                  >
                    <span className="break-all ...">{config.contractAddress}</span>
                  </a>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}

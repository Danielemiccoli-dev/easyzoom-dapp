
const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')
const whitelist = require('../scripts/whitelist.json')
const Web3 = require('web3')

const providerUrl = 'https://mainnet.infura.io/v3/ff526ca8ef12400d997abd0bd663bb00'

const web3 = new Web3(providerUrl);
import { config } from '../dapp.config'
const contract = require('../contract/easyzoom.json')

const nftContract = new web3.eth.Contract(contract.abi, config.contractAddress)

// Calculate merkle root from the whitelist array
const leafNodes = whitelist.map((addr) => keccak256(addr))
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true })
const root = merkleTree.getRoot()

export const getTotalMinted = async () => {
  const totalMinted = await nftContract.methods.totalSupply().call()
  return totalMinted
}

export const isMintState = async () => {
  const mintState = await nftContract.methods.whitelistMintState().call()
  return mintState
}

export const whitelistMint = async (mintAmount) => {
  if (!window.ethereum.selectedAddress) {
    return {
      success: false,
      status: 'To be able to mint, you need to connect your wallet'
    }
  }

  const leaf = keccak256(window.ethereum.selectedAddress)
  const proof = merkleTree.getHexProof(leaf)

  // Verify Merkle Proof
  const isValid = merkleTree.verify(proof, leaf, root)

  if (!isValid) {
    return {
      success: false,
      status: 'Invalid Merkle Proof - Your address is not whitelisted!'
    }
  }

  const nonce = await web3.eth.getTransactionCount(
    window.ethereum.selectedAddress,
    'latest'
  )

  // Set up our Ethereum transaction
  const tx = {
    to: config.contractAddress,
    from: window.ethereum.selectedAddress,
    value: parseInt(web3.utils.toWei(String(config.price * mintAmount, 'ether'))).toString(16), // hex
    data: nftContract.methods.whitelistMint(proof, mintAmount).encodeABI(),
    nonce: nonce.toString(16)
  }

  try {
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [tx]
    })

    return {
      success: true,
      status: (
        <a href={`https://etherscan.io/tx/${txHash}`} target="_blank">
          <p>Check out your transaction on Etherscan:</p>
          <p>{`https://etherscan.io/tx/${txHash}`}</p>
        </a>
      )
    }
  } catch (error) {
    return {
      success: false,
      status: 'Something went wrong: ' + error.message
    }
  }
}

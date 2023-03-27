/**
 *   This script will calculate the merkle root from the whitelist array and set it to the contract
 */

const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')
const whitelist = require('./whitelist.json')
const ethers = require('ethers');

const whiteListLeaves = whitelist.map(addr => keccak256(addr))
const tree = new MerkleTree(whiteListLeaves, keccak256, {sortPairs: true})
const rootHash = tree.getRoot()
const leaf = keccak256("0x771368BcC687D8F78858b13b4F54626f8C198f7a")
const proof = tree.getHexProof(leaf)
const proofString = JSON.stringify(proof).replace(/'/g, '').replace(/\s+/g, '');

// const proofk = keccak256(proof)



console.log(rootHash.toString("hex"));
console.log(proofString)

const claimingAddress = whiteListLeaves[5]; //Minting address




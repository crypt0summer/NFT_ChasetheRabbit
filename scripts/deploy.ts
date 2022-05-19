import { ethers, web3 } from "hardhat";
import {Currency, mintNFTWithUri} from '@tatumio/tatum';
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256')
let tree: any;
import * as dotenv from "dotenv";
dotenv.config();

const main = async () => {
  const nftContractFactory = await ethers.getContractFactory('ProtocolCampNFT');
  const nftContract = await nftContractFactory.deploy();
  const baseUri = "ipfs://QmPzdmUuf9fdd4i9uMoqxsgYMHjGKyGJ4mXo1zDRNRVNs3/";
  //QmP5iUmCqThK1GgP55w3PLsz52JArk1nJYspLkcM4Qjocb
  
  await nftContract.deployed();
  console.log("Contract deployed to:", nftContract.address);
  
  const root_merkle = await setWL();
  await nftContract.setBaseURI(baseUri);
  await nftContract.setMerkleRoot(root_merkle);

  // let [owner, addr1, addr2, addr3] = await ethers.getSigners();


  //계정 1 0x7e6c8d5D3C01176a6bd5A61e32350A6116167148 민팅테스트
  // const hexProof = tree.getHexProof(web3.utils.soliditySha3({t: 'address', v: owner.address}, {t: 'uint256', v:1}));
  // const hexProof = tree.getHexProof(ethers.utils.solidityKeccak256([ "address", "uint256" ], [ owner.address, 1 ]));
  
  // console.log('hex: '+ hexProof);
  // await nftContract.connect(owner).mintWL(hexProof, 1);
  

  // const hexProof2 = tree.getHexProof(web3.utils.soliditySha3({t: 'address', v: await(checkEmptyAddr(process.env.WL0))}, {t: 'uint256', v:0}));
  // console.log('hex: '+ hexProof2);
  
  //계정 2 민팅 테스트 0xcA3266F30f72fB8cF41b3A697338bAFA59435Eba
  // const hexProof2 = tree.getHexProof(web3.utils.soliditySha3({t: 'address', v: addr1.address}, {t: 'uint256', v:1}));
  // console.log('hex: '+ hexProof2);
  // await nftContract.connect(addr1).mintWL(hexProof2, 1);
  
  // const hexProof3 = tree.getHexProof(web3.utils.soliditySha3({t: 'address', v: addr2.address}, {t: 'uint256', v:2}));
  // console.log('hex: '+ hexProof3);
  // await nftContract.connect(addr2).mintWL(hexProof3, 2);

  // const hexProof4 = tree.getHexProof(web3.utils.soliditySha3({t: 'address', v: addr3.address}, {t: 'uint256', v:3}));
  // console.log('hex: '+ hexProof4);
  // await nftContract.connect(addr3).mintWL(hexProof4, 3);

};


const setWL = async () => {
  // let [owner, addr1, addr2, addr3] = await ethers.getSigners();
  // let whitelistAddresses = [
  //   //   {key: "0xcA3266F30f72fB8cF41b3A697338bAFA59435Eba", value: 0},
  //       // {key: owner.address, value: 0},
  //       // {key: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", value: 1},
  //       {key: "0xcA3266F30f72fB8cF41b3A697338bAFA59435Eba", value: 0},
  //       {key: "0x7e6c8d5D3C01176a6bd5A61e32350A6116167148", value: 1}, 
  //       {key: "0x58e2211855a45706e6A9c084CaA4Ae35DFA50325", value: 2}, 
  //       {key: "0x1c83cFAC1E45b13887e8487B9Dd0e98d2b99522F", value: 3}, 
  //   ]      
 
  let whitelistAddresses = [
    {key: await(checkEmptyAddr(process.env.WL0)), value: 0},
    {key: await(checkEmptyAddr(process.env.WL1)), value: 1},
    {key: await(checkEmptyAddr(process.env.WL2)), value: 2},
    {key: await(checkEmptyAddr(process.env.WL3)), value: 3},
    {key: await(checkEmptyAddr(process.env.WL4)), value: 4},
    {key: await(checkEmptyAddr(process.env.WL5)), value: 5},
    {key: await(checkEmptyAddr(process.env.WL6)), value: 6},
    {key: await(checkEmptyAddr(process.env.WL7)), value: 7},
    {key: await(checkEmptyAddr(process.env.WL8)), value: 8},
    {key: await(checkEmptyAddr(process.env.WL9)), value: 9},
    {key: await(checkEmptyAddr(process.env.WL10)), value: 10},
    {key: await(checkEmptyAddr(process.env.WL11)), value: 11},
    {key: await(checkEmptyAddr(process.env.WL12)), value: 12},
    {key: await(checkEmptyAddr(process.env.WL13)), value: 13},
    {key: await(checkEmptyAddr(process.env.WL14)), value: 14},
]  


  const leaves = whitelistAddresses.map(object => 
      web3.utils.soliditySha3({t: 'address', v: object.key}, {t: 'uint256', v: object.value})
  );
  tree = new MerkleTree(leaves, keccak256, { sort: true });

  // console.log(tree);
  console.log(tree.toString());

  const root_merkle = tree.getRoot();
  return root_merkle;
};

const checkEmptyAddr = async(val : any) => {
  return val!== undefined ? val: "EMPTY_ENV"
 }

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
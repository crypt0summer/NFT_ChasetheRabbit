import { expect } from "chai";
import { Contract, Signer } from "ethers";
import { ethers, web3 } from "hardhat";

const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256')
var Web3 = require('web3');

let owner: any;
let addr1: any;
let addr2: any;
let addr3: any;
let addr4: any;
let addrTest : '0x7e6c8d5D3C01176a6bd5A61e32350A6116167148'

let deployedAddress: string;
const baseUri = "ipfs://QmbgHvZTwJce71Ezi9D3sCdZdQ3Hu6LnPuHREaUb3pwYGK/";

describe('ProtocolCampNFT',()=>{
    let NFT_airdrop;
    let nft_contract: Contract;   
    let tree: any;
    
    before(async function () {
        //wallets
        [owner, addr1, addr2, addr3, addr4] = await ethers.getSigners();
        
        let whitelistAddresses = [
        //   {key: "0xcA3266F30f72fB8cF41b3A697338bAFA59435Eba", value: 0},
            // {key: owner.address, value: 0},
            // {key: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", value: 1},
            {key: "0xcA3266F30f72fB8cF41b3A697338bAFA59435Eba", value: 0},
            {key: "0x7e6c8d5D3C01176a6bd5A61e32350A6116167148", value: 1}, 
            {key: "0x58e2211855a45706e6A9c084CaA4Ae35DFA50325", value: 2}, 
        ]   

        // console.log(whitelistAddresses);
        // console.log(addr1.address);
        
        const leaves = whitelistAddresses.map(object => 
            // web3.utils.soliditySha3({t: 'address', v: object.key}, {t: 'uint256', v: object.value})
            ethers.utils.solidityKeccak256([ "address", "uint256" ], [ object.key, object.value ])
        );
        tree = new MerkleTree(leaves, keccak256, { sort: true });
        const root_merkle = tree.getRoot();
        console.log(tree.toString());

        console.log('tree: ', tree.toString);

        // console.log('root: '+ tree.getHexRoot());


        NFT_airdrop = await ethers.getContractFactory("ProtocolCampNFT");
        nft_contract= await NFT_airdrop.deploy();
        await nft_contract.deployed();
        await nft_contract.setBaseURI(baseUri);
        await nft_contract.setMerkleRoot(root_merkle);

        deployedAddress = nft_contract.address;
        
    });

    it("Should success mint - WL", async function () {
        const hexProof
            //  = tree.getHexProof(web3.utils.soliditySha3({t: 'address', v: addr1.address}, {t: 'uint256', v:1}));
            = tree.getHexProof(ethers.utils.solidityKeccak256([ "address", "uint256" ], [ "0x58e2211855a45706e6A9c084CaA4Ae35DFA50325", 2]));
        
        console.log('add: '+ addr1.address);
        console.log('hex: ', hexProof);
        // await nft_contract.connect(addr1).mintWL(['0x88d11c85c2834de10968810cd22310734fb85a55b24a269a208f79f711da9fac'], 0);
        await nft_contract.connect(addr1).mintWL(hexProof, 1);

        console.log(await nft_contract._tokenURI(1));
        expect(
            1
        ).equals(1)
    });

    it("Should fail mint - Wrong token uri", async function () {
        const hexProof = tree.getHexProof(web3.utils.soliditySha3({t: 'address', v: owner.address}, {t: 'uint256', v:1}));

        await expect(
            nft_contract.connect(owner).mintWL(hexProof, 1)
          ).to.be.revertedWith("No WL or Wrong URI");
    });

    it("Should fail mint - NO WL", async function () {
        const hexProof = tree.getHexProof(web3.utils.soliditySha3({t: 'address', v: addr3.address}, {t: 'uint256', v:1}));

        await expect(
            nft_contract.connect(addr3).mintWL(hexProof, 1)
          ).to.be.revertedWith("No WL or Wrong URI");
    });

    it("Should fail mint - Already claimed", async function () {
        const hexProof = tree.getHexProof(web3.utils.soliditySha3({t: 'address', v: addr1.address}, {t: 'uint256', v:1}));

        await expect(
            nft_contract.connect(addr1).mintWL(hexProof, 1)
          ).to.be.revertedWith("Already claimed");
    });

  
});

const chai = require("chai");
const { BigNumber } = require("ethers");
const {expect} = chai;
const {ethers} = require("hardhat")

let erc1155, owner, alice, bob;

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

describe("ERC1155", function () {
    before(async function () {
        [owner, alice, bob] = await ethers.getSigners()
    });

    beforeEach(async function () {
        const ERC1155 = await ethers.getContractFactory("ERC1155");
        erc1155 = await ERC1155.deploy()
        await erc1155.deployed()   
    })

    it("Is deployed", async function(){
        expect(erc1155.address).to.not.equal(ZERO_ADDRESS)
    })

    it("Owner set", async function(){
        const newOwner = await erc1155.owner()
        expect(owner.address).to.be.equal(newOwner)
    })

    // it("Get name", async function(){
    //     const name = "HUFFERC1155"
    //     const contractName = await erc1155.name()
    //     console.log(contractName)
    //     expect(name).to.be.equal(contractName)
    // })

    // it("Get symbol", async function(){
    //     const sym = await erc1155.symbol();
    // })

    it("Can mint", async function(){
        console.log("mint tx")
        const minttx = await erc1155.populateTransaction.mint(owner.address, 1, 1, "0x00")
        const mint = await erc1155.mint(owner.address, 1, 1, "0x00");

        // TODO: check for valid transferSingle event

        const balance = await erc1155.balanceOf(owner.address,1);
        expect(balance).to.equal(BigNumber.from("1"));
    })

    it("Can batch mint", async function(){
        // const batchMintTx = await erc1155.populateTransaction.batchMint(owner.address, [1,2,3], [1,1,1], "0x00");
        // console.log("batch mint tx");
        // console.log(batchMintTx);

        await erc1155.batchMint(owner.address, [1,2,3], [1,1,1], "0x00");
        const bal1 = await erc1155.balanceOf(owner.address, 1)
        const bal2 = await erc1155.balanceOf(owner.address, 2)
        const bal3 = await erc1155.balanceOf(owner.address, 3)
        
        expect(bal1).to.equal(BigNumber.from("1"))
        expect(bal2).to.equal(BigNumber.from("1"))
        expect(bal3).to.equal(BigNumber.from("1"))

        // TODO: check for bal

    })

    it("Can transfer", async function(){
        const tokenId = 1;
        const transferAmount = 1;

        // Mint and check mint success
        await erc1155.mint(owner.address, tokenId, transferAmount, "0x00");
        const balance = await erc1155.balanceOf(owner.address,tokenId);
        expect(balance).to.equal(BigNumber.from("1"));

        // perform transfer
        await erc1155.safeTransferFrom(owner.address, bob.address, tokenId, transferAmount, "0x00");
        
        // Check debit and credit success
        const fromBalanceAfter = await erc1155.balanceOf(owner.address, tokenId);
        expect(fromBalanceAfter).to.equal(BigNumber.from("0"));

        const toBalanceAfter = await erc1155.balanceOf(bob.address, tokenId);
        expect(toBalanceAfter).to.equal(BigNumber.from("1"));
    })  

    it("Can burn token", async function(){
        const tokenId = 1;
        const burnAmount = 1;

        // Mint and check success
        await erc1155.mint(owner.address, tokenId, burnAmount, "0x00");
        const balance = await erc1155.balanceOf(owner.address,tokenId);
        expect(balance).to.equal(BigNumber.from("1"));

        // perform burn
        await erc1155.burn(owner.address, tokenId, burnAmount);
        const fromBalanceAfter = await erc1155.balanceOf(owner.address, tokenId);
        expect(fromBalanceAfter).to.equal(BigNumber.from("0"));
    });


})
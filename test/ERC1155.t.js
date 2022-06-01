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


    it("Can mint", async function(){
        const mint = await erc1155.mint(owner.address, 1, 1, "0x00");
        console.log(mint)

        const balance = await erc1155.balanceOf(owner.address,1);
        expect(balance).to.equal(BigNumber.from("1"));
    })

    it("Can transfer", async function(){
        const mint = await erc1155.mint(owner.address, 1, 1, "0x00");
        console.log(mint)

        const balance = await erc1155.balanceOf(owner.address,1);
        expect(balance).to.equal(BigNumber.from("1"));

        // TODO:
        // const transfer = await erc1155.safeT()
    })
})
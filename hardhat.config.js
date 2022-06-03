require("hardhat-huff");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("hardhat/config")

const fs = require("fs");
const { execSync } = require("child_process");
const glob = require("glob");
const path = require("path");

task("huff-debug")
  .addPositionalParam("file")
  .addPositionalParam("func")
  .addPositionalParam("args")
  .setAction(async ({file, func, args }, { run, config, artifacts, ethers }) => {
    await run("compile");
    await debug(file, func, args, config.huff, config.paths, artifacts, ethers);
});


async function debug(file, func, args, huffConfig, paths, artifacts, ethers){ 
  const config = {
    hevmContractAddress: "0x0000000000000000000000000000000000000420",
    hevmCaller: "0x0000000000000000000000000000000000000069"
  }

  // Get file name
  const huffFiles = await getFiles(paths);
  const target = huffFiles.find(hf => hf.includes(file)).replace(__dirname,"");

  // get compiler artifact
  const artifact =  fs.readFileSync(`${paths.artifacts}/${target}/${file}.json`, "utf-8")
  const {abi, deployedBytecode} = JSON.parse(artifact);

  // Get contract
  const contract = new ethers.Contract(config.hevmContractAddress, abi);
  const tx = await contract.populateTransaction[func](...args.split(","));

  // Command
  const command = `hevm exec \
  --code 0x${deployedBytecode} \
  --address ${config.hevmContractAddress} \
  --caller ${config.hevmCaller} \
  --gas 0xffffffff \
  --debug \
  --calldata ${tx.data}`
  
  fs.writeFileSync("cache/hevmtemp", command);
 
  // run the debugger
  execSync("`cat cache/hevmtemp`", {stdio: ["inherit", "inherit", "inherit"]})
}

/** Get an array of all files */
const getFiles = async (paths) => {
  // Return an array of all Huff files.
  return glob.sync(path.join(paths.sources, "**", "*.huff"));
};

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.0",
  huff: {
    version: "0.0.23",
  },
};

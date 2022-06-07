require("hardhat-huff");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("hardhat/config");
require("huff-debug");

const fs = require("fs");
const { execSync } = require("child_process");
const glob = require("glob");
const path = require("path");
const { boolean } = require("hardhat/internal/core/params/argumentTypes");

// task("huff-debug")
//   .addPositionalParam("file")
//   .addPositionalParam("func")
//   .addPositionalParam("args")
//   // Optional Parameters - Defining hevm state - not implemented yet
//   .addFlag("state", "Use maintained hevm state")
//   .addFlag("reset", "Reset hevm state")
   
//   .setAction(async (params, { run, config, artifacts, ethers }) => {
//     console.log(params)
    
//     await run("compile");

//     await debug(params.file, params.func, params.args, config.huff, config.paths, artifacts, ethers);
// });


// async function debug(
//   file, 
//   func, 
//   args, 
//   flags,
//   paths, 
//   artifacts, 
//   ethers // where tf is this type
// ){ 
//   // TODO: sanitizeConfig()
//   const config = {
//     hevmContractAddress: "0x0000000000000000000000000000000000000420",
//     hevmCaller: "0x0000000000000000000000000000000000000069",
//     statePath: "cache/huff_debug_hevm_state"
//   }

//   // Get all files with .huff extension from the project
//   const huffFiles = await getFiles(paths);

//   // Find provided [file] argument
//   let target = huffFiles.find((hf) => {
//       if (hf) return hf.includes(file)
//       return false
//     })

//   // TODO: syntactic abomination
//   if (target) target = target.replace(__dirname,"")
//   else throw new NomicLabsHardhatPluginError(PLUGIN_NAME, "Named file not found");
    
//   // get compiler artifact
//   const artifact =  fs.readFileSync(`${paths.artifacts}/${target}/${file}.json`, "utf-8")
//   const {abi, deployedBytecode} = JSON.parse(artifact);

//   // Get contract and encoded transaction
//   const contract = new ethers.Contract(config.hevmContractAddress, abi);
//   const tx = await contract.populateTransaction[func](...args.split(","));

//   runDebugger(deployedBytecode, tx.data, flags, config);
// }


// const runDebugger = (bytecode, calldata, flags, config) => {
//   if (flags){
//       if (flags.reset){
//           resetStateRepo(config.statePath)
//       }
//   }
  
//     // Command
//   const command = `hevm exec \
//   --code 0x${bytecode} \
//   --address ${config.hevmContractAddress} \
//   --caller ${config.hevmCaller} \
//   --gas 0xffffffff \
//   ${(flags.state) ? ("--state "+ config.statePath + " \\")  : ""}
//   --debug \
//   --calldata ${calldata}`
  
//   // command is cached into a file as execSync has a limit on the command size that it can execute
//   fs.writeFileSync("cache/hevmtemp", command);
 
//   // run the debugger
//   execSync("`cat cache/hevmtemp`", {stdio: ["inherit", "inherit", "inherit"]})
// }


// /**Reset state repo
//  * 
//  * Hevm state is stored within a local git repository, to reset the state 
//  * we must delete the repository then init a new one.
//  * 
//  * TODO: Windows compatibility
//  * @param statePath 
//  */
// const resetStateRepo = (statePath) => {
//     const removeStateCommand = `rm -rf ${statePath}`;
//     const createStateRepository = `mkdir ${statePath}`;
//     const initStateRepositoryCommand = `cd ${statePath} && git init && git commit --allow-empty -m "init" && cd ..`;

//     execSync(removeStateCommand)
//     execSync(createStateRepository)
//     execSync(initStateRepositoryCommand)
// }

// /** Get an array of all files */
// const getFiles = async (paths) => {
//   // Return an array of all Huff files.
//   return glob.sync(path.join(paths.sources, "**", "*.huff"));
// };

module.exports = {
  solidity: "0.8.0",
  huff: {
    version: "0.0.23",
  },
};

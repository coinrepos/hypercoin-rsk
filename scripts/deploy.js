const fs = require("fs");
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const WrappedHyperCoin = await hre.ethers.getContractFactory("WrappedHyperCoin");
  const contract = await WrappedHyperCoin.deploy(deployer.address);
  await contract.deployed();

  console.log("WrappedHyperCoin deployed to:", contract.address);

  // Extract ABI and bytecode
  const artifact = await hre.artifacts.readArtifact("WrappedHyperCoin");

  // Save ABI
  fs.writeFileSync("abi.json", JSON.stringify(artifact.abi, null, 2));
  console.log("✅ ABI saved to abi.json");

  // Save Bytecode
  fs.writeFileSync("bytecode.txt", artifact.bytecode);
  console.log("✅ Bytecode saved to bytecode.txt");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

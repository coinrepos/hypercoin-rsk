// scripts/deployMint.js
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("🚀 Deploying with address:", deployer.address);

  const Token = await ethers.getContractFactory("WrappedHyperCoin"); // <- or replace with your token name
  const token = await Token.deploy();
  await token.deployed();

  console.log("✅ Token deployed to:", token.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

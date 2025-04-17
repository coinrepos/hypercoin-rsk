const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("🔐 Deployer:", deployer.address);

  const KitCoin = await ethers.getContractFactory("KitCoin");
  const kitcoin = await KitCoin.deploy();
  await kitcoin.deployed();

  console.log("✅ KitCoin deployed at:", kitcoin.address);
}

main().catch((err) => {
  console.error("❌ Minting failed:", err);
  process.exit(1);
});

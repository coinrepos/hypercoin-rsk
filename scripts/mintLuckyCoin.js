const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("🔐 Deployer:", deployer.address);

  const LuckyCoin = await ethers.getContractFactory("LuckyCoin");
  const luckycoin = await LuckyCoin.deploy();
  await luckycoin.deployed();

  console.log("✅ LuckyCoin deployed at:", luckycoin.address);
}

main().catch((err) => {
  console.error("❌ Minting failed:", err);
  process.exit(1);
});

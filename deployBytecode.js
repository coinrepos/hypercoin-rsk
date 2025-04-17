require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");

// ✅ Correct file paths (root directory)
const abi = JSON.parse(fs.readFileSync("./abi.json", "utf8"));
const bytecode = fs.readFileSync("./bytecode.txt", "utf8");

const provider = new ethers.providers.JsonRpcProvider(process.env.RSK_RPC_URL);
const wallet = new ethers.Wallet(process.env.RSK_PRIVATE_KEY, provider);

(async () => {
  try {
    const factory = new ethers.ContractFactory(abi, bytecode, wallet);

    // ✅ Set constructor parameter (replace with your deployer address)
    const contract = await factory.deploy(wallet.address);
    console.log("⛓ Contract deployment initiated...");
    await contract.deployed();
    console.log("✅ Deployed at address:", contract.address);
  } catch (err) {
    console.error("❌ Deployment failed:", err);
  }
})();

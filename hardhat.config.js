require("@nomiclabs/hardhat-ethers");
require("@nomicfoundation/hardhat-verify");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  defaultNetwork: "rsk",
  networks: {
    rsk: {
      url: process.env.RSK_RPC_URL || "https://public-node.rsk.co",
      accounts: process.env.RSK_PRIVATE_KEY ? [process.env.RSK_PRIVATE_KEY] : [],
      chainId: 30
    }
  },
  etherscan: {
    customChains: [
      {
        network: "rsk",
        chainId: 30,
        urls: {
          apiURL: "https://blockscout.com/rsk/mainnet/api",
          browserURL: "https://blockscout.com/rsk/mainnet"
        }
      }
    ],
    apiKey: {
      rsk: process.env.RSK_EXPLORER_API_KEY
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 20000
  },
  sourcify: {
    enabled: false
  }
};

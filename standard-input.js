// standard-input.js
const fs = require("fs");
const path = require("path");
const solc = require("solc");

// Set the entry contract path
const ENTRY_FILE = "contracts/WrappedHyperCoin.sol";

// Recursively resolve all imports
function getAllSources(entryPath, sources = {}) {
  const content = fs.readFileSync(entryPath, "utf8");
  const relativePath = path.relative(__dirname, entryPath).replace(/\\/g, "/");
  sources[relativePath] = { content };

  const importRegex = /import\s+["']([^"']+)["'];/g;
  let match;
  while ((match = importRegex.exec(content))) {
    const importPath = match[1];

    // Skip if already included
    if (Object.keys(sources).includes(importPath)) continue;

    let resolvedPath;

    if (importPath.startsWith("@openzeppelin")) {
      resolvedPath = path.resolve(__dirname, "node_modules", importPath);
    } else {
      resolvedPath = path.resolve(path.dirname(entryPath), importPath);
    }

    if (!fs.existsSync(resolvedPath)) {
      console.error("❌ File not found:", importPath);
      continue;
    }

    getAllSources(resolvedPath, sources);
  }

  return sources;
}

// Build the compiler input
const sources = getAllSources(path.resolve(__dirname, ENTRY_FILE));

const input = {
  language: "Solidity",
  sources,
  settings: {
    optimizer: {
      enabled: true,
      runs: 200
    },
    outputSelection: {
      "*": {
        "*": ["abi", "evm.bytecode", "evm.deployedBytecode", "metadata"]
      }
    }
  }
};

// Write to standard-input.json
fs.writeFileSync("standard-input.json", JSON.stringify(input, null, 2), "utf8");

console.log("✅ standard-input.json generated with embedded OpenZeppelin contracts.");

const solc = require('solc');
const fs = require('fs');

const source = fs.readFileSync('contracts/FlattenedWrappedHyperCoin.sol', 'utf8');

const input = {
  language: 'Solidity',
  sources: {
    'FlattenedWrappedHyperCoin.sol': { content: source },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['abi', 'evm.bytecode.object'],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

const contract = output.contracts['FlattenedWrappedHyperCoin.sol']['WrappedHyperCoin'];
fs.writeFileSync('abi.json', JSON.stringify(contract.abi, null, 2));
fs.writeFileSync('bytecode.txt', contract.evm.bytecode.object);

console.log('ABI and Bytecode saved.');

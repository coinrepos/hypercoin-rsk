// SPDX-License-Identifier: NO LICENCE
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WrappedHyperCoin is ERC20, Ownable {
    address public ethereumLockContract;

    // Flat fee per mint (0.0001 token)
    uint256 public constant feePerMint = 100; // 0.0001 * 10^18

    event Minted(address indexed user, uint256 amount);
    event Burned(address indexed user, uint256 amount);

    constructor(address initialOwner) ERC20("Wrapped HyperCoin", "wHC") Ownable(initialOwner) {}

    function setEthereumLockContract(address _lockContract) external onlyOwner {
        ethereumLockContract = _lockContract;
    }

    function mint(address user, uint256 amount) external {
        require(msg.sender == ethereumLockContract, "Only Ethereum Lock Contract can mint");
        require(amount > 0, "Amount must be greater than 0");
        require(amount > feePerMint, "Amount must be greater than the fee");

        uint256 userAmount = amount - feePerMint;

        _mint(user, userAmount);
        _mint(owner(), feePerMint);

        emit Minted(user, userAmount);
    }

    function burn(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        _burn(msg.sender, amount);
        emit Burned(msg.sender, amount);
    }
}

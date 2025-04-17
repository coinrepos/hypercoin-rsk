// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ShadowToken is ERC20 {
    bool public isShadow = true;
    address public admin;

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        admin = msg.sender;
        _mint(msg.sender, 1_000_000 ether);
    }

    function transfer(address to, uint256 amount) public override returns (bool) {
        revert("Shadow tokens cannot be transferred.");
    }

    function destroy() external {
        require(msg.sender == admin, "Not admin");
        selfdestruct(payable(admin));
    }
}

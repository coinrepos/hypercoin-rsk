// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract KitCoin {
    mapping(address => uint256) private _balances;
    address public creator; // Renamed from "owner" to avoid shadowing

    mapping(address => mapping(address => uint256)) private _allowances;

    modifier onlyOwner() {
        require(msg.sender == creator, "Only creator can call this function");
        _;
    }

    constructor() {
        creator = msg.sender;
    }

    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    function transfer(address recipient, uint256 amount) public returns (bool) {
        require(_balances[msg.sender] >= amount, "Insufficient balance");
        _balances[msg.sender] -= amount;
        _balances[recipient] += amount;
        return true;
    }

    function approve(address spender, uint256 amount) public returns (bool) {
        _allowances[msg.sender][spender] = amount;
        return true;
    }

    function allowance(address ownerAddress, address spender) public view returns (uint256) { // Renamed parameter
        return _allowances[ownerAddress][spender];
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public returns (bool) {
        require(_balances[sender] >= amount, "Insufficient balance");
        require(_allowances[sender][msg.sender] >= amount, "Allowance exceeded");

        _balances[sender] -= amount;
        _allowances[sender][msg.sender] -= amount;
        _balances[recipient] += amount;
        return true;
    }

    function mint(address account, uint256 amount) public onlyOwner {
        _balances[account] += amount;
    }

    function burn(address account, uint256 amount) public onlyOwner {
        require(_balances[account] >= amount, "Insufficient balance");
        _balances[account] -= amount;
    }
}

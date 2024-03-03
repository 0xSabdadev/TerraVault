// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;
import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20{
    constructor() ERC20 ('DIYUT','DYT'){
        _mint(msg.sender, 10000000000000000000000000);
    }
    function _approve(address owner, uint amount) public{
        ERC20.approve(owner, amount);
    }
}
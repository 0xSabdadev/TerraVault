// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BinanceCoin is ERC20 {
    constructor () ERC20("BinanceCoin", "BNB") {

        _mint(msg.sender, 100000000000000000000);
    }

}

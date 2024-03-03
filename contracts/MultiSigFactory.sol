// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "./Multisig.sol";

contract MultiSigFactory{

    struct UserWallets{
        address walletAdress;
        uint walletID;
    }

    uint id = 0;
    UserWallets[] userWallets;
    MultiSigTA[] multisigWalletInstances;

    mapping(address => UserWallets[]) ownersWallets;

    event walletCreated(address createdBy, address newWalletContractAddress, uint timeOfTransaction);

    function createNewWallet() public{
        MultiSigTA newMultisigWalletContract = new MultiSigTA(msg.sender);
        multisigWalletInstances.push(newMultisigWalletContract);
        UserWallets[] storage newWallet = ownersWallets[msg.sender];
        newWallet.push(UserWallets(address(newMultisigWalletContract),id));

        emit walletCreated(msg.sender, address(newMultisigWalletContract), block.timestamp);
        id++;
    }

    function addNewWalletInstance(address owner, address walletAddress) public{
        UserWallets[] storage newWallet = ownersWallets[owner];
        newWallet.push(UserWallets(walletAddress,id));
    }
    function removeNewWalletInstance(address _owner, address _walletAddress) public{
        UserWallets[] storage newWallet = ownersWallets[_owner];
        bool hasBeenFound = false;
        uint walletIndex;
        for (uint i = 0; i < newWallet.length; i++) {
            if(newWallet[i].walletAdress == _walletAddress) {
                hasBeenFound = true;
                walletIndex = i;
                break;
            }
        }
        require(hasBeenFound == true, "wallet owner tidak terdetect");
        newWallet[walletIndex] = newWallet[newWallet.length - 1];
        newWallet.pop();
    }

    function getWalletID(address walletAddres) public view returns (uint) {
        
        uint walletId;
        UserWallets[] memory newWallet = ownersWallets[msg.sender];
        for (uint i = 0; i < newWallet.length; i ++) {
            if (newWallet[i].walletAdress == walletAddres){
                walletId = newWallet[i].walletID;
            }
        }  
        return walletId;
    }

    function getUserWallets() public view returns (UserWallets[] memory wals) {
        return ownersWallets[msg.sender];
    }

    function getOwnerWallets(address owner) public view returns(UserWallets[] memory){
        return ownersWallets[owner];
    }
    
}
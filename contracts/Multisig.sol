// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../node_modules/@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "./MultiSigFactory.sol";

contract MultiSigTA {
    // Menandai modul ECDSA
    using ECDSA for bytes32;

    address mainOwner;
    address multisigInstance;
    address[] walletOwners;
    uint limit;
    uint depositId = 0;
    uint withdrawalId = 0;
    uint transferId = 0;
    string[] tokenList;
    bool private locked;

    constructor(address _owner) {
        mainOwner = _owner;
        walletOwners.push(mainOwner);
        limit = walletOwners.length - 1;
        tokenList.push("ETH");
        locked = false;
    }

    mapping(address => mapping(string => uint)) balance;
    mapping(address => mapping(uint => bool)) approvals;
    mapping(address => bool) withdrawing;
    mapping(address => bool) public withdrawalInProcess;
    mapping(string => Token) tokenMapping;
    mapping(address => uint) public balancesToWithdraw;
    mapping(address => string) public tickerToWithdraw;

    struct Token {
        string ticker;
        address tokenAddress;
    }

    struct Transfer {
        string ticker;
        address sender;
        address payable receiver;
        uint amount;
        uint id;
        uint approvals;
        uint timeOfTransaction;
    }

    Transfer[] transferRequests;

    event walletOwnerAdded(address addedBy, address ownerAdded, uint timeOfTransaction);
    event walletOwnerRemoved(address removedBy, address ownerRemoved, uint timeOfTransaction);
    event fundsDeposited(string ticker, address sender, uint amount, uint depositId, uint timeOfTransaction);
    event fundsWithdrawed(string ticker, address sender, uint amount, uint withdrawalId, uint timeOfTransaction);
    event transferCreated(string ticker, address sender, address receiver, uint amount, uint id, uint approvals, uint timeOfTransaction);
    event transferCancelled(string ticker, address sender, address receiver, uint amount, uint id, uint approvals, uint timeOfTransaction);
    event transferApproved(string ticker, address sender, address receiver, uint amount, uint id, uint approvals, uint timeOfTransaction);
    event fundsTransfered(string ticker, address sender, address receiver, uint amount, uint id, uint approvals, uint timeOfTransaction);
    event tokenAdded(address addedBy, string ticker, address tokenAddress, uint timeOfTransaction);
    event SignatureCollected(uint id, address signer, uint timeOfTransaction);

    modifier onlyOwners() {
        bool isOwner = false;
        for (uint i = 0; i < walletOwners.length; i++) {
            if (walletOwners[i] == msg.sender) {
                isOwner = true;
                break;
            }
        }
        require(isOwner == true, "Hanya pemilik wallet yang bisa memanggil function ini");
        _;
    }

    modifier tokenExists(string memory ticker) {
        if (keccak256(bytes(ticker)) != keccak256(bytes("ETH"))) {
            require(tokenMapping[ticker].tokenAddress != address(0), "Token tidak tersedia");
        }
        _;
    }

    modifier mutexApplied() {
        require(!locked, "Reentrancy guard: locked");
        locked = true;
        _;
        locked = false;
    }

    modifier hasNotApproved(uint id) {
        require(!approvals[msg.sender][id], "Tanda tangan sudah dikumpulkan");
        _;
    }

    function addToken(string memory ticker, address _tokenAddress) public onlyOwners {
        for (uint i = 0; i < tokenList.length; i++) {
            require(keccak256(bytes(tokenList[i])) != keccak256(bytes(ticker)), "Tidak dapat menambahkan token duplikat");
        }
        require(keccak256(bytes(ERC20(_tokenAddress).symbol())) == keccak256(bytes(ticker)), "Token tidak tersedia pada ERC20");
        tokenMapping[ticker] = Token(ticker, _tokenAddress);
        tokenList.push(ticker);
        emit tokenAdded(msg.sender, ticker, _tokenAddress, block.timestamp);
    }

    function setMultisigContractAddress(address walletAddress) private {
        multisigInstance = walletAddress;
    }

    function callAddOwner(address owner, address multiSigContractInstance) private {
        MultiSigFactory factory = MultiSigFactory(multisigInstance);
        factory.addNewWalletInstance(owner, multiSigContractInstance);
    }

    function callRemoveOwner(address owner, address multiSigContractInstance) private {
        MultiSigFactory factory = MultiSigFactory(multisigInstance);
        factory.removeNewWalletInstance(owner, multiSigContractInstance);
    }

    function addWalletOwner(address owner, address walletAddress, address _address) public onlyOwners {
        for (uint i = 0; i < walletOwners.length; i++) {
            if (walletOwners[i] == owner) {
                revert("Tidak dapat menambahkan pemilik duplikat");
            }
        }
        require(limit<2,"Limit sudah mencapai batas");
        walletOwners.push(owner);
        limit = walletOwners.length - 1;
        emit walletOwnerAdded(msg.sender, owner, block.timestamp);
        setMultisigContractAddress(walletAddress);
        callAddOwner(owner, _address);
    }

    function removeWalletOwner(address owner, address walletAddress, address _address) public onlyOwners {
        bool hasBeenFound = false;
        uint ownerIndex;
        for (uint i = 0; i < walletOwners.length; i++) {
            if (walletOwners[i] == owner) {
                hasBeenFound = true;
                ownerIndex = i;
                break;
            }
        }
        require(hasBeenFound == true, "Pemilik wallet tidak terdeteksi");
        walletOwners[ownerIndex] = walletOwners[walletOwners.length - 1];
        walletOwners.pop();
        limit = walletOwners.length - 1;
        emit walletOwnerRemoved(msg.sender, owner, block.timestamp);
        setMultisigContractAddress(walletAddress);
        callRemoveOwner(owner, _address);
    }

    function deposit(string memory ticker, uint amount) public payable onlyOwners  {
        require(balance[msg.sender][ticker] >= 0, "Tidak dapat menyetor nilai 0");
        if (keccak256(bytes(ticker)) == keccak256(bytes("ETH"))) {
            balance[msg.sender]["ETH"] += msg.value;
        } else {
            require(tokenMapping[ticker].tokenAddress != address(0), "Token tidak tersedia");
            bool transferSuccess = IERC20(tokenMapping[ticker].tokenAddress).transferFrom(msg.sender, address(this), amount);
            require(transferSuccess, "Transfer ERC20 gagal");
            balance[msg.sender][ticker] += amount;
        }
        emit fundsDeposited(ticker, msg.sender, msg.value, depositId, block.timestamp);
        depositId++;
    }

    function withdraw(string memory ticker, uint _amount) public onlyOwners {
        require(_amount > 0, "Jumlah harus lebih dari 0");
        require(balance[msg.sender][ticker] >= _amount, "Saldo tidak mencukupi");
        if (keccak256(bytes(ticker)) != keccak256(bytes("ETH"))) {
            require(tokenMapping[ticker].tokenAddress != address(0), "Token tidak tersedia");
        }
        bool transferSuccess = false;
        if (keccak256(bytes(ticker)) == keccak256(bytes("ETH"))) {
            (transferSuccess,) = payable(msg.sender).call{value: _amount}("");
        } else {
            require(tokenMapping[ticker].tokenAddress != address(0), "Token tidak tersedia");
            transferSuccess = IERC20(tokenMapping[ticker].tokenAddress).transfer(msg.sender, _amount);
        }
        require(transferSuccess, "Transfer ERC20 gagal");
        balance[msg.sender][ticker] -= _amount;
        emit fundsWithdrawed(ticker, msg.sender, _amount, withdrawalId, block.timestamp);
        withdrawalId++;
    }

    function createTransferRequest(string memory ticker, address payable receiver, uint amount) public onlyOwners tokenExists(ticker) {
        require(balance[msg.sender][ticker] >= amount, "Saldo tidak mencukupi untuk membuat transfer");
        for (uint i = 0; i < walletOwners.length; i++) {
            require(walletOwners[i] != receiver, "Tidak dapat mentransfer dana ke wallet pribadi");
        }
        balance[msg.sender][ticker] -= amount;
        transferRequests.push(Transfer(ticker, msg.sender, receiver, amount, transferId, 0, block.timestamp));
        transferId++;
        emit transferCreated(ticker, msg.sender, receiver, amount, transferId, 0, block.timestamp);
    }

    function cancelTransferRequest(string memory ticker, uint id) public onlyOwners {
        bool hasBeenFound = false;
        uint transferIndex = 0;
        for (uint i = 0; i < transferRequests.length; i++) {
            if (transferRequests[i].id == id) {
                hasBeenFound = true;
                break;
            }
            transferIndex++;
        }

        require(transferRequests[transferIndex].sender == msg.sender, "Hanya pencipta transfer yang dapat membatalkan");
        require(hasBeenFound, "Permintaan transfer tidak tersedia");

        balance[msg.sender][ticker] += transferRequests[transferIndex].amount;
        transferRequests[transferIndex] = transferRequests[transferRequests.length - 1];
        emit transferCancelled(ticker, msg.sender, transferRequests[transferIndex].receiver, transferRequests[transferIndex].amount, transferRequests[transferIndex].id, transferRequests[transferIndex].approvals, transferRequests[transferIndex].timeOfTransaction);
        transferRequests.pop();
    }

    function approveTransferRequest(string memory ticker, uint id, bytes memory signature) public onlyOwners  {
        bool hasBeenFound = false;
        uint transferIndex = 0;
        for (uint i = 0; i < transferRequests.length; i++) {
            if (transferRequests[i].id == id) {
                hasBeenFound = true;
                break;
            }
            transferIndex++;
        }

        require(hasBeenFound, "Hanya pencipta transfer yang dapat membatalkan");
        require(approvals[msg.sender][id] == false, "Tidak dapat menyetujui transaksi transfer kedua kalinya");
        require(transferRequests[transferIndex].sender != msg.sender, "Tidak dapat menyetujui transaksi pribadi");

        // Verifikasi tanda tangan
        bytes32 messageHash = keccak256(abi.encodePacked(address(this), id));
        address signer = ECDSA.recover(messageHash, signature);

        require(signer != address(0), "Alamat yang ditandatangani tidak sesuai dengan kontrak multisig");


        approvals[msg.sender][id] = true;
        transferRequests[transferIndex].approvals++;

        emit transferApproved(ticker, msg.sender, transferRequests[transferIndex].receiver, transferRequests[transferIndex].amount, transferRequests[transferIndex].id, transferRequests[transferIndex].approvals, transferRequests[transferIndex].timeOfTransaction);
        if (transferRequests[transferIndex].approvals == limit) {
            transferFunds(ticker, transferIndex);
        }
    }

    function transferFunds(string memory ticker, uint id) private {
        bool transferSuccess = false;
        balance[transferRequests[id].receiver][ticker] += transferRequests[id].amount;
        if (keccak256(bytes(ticker)) == keccak256(bytes("ETH"))) {
            (transferSuccess,) = transferRequests[id].receiver.call{value: transferRequests[id].amount}("");
        } else {
            transferSuccess = IERC20(tokenMapping[ticker].tokenAddress).transfer(transferRequests[id].receiver, transferRequests[id].amount);
        }
        require(transferSuccess, "Transfer ERC20 gagal");
        emit fundsTransfered(ticker, msg.sender, transferRequests[id].receiver, transferRequests[id].amount, transferRequests[id].id, transferRequests[id].approvals, transferRequests[id].timeOfTransaction);
        transferRequests[id] = transferRequests[transferRequests.length - 1];
        transferRequests.pop();
    }

    function getApprovals(uint id) public onlyOwners view returns (bool) {
        return approvals[msg.sender][id];
    }

    function getTransferRequests() public onlyOwners view returns (Transfer[] memory) {
        return transferRequests;
    }

    function getBalance(string memory ticker) public view returns (uint) {
        return balance[msg.sender][ticker];
    }

    function getApprovalLimit() public onlyOwners view returns (uint) {
        return limit;
    }

    function getContractBalance() public view returns (uint) {
        return address(this).balance;
    }

    function getWalletOwners() public view onlyOwners returns (address[] memory) {
        return walletOwners;
    }

    function getTokenList() public view returns (string[] memory) {
        return tokenList;
    }
}
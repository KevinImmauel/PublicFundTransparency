

// Sources flattened with hardhat v2.23.0 https://hardhat.org

// SPDX-License-Identifier: MIT AND UNLICENSED

// File contracts/DonationTracker.sol

// Original license: SPDX_License_Identifier: MIT
pragma solidity ^0.8.28;

contract DonationTracker {
    address public owner;

    enum TxType { Donation, Withdrawal }

    struct Transaction {
        address user;
        uint256 amount;
        uint256 timestamp;
        string purpose;
        TxType txType;
    }

    Transaction[] public transactions;

    mapping(address => uint256) public donorTotal;
    uint256 public totalDonations;

    event DonationReceived(address indexed donor, uint256 amount, string purpose, uint256 timestamp);
    event FundsWithdrawn(address indexed spender, uint256 amount, string purpose, uint256 timestamp);

    constructor() {
        owner = msg.sender;
    }

    function donate(string calldata purpose) external payable {
        require(msg.value > 0, "Donation must be greater than 0");

        transactions.push(Transaction({
            user: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp,
            purpose: purpose,
            txType: TxType.Donation
        }));

        donorTotal[msg.sender] += msg.value;
        totalDonations += msg.value;

        emit DonationReceived(msg.sender, msg.value, purpose, block.timestamp);
    }

    function spend(string calldata purpose, uint256 amount) external {
        require(msg.sender == owner, "Only NGO/owner can spend");
        require(address(this).balance >= amount, "Insufficient balance");

        payable(msg.sender).transfer(amount);

        transactions.push(Transaction({
            user: msg.sender,
            amount: amount,
            timestamp: block.timestamp,
            purpose: purpose,
            txType: TxType.Withdrawal
        }));

        emit FundsWithdrawn(msg.sender, amount, purpose, block.timestamp);
    }

    function getTransactions() external view returns (Transaction[] memory) {
        return transactions;
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // ✅ For frontend/API use: get donation count and details
    function getDonationCount() external view returns (uint256) {
        return transactions.length;
    }

    function getTransaction(uint256 index) external view returns (
        address user,
        uint256 amount,
        uint256 timestamp,
        string memory purpose,
        TxType txType
    ) {
        Transaction memory txn = transactions[index];
        return (txn.user, txn.amount, txn.timestamp, txn.purpose, txn.txType);
    }
}


// File contracts/Lock.sol

// Original license: SPDX_License_Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Lock {
    uint public unlockTime;
    address payable public owner;

    event Withdrawal(uint amount, uint when);

    constructor(uint _unlockTime) payable {
        require(
            block.timestamp < _unlockTime,
            "Unlock time should be in the future"
        );

        unlockTime = _unlockTime;
        owner = payable(msg.sender);
    }

    function withdraw() public {
        // Uncomment this line, and the import of "hardhat/console.sol", to print a log in your terminal
        // console.log("Unlock time is %o and block timestamp is %o", unlockTime, block.timestamp);

        require(block.timestamp >= unlockTime, "You can't withdraw yet");
        require(msg.sender == owner, "You aren't the owner");

        emit Withdrawal(address(this).balance, block.timestamp);

        owner.transfer(address(this).balance);
    }
}

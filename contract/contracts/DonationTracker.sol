// SPDX-License-Identifier: MIT
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
        bool isFiat;
        string fiatTxnId;
    }

    Transaction[] public transactions;
    mapping(address => uint256) public donorTotal;
    uint256 public totalDonations;

    event DonationReceived(address indexed donor, uint256 amount, string purpose, uint256 timestamp, bool isFiat, string fiatTxnId);
    event FundsWithdrawn(address indexed spender, uint256 amount, string purpose, uint256 timestamp);

    constructor() {
        owner = msg.sender;
    }

    function donate(string calldata purpose, bool isFiat, string calldata fiatTxnId) external payable {
        require(msg.value > 0, "Donation must be greater than 0");

        transactions.push(Transaction({
            user: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp,
            purpose: purpose,
            txType: TxType.Donation,
            isFiat: isFiat,
            fiatTxnId: fiatTxnId
        }));

        donorTotal[msg.sender] += msg.value;
        totalDonations += msg.value;

        emit DonationReceived(msg.sender, msg.value, purpose, block.timestamp, isFiat, fiatTxnId);
    }

    function spend(string calldata purpose, uint256 amount) external {
        require(msg.sender == owner, "Only owner can spend");
        require(address(this).balance >= amount, "Insufficient balance");

        payable(msg.sender).transfer(amount);

        transactions.push(Transaction({
            user: msg.sender,
            amount: amount,
            timestamp: block.timestamp,
            purpose: purpose,
            txType: TxType.Withdrawal,
            isFiat: false,
            fiatTxnId: ""
        }));

        emit FundsWithdrawn(msg.sender, amount, purpose, block.timestamp);
    }

    function getTransactions() external view returns (Transaction[] memory) {
        return transactions;
    }

    function getTransaction(uint256 index) external view returns (
        address user,
        uint256 amount,
        uint256 timestamp,
        string memory purpose,
        TxType txType,
        bool isFiat,
        string memory fiatTxnId
    ) {
        Transaction memory txn = transactions[index];
        return (
            txn.user,
            txn.amount,
            txn.timestamp,
            txn.purpose,
            txn.txType,
            txn.isFiat,
            txn.fiatTxnId
        );
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getDonationCount() external view returns (uint256) {
        return transactions.length;
    }
}

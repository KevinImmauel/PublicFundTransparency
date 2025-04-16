const express = require("express");
const { ethers } = require("ethers");
require("dotenv").config();
const cors = require("cors");
const axios = require("axios");
const abi = require("./abi.json");

const app = express();
app.use(cors());
app.use(express.json());

const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const contractAddress = process.env.CONTRACT_ADDRESS;
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(contractAddress, abi, wallet);

app.get("/", (req, res) => {
  res.send("Donation Tracker API is running 🚀");
});

app.get("/balance", async (req, res) => {
  try {
    const balance = await contract.getContractBalance();
    const eth = ethers.formatEther(balance);
    const price = await getEthPrice();
    res.json({
      eth,
      usd: (eth * price.usd).toFixed(2),
      inr: (eth * price.inr).toFixed(2),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/transactions", async (req, res) => {
  try {
      const txns = await contract.getTransactions();
      const ethPrice = await getEthPrice();

      const formatted = txns.map((tx) => {
        const txType = Number(tx.txType);  // Convert from BigInt/BigNumber
    
        let txTypeString;
        if (txType === 0) {
            txTypeString = "Donation";
        } else if (txType === 1) {
            txTypeString = "Withdrawal";
        } else {
            txTypeString = "Unknown";
        }
    
        return {
            user: tx.user,
            amountETH: ethers.formatEther(tx.amount),
            amountUSD: (parseFloat(ethers.formatEther(tx.amount)) * ethPrice.usd).toFixed(2),
            timestamp: new Date(Number(tx.timestamp) * 1000),
            purpose: tx.purpose,
            type: txTypeString,
        };
    });
    

      res.json(formatted);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

app.get("/donor/:address", async (req, res) => {
  try {
    const address = req.params.address.toLowerCase();
    const txns = await contract.getTransactions();

    const filtered = txns
  .filter((tx) => tx.user.toLowerCase() === address && Number(tx.txType) === 0)
  .map((d) => ({
    amount: ethers.formatEther(d.amount),
    timestamp: new Date(Number(d.timestamp) * 1000),
    purpose: d.purpose
  }));


    res.json({ donor: address, totalDonations: filtered.length, donations: filtered });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/donate", async (req, res) => {
  try {
    const { amountEth, purpose } = req.body;
    const tx = await contract.donate(purpose, {
      value: ethers.parseEther(amountEth)
    });
    await tx.wait();
    res.json({ success: true, txHash: tx.hash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/withdraw", async (req, res) => {
  try {
    const { amountEth, purpose } = req.body;
    const tx = await contract.spend(purpose, ethers.parseEther(amountEth));
    await tx.wait();
    res.json({ success: true, txHash: tx.hash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const getEthPrice = async () => {
  const res = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd,inr");
  return res.data.ethereum;
};

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API running on http://localhost:${PORT}`);
});

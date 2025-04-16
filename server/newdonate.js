require("dotenv").config();
const { ethers } = require("ethers");
const abi = require("./abi.json");

const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet);

const donate = async () => {
  try {
    const purpose = "Support education";
    const tx = await contract.donate(purpose, {
      value: ethers.parseEther("0.02"),
    });

    console.log("Tx hash:", tx.hash);
    await tx.wait();
    console.log("✅ Donation successful!");
  } catch (err) {
    console.error("❌ Error donating:", err);
  }
}
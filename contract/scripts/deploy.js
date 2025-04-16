async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);
  
    const DonationTracker = await ethers.getContractFactory("DonationTracker");
    const contract = await DonationTracker.deploy();
  
    await contract.waitForDeployment();
    console.log("Contract deployed at:", await contract.getAddress());
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  
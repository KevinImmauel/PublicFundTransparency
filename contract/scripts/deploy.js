async function main() {
    const DonationTracker = await ethers.getContractFactory("DonationTracker");
    const donationTracker = await DonationTracker.deploy();
  
    await donationTracker.waitForDeployment(); // ✅ Correct in ethers v6
  
    console.log(`Contract deployed to: ${donationTracker.target}`);
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  
  
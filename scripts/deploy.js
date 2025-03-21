async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contract with the account:", deployer.address);

    const WrappedHyperCoin = await ethers.getContractFactory("WrappedHyperCoin");
    const whc = await WrappedHyperCoin.deploy(deployer.address); // Pass deployer address as initialOwner

    console.log("WrappedHyperCoin deployed to:", whc.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

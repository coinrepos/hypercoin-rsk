async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const Router = await ethers.getContractFactory("HyperSwapRouter");
  const router = await Router.deploy();

  await router.deployed(); // ✅ The classic way

  console.log("✅ Router deployed to:", router.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

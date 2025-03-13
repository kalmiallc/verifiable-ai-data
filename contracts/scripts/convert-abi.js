async function main() {

    const jsonAbi = require("../artifacts/contracts/VerifiableAnswer.sol/VerifiableAnswer.json").abi;
  
    const iface = new ethers.utils.Interface(jsonAbi);
    console.log(iface.format(ethers.utils.FormatTypes.full).slice(0));
  
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
    
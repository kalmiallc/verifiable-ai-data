
require('hardhat-abi-exporter');
require('hardhat-contract-sizer');
require('solidity-coverage');
require("@nomiclabs/hardhat-waffle");
require('@nomiclabs/hardhat-etherscan');

const { privateKeyTestnet, privateKeyMainnet, coston2RpcApi } = require('./secrets.json');

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: '0.8.26',
        settings: {
          evmVersion: `london`,
        }
      },
      {
        version: '0.5.1',
      },
    ],
  },
  // sourcify: {
  //   enabled: false,
  // },
  networks: {
    coston2: {
      url: `https://coston2-api.flare.network/ext/C/rpc?x-apikey=${coston2RpcApi}`,
      chainId: 114,
      accounts: [privateKeyTestnet], 
      gasPrice: 'auto',
      explorer: "https://coston2.testnet.flarescan.com/",
    },
  },
  etherscan: {
    apiKey: {
      coston2: "coston2", // apiKey is not required, just set a placeholder
    },
    customChains: [
      {
        network: "coston2",
        chainId: 114,
        urls: {
          apiURL: "https://api.routescan.io/v2/network/testnet/evm/114/etherscan",
          browserURL: "https://coston2.testnet.flarescan.com"
        }
      }
    ],
  },
  abiExporter: {
    path: "./data/abi",
    clear: true,
    flat: true,
  },
};

const MultiSigTA = artifacts.require("MultiSigTA");

module.exports = function (deployer, network, accounts) {
  // deployer.deploy(MultiSigTA, accounts[0]);
  deployer.deploy(MultiSigTA, accounts[0]);
};

const ThresholdSignature = artifacts.require('ThresholdSignature')
module.exports = function (deployer, network, accounts) {
    deployer.deploy(ThresholdSignature, accounts[0])
}

var EHR = artifacts.require('./EHR.sol');
var OrganChain = artifacts.require('./OrganChain.sol');

module.exports = function (deployer) {
  deployer.deploy(EHR);
};

module.exports = function (deployer) {
  deployer.deploy(OrganChain);
};

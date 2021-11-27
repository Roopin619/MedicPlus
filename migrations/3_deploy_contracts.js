var OrganChain = artifacts.require('./OrganChain.sol');

module.exports = function (deployer) {
  deployer.deploy(OrganChain);
};
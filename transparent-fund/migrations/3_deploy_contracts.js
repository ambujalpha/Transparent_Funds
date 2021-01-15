var Voter = artifacts.require('../contracts/Voter.sol');

module.exports = function(deployer) {
    deployer.deploy(Voter);
  };
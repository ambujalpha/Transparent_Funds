var Domain = artifacts.require('../contracts/Domain.sol');

module.exports = function(deployer) {
    deployer.deploy(Domain);
};
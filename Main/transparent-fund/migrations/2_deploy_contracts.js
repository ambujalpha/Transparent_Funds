var Biddings = artifacts.require('../contracts/Bidding.sol');



module.exports = function(deployer) {
  deployer.deploy(Biddings);
};

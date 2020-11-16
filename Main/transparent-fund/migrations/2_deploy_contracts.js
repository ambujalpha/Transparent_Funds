var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var Biddings = artifacts.require("./Bidding.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
};
module.exports = function(deployer) {
  deployer.deploy(Biddings);
};
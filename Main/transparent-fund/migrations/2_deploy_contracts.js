var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var Biddings = artifacts.require("./Bidding.sol");
var Voter = artifacts.require("./Voter.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
};
module.exports = function(deployer) {
  deployer.deploy(Biddings);
};
module.exports = function(deployer) {
  deployer.deploy(Voter);
};
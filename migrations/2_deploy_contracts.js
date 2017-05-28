var RealEstateRegistry = artifacts.require("./RealEstateRegistry.sol");

module.exports = function(deployer) {
  deployer.deploy(RealEstateRegistry);
};

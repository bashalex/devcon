var RealEstateRegistry = artifacts.require("./RealEstateRegistry.sol");

module.exports = function(deployer) {
  deployer.deploy(RealEstateRegistry, 'Apartment', 'Office', 'Studio',
  									  '0xaec3ae5d2be00bfc91597d7a1b2c43818d84396a', /* owner of the Apartment */
  									  '0xaec3ae5d2be00bfc91597d7a1b2c43818d84396a', /* owner of the Studio */
  									  '0xaec3ae5d2be00bfc91597d7a1b2c43818d84396a', /* owner of the Office */
  									  '0xf1f42f995046e67b79dd5ebafd224ce964740da3'  /* inspector */);
};

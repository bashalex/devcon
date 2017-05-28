var Registry = artifacts.require("./RealEstateRegistry.sol");

contract('RealEstateRegistry', function(accounts) {

    var seller = accounts[0];
    var escrow = accounts[1];
    var buyer = accounts[2];

    var status = {0: 'Owned', 1: 'Sale', 2: 'Wait Confirmation'};

    function printEstate(estate) {
        console.log(' - Real Estate with id ' + estate[0] + '\n\tname: ' + estate[1] + '\n\tprice: ' + web3.fromWei(estate[2], 'Ether') + 
            ' eth\n\tstatus: ' + status[estate[3]] + '\n\towner: ' + estate[4], '\n\tpotential owner: ' + estate[5]);
    }

    it("Should set on sale the 1 real estate", function(done) {
        var contract;

        Registry.deployed().then(function(instance) {
            contract = instance;
            return contract.getEstate.call(1);
        }).then(function(estate) {
            printEstate(estate);
            console.log('Sale 1 real estate');
            return contract.sell(1, web3.toWei(0.5, "Ether"), { from: seller });
        }).then(function(tx) {
            return contract.getEstate.call(1);
        }).then(function(estate) {
            printEstate(estate);
        }).then(done);
    });

    it("Should buy the 1 real estate", function(done) {
        var contract;

        Registry.deployed().then(function(instance) {
            contract = instance;
            console.log('Buy 1 real estate');
            return contract.buy(1, { from: buyer });
        }).then(function(tx) {
            return contract.getEstate.call(1);
        }).then(function(estate) {
            printEstate(estate);
        }).then(done);
    });

    it("Should confirm the purchase", function(done) {
        var contract;

        Registry.deployed().then(function(instance) {
            contract = instance;
            console.log('Confirm purchase of the 1 real estate');
            return contract.confirm(1, { from: escrow });
        }).then(function(tx) {
            return contract.getEstate.call(1);
        }).then(function(estate) {
            printEstate(estate);
        }).then(done);
    });

    it("Should add new real estate", function(done) {
        var contract;

        Registry.deployed().then(function(instance) {
            contract = instance;
            console.log('Add new real estate to the registry');
            return contract.addEstate('New Estate', web3.toWei(2, 'Ether'), { from: seller });
        }).then(function(tx) {
            return contract.getEstate.call(4);
        }).then(function(estate) {
            printEstate(estate);
        }).then(done);
    });
});
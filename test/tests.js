var Registry = artifacts.require("./RealEstateRegistry.sol");

contract('RealEstateRegistry', function(accounts) {

    var seller = accounts[0];
    var inspector = accounts[1];
    var buyer = accounts[2];

    var initialBuyerBalance = web3.fromWei(web3.eth.getBalance(buyer)).toNumber();
    var initialSellerBalance = web3.fromWei(web3.eth.getBalance(seller)).toNumber();
    var initialInspectorBalance = web3.fromWei(web3.eth.getBalance(inspector)).toNumber();

    var appartmentPrice = web3.toWei(15, "Ether");

    var status = {0: 'Owned', 1: 'On Sale', 2: 'Wait Confirmation'};

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
            console.log('Sale 1 appartment');
            return contract.sell(1, appartmentPrice, { from: seller });
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

    it("Should check that buyer spent required amount of money", function(done) {
        var balance = web3.fromWei(web3.eth.getBalance(buyer)).toNumber();
        assert.approximately(balance, initialBuyerBalance - web3.fromWei(appartmentPrice), 0.02, 'Buyer didn\'t spend any money on purchase');
        done();
    });

    it("Should confirm the purchase", function(done) {
        var contract;

        Registry.deployed().then(function(instance) {
            contract = instance;
            console.log('Confirm purchase of the 1 real estate');
            return contract.confirm(1, { from: inspector });
        }).then(function(tx) {
            return contract.getEstate.call(1);
        }).then(function(estate) {
            printEstate(estate);
        }).then(done);
    });

    it("Should check that seller received appropriate amount of money", function(done) {
        var balance = web3.fromWei(web3.eth.getBalance(seller)).toNumber();
        assert.approximately(balance, initialSellerBalance + web3.fromWei(appartmentPrice) * 0.95, 0.02, 'Seller didn\'t received appropriate amount of money');
        done();
    });

    it("Should check that inspector received appropriate amount of money", function(done) {
        var balance = web3.fromWei(web3.eth.getBalance(seller)).toNumber();
        assert.approximately(balance, initialInspectorBalance + web3.fromWei(appartmentPrice) * 0.05, 0.02 'Inspector didn\'t received appropriate amount of money');
        done();
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
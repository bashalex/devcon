var accounts;
var seller;
var escrow;
var contract;

var Registry = artifacts.require("./RealEstateRegistry.sol");

function updateBalance() {
    return tokenContract.balanceOf.call(investor).then(function(balance) {
        document.getElementById("balance").textContent = balance.toNumber();
    });
}

window.onload = function() {
    web3.eth.getAccounts(function(err, accs) {
        if (err !== null) {
            alert("There was an error fetching your accounts.");
            return;
        }

        if (accs.length === 0) {
            alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
            return;
        }

        accounts = accs;
        seller = accounts[0];
        escrow = accounts[1];
        console.log('seller:' + seller);
        console.log('escrow:' + escrow);

    })

    Registry.deployed().then(function(instance) {
        contract = instance;
        return updateBalance();
    });

    // document.getElementById("btn").onclick = function() {
    //     icoContract.buyTokens({ from: investor, value: web3.toWei(1, "Ether") }).then(function(tx) {
    //         console.log('tx: ', tx);
    //         return updateBalance();
    //     })
    // };
};

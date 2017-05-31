var accounts;
var bob, ronald, john;
var contract;

var guys = {'0xaec3ae5d2be00bfc91597d7a1b2c43818d84396a': 'Bob (Seller)',
            '0x04411d87358baa12435da46b34e8d65f142bb47b': 'John (Buyer)',
            '0xf1f42f995046e67b79dd5ebafd224ce964740da3': 'Ronald (Inspector)'}

var statuses = {0: 'Owned', 1: 'On Sale', 2: 'Wait Confirmation'};

var btns1 = [], btns2 = [], btns3 = [];

function onContractLoaded() {
    var confirm3 = document.getElementById("confirm3");

    // init all buttons
    btns1.push(document.getElementById("sell1"));
    btns1.push(document.getElementById("sell2"));
    btns1.push(document.getElementById("sell3"));

    btns2.push(document.getElementById("buy1"));
    btns2.push(document.getElementById("buy2"));
    btns2.push(document.getElementById("buy3"));

    btns3.push(document.getElementById("confirm1"));
    btns3.push(document.getElementById("confirm2"));
    btns3.push(document.getElementById("confirm3"));

    for (var i = 0; i < 3; ++i) {
        btns1[i].onclick = (function(e) {
            var idx = i + 1;
            return function(e) {
                if (e.target.innerHTML.includes('Sell')) {
                    console.log('Bob wants to sell ' + idx);
                    contract.sell(idx, web3.toWei(10, 'Ether'), { from: bob }).then(updateStatus);
                } else if (e.target.innerHTML.includes('Buy')) {
                    console.log('Bob wants to buy ' + idx);
                    contract.buy(idx, { from: bob, value: web3.toWei(10, 'Ether') }).then(updateStatus);
                }
            }
        })();
        btns2[i].onclick = (function(e) {
            var idx = i + 1;
            return function(e) {
                if (e.target.innerHTML.includes('Sell')) {
                    console.log('John wants to sell ' + idx);
                    contract.sell(idx, web3.toWei(10, 'Ether'), { from: john }).then(updateStatus);
                } else if (e.target.innerHTML.includes('Buy')) {
                    console.log('John wants to buy ' + idx);
                    contract.buy(idx, { from: john, value: web3.toWei(10, 'Ether') }).then(updateStatus);
                }
            }
        })();
        btns3[i].onclick = (function(e) {
            var idx = i + 1;
            return function(e) {
                if (e.target.innerHTML.includes('Sell')) {
                    console.log('Ronald wants to sell ' + idx);
                    contract.sell(idx, web3.toWei(10, 'Ether'), { from: ronald }).then(updateStatus);
                } else if (e.target.innerHTML.includes('Buy')) {
                    console.log('Ronald wants to buy ' + idx);
                    contract.buy(idx, { from: ronald, value: web3.toWei(10, 'Ether') }).then(updateStatus);
                } else if (e.target.innerHTML.includes('Confirm')) {
                    console.log('Ronald wants to confirm ' + idx);
                    contract.confirm(idx, { from: ronald }).then(updateStatus);
                }
            }
        })();
    }

    updateStatus();
}

function updateStatus() {
    for (var i = 1; i <= 3; ++i) {
        contract.getEstate.call(i).then(function(estate) {
            var idx = estate[0];
            document.getElementById("name" + idx).innerHTML = estate[1];
            document.getElementById("owner" + idx).innerHTML = guys[estate[4]];
            document.getElementById("price" + idx).innerHTML =  web3.fromWei(estate[2]) + ' ETH';
            document.getElementById("status" + idx).innerHTML = statuses[estate[3]];
            if (estate[3] == 0) {  // Owned
                console.log(0, estate[4]);
                switch (estate[4]) {
                    case '0xaec3ae5d2be00bfc91597d7a1b2c43818d84396a':
                        btns1[idx-1].style.display = 'inline';
                        btns2[idx-1].style.display = 'none';
                        btns3[idx-1].style.display = 'none';
                        btns1[idx-1].innerHTML = 'Sell ' + estate[1];
                        break;
                    case '0x04411d87358baa12435da46b34e8d65f142bb47b':
                        btns2[idx-1].style.display = 'inline';
                        btns1[idx-1].style.display = 'none';
                        btns3[idx-1].style.display = 'none';
                        btns2[idx-1].innerHTML = 'Sell ' + estate[1];
                        break;
                    case '0xf1f42f995046e67b79dd5ebafd224ce964740da3':
                        btns3[idx-1].style.display = 'inline';
                        btns2[idx-1].style.display = 'none';
                        btns1[idx-1].style.display = 'none';
                        btns3[idx-1].innerHTML = 'Sell ' + estate[1];
                        break;
                }
            } else if (estate[3] == 1) {  // On Sale
                switch (estate[4]) {
                    case '0xaec3ae5d2be00bfc91597d7a1b2c43818d84396a':
                        btns2[idx-1].innerHTML = 'Buy ' + estate[1];
                        btns3[idx-1].innerHTML = 'Buy ' + estate[1];
                        btns3[idx-1].style.display = 'inline';
                        btns2[idx-1].style.display = 'inline';
                        btns1[idx-1].style.display = 'none';
                        break;
                    case '0x04411d87358baa12435da46b34e8d65f142bb47b':
                        btns1[idx-1].innerHTML = 'Buy ' + estate[1];
                        btns3[idx-1].innerHTML = 'Buy ' + estate[1];
                        btns3[idx-1].style.display = 'inline';
                        btns2[idx-1].style.display = 'none';
                        btns1[idx-1].style.display = 'inline';
                        break;
                    case '0xf1f42f995046e67b79dd5ebafd224ce964740da3':
                        btns1[idx-1].innerHTML = 'Buy ' + estate[1];
                        btns2[idx-1].innerHTML = 'Buy ' + estate[1];
                        btns1[idx-1].style.display = 'inline';
                        btns2[idx-1].style.display = 'inline';
                        btns3[idx-1].style.display = 'none';
                        break;
                }
            } else if (estate[3] == 2) {  // Await Confirmation
                btns3[idx-1].style.display = 'inline';
                btns2[idx-1].style.display = 'none';
                btns1[idx-1].style.display = 'none';
                btns3[idx-1].innerHTML = 'Confirm the ' + estate[0] + ' Deal';
            }
        });
    }
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
        bob = accounts[0];
        ronald = accounts[1];
        john = accounts[2]
        console.log('Bob:' + bob);
        console.log('Ronald:' + ronald);
        console.log('John:' + john);

    })

    RealEstateRegistry.deployed().then(function(instance) {
        contract = instance;
    }).then(onContractLoaded);
};

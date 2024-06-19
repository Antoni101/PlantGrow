
var ferm = {
    "unlocked": false,
    "txt": "Fermenation Unlock",
    "cost": 5000,
    "rankReq" : 5,
    "scr": false,
    "barrels": 1
};

var barrels = [];
var fermenting;

function selectBarrel(i) {
    if (barrels[i].seed == null && user.seed.canFerm == true && user.seed.quantity >= barrels[i].storage) {
        barrels[i].value = 0;
        user.seed.quantity -= barrels[i].storage;
        barrels[i].seed = user.seed.name;
        barrels[i].max = user.seed.fermMax;
        barrels[i].sell = user.seed.fermVal;
        loadBarrels()
        updateBag()
    }
    else {
        console.log("Barrel Full")
    }
}

function collectBarrel(i) {
    if (barrels[i].value >= barrels[i].max) {
        var tempCollect = 0;
        user.money += barrels[i].sell;
        console.log("Collected $" + barrels[i].sell);
        barrels[i].seed = null;
        updateMoney();
        loadBarrels()
        updateBag()
    }
    else {
    }
}

function fermentInt() {
    for (i = 0; i < barrels.length; i++) {
        if (barrels[i].seed != null ) {
            if (barrels[i].value < barrels[i].max) {
                barrels[i].value += 1;
                //console.log("Barrel " + i + " " + barrels[i].value + "/" + barrels[i].max)
            }
            else {
                console.log("Barrel " + i + " ready for collect!")
            }
        }
    }
}

function loadBarrels() {
    var scr = document.getElementById("fermScr");

    scr.innerHTML = "";
    for (i = 0; i < barrels.length; i++) {
        if (barrels[i].seed == null) {
            var progressTxt = "<progress class='barrel_prog' value='" + barrels[i].value + "' + max='" + barrels[i].max + "' id='ferm_prog" + i + "'></progress>";
            scr.innerHTML += "<img src='images/add.png' class='barrel' onclick='selectBarrel(" + i + ")' id='barrel" + i + "'>";
        }
        else {
            scr.innerHTML += "<img src='images/" + barrels[i].seed + ".png' class='barrel' onclick='selectBarrel(" + i + ")' id='barrel" + i + "' onmouseover='collectBarrel(" + i + ")' >"// + progressTxt;
        }
    }
}

function upgradeFerm() {
    if (ferm.unlocked == true) {
        if (user.money >= ferm.cost) {
            user.money -= ferm.cost;
            ferm.cost = ferm.cost * 2;
            barrels.push({
                lvl: 1,
                storage: 10,
                value: 0,
                max: null,
                ready: false,
                seed: null,
                expGain: null,
                sell: null
            });
        }
    }
    else {
        if (user.money >= ferm.cost && user.rank >= ferm.rankReq) {
            fermenting = setInterval(fermentInt,1000)
            user.money -= ferm.cost;
            ferm.cost = ferm.cost * 2;
            ferm.txt = "+1 Barrel"
            ferm.unlocked == true;
            barrels.push({
                lvl: 1,
                storage: 10,
                ready: false,
                expGain: null,
                value: null,
                max: null,
                sell: null,
                seed: null
            });
        }
        loadBarrels()
    }
    updateMoney();
    loadUpgrades();
}

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
        barrels[i].sell = (user.seed.value * barrels[i].storage) * 30;
        loadBarrels()
        updateBag()
    }
    else {
        console.log("Not enough Seeds")
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
            barrels[i].value += 1;
            if (barrels[i].value < barrels[i].max) {
                var progress;
                progress = (barrels[i].value / barrels[i].max) * 100;
                document.getElementById("b_progress" + i).style.height = progress + "%";
                document.getElementById("b_progress" + i).style.width = "100%";
                document.getElementById("b_progress" + i).style.backgroundColor = "#bcbddc";
                document.getElementById("b_progress" + i).style.opacity = "0.7";
                //console.log("Barrel " + i + " " + barrels[i].value + "/" + barrels[i].max)
            }
            else {
                document.getElementById("b_progress" + i).style.height = "100%";
                document.getElementById("b_progress" + i).style.backgroundColor = "GreenYellow";
                document.getElementById("b_progress" + i).style.opacity = "1";
            }
        }
    }
}

function loadBarrels() {
    var scr = document.getElementById("fermScr");

    scr.innerHTML = "";
    var imgTxt;
    for (i = 0; i < barrels.length; i++) {
        if (barrels[i].seed == null) {
            imgTxt = "<p>Add 10 Seeds (Potatos, Carrots, Broccoli)</p>";
        }
        else {
            imgTxt = "<img class='seedBarrel' src='images/" + barrels[i].seed + ".png' onmouseover='collectBarrel(" + i + ")' id='barrel" + i + "'>";
        }
        scr.innerHTML += '<div onclick="selectBarrel(' + i + ')" class="barrel"><div class="progressBar" id="b_progress' + i + '">' + imgTxt + '</div></div>';
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
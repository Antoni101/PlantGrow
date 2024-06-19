var farmGrid; //2(4) 3(9) 4(16) 5(25) 6(36)
var farmLvl = 2;
var farmArray = [];
var seedGain = 5;
var growing;
var bag;
var farm_upgrade_cost = 25;
var farm_speed = 0.25;
var farm_speed_cost = 50;
var farmSize = 100;
var farmLeft = 45;
var hudbgcolor = "#a6bddb";
var hudborder = "3px solid #1c9099";
var upOpen = false;
var shopOpen = false;
var invOpen = false;
var fill_all_cost = 1000;
var fill_upgrade = false;

var user = {
    "money": 15.25,
    "rank": 1,
    "xp": 0,
    "max_xp": 50,
    "seed": null
};

function updateColors() {
    document.getElementById("shop").style.backgroundColor = hudbgcolor;
    document.getElementById("seedBag").style.backgroundColor = hudbgcolor;
    document.getElementById("upgrades").style.backgroundColor = hudbgcolor;

    document.getElementById("shop").style.border = hudborder;
    document.getElementById("seedBag").style.border = hudborder;
    document.getElementById("upgrades").style.border = hudborder;
}

function updateRank() {
    var bar = document.getElementById("rankBar");
    bar.style.display = "Block"
    bar.value = user.xp;
    bar.max = user.max_xp;
    var rankTxt = document.getElementById("rank");
    if (user.xp >= user.max_xp) { //Rank Up
        user.max_xp = user.max_xp * 3.5;
        user.xp = 0;
        user.rank += 1;
        bar.value = user.xp;
        bar.max = user.max_xp;
        loadShop()
    }
    rankTxt.innerHTML = "Rank " + user.rank;
}

function updateMoney() {
    var moneyTxt = document.getElementById("money");

    moneyTxt.innerHTML = "💰$" + user.money.toFixed(2);
}

function updateBag() {
    bag = document.getElementById("seedBag");
    bag.innerHTML = "";
    for (i = 0; i < seeds.length; i++) {

        if (seeds[i].quantity > 0) {
            bag.innerHTML += '<img  onclick="equipSeed(' + i + ')" class="seeds" id="seed' + i + '" src="images/' + seeds[i].name + '.png"><strong class="seedsTxt">' + seeds[i].quantity + '</strong>'
            if (seeds[i].equipped == true) {
                document.getElementById('seed' + i).style.opacity = "0.9";
                document.getElementById('seed' + i).style.transform = "scale(1.2)";
            }
            else {
                document.getElementById('seed' + i).style.opacity = "0.7";
                document.getElementById('seed' + i).style.transform = "scale(1.0)";
            } 
        } 

    }
}

function equipSeed(seed) {
    for (i = 0; i < seeds.length; i++) {
        seeds[i].equipped = false;  
        document.getElementById('seed' + seed).style.transform = "scale(1.0)";
    }
    seeds[seed].equipped = true;
    user.seed = seeds[seed];
    document.getElementById('seed' + seed).style.transform = "scale(1.2)";
    updateBag()
}

function buySeed(seed) {
    if (user.money >= seeds[seed].cost && user.rank >= seeds[seed].rankReq) {
        user.money -= seeds[seed].cost;
        var tempNum = (seeds[seed].cost / 4);
        seeds[seed].cost += parseInt(tempNum.toFixed(2))
        seeds[seed].quantity += seeds[seed].seedGain;
        document.getElementById("seedbagIcon").style.transform = "Scale(1.3)"
        setTimeout(function() {
            document.getElementById("seedbagIcon").style.transform = "Scale(1.0)"
        },50);

        loadShop()
        updateBag()
        updateMoney()
    }
    else {
        console.log("Too Poor");
    }
}
function loadUpgrades() {
    var upgrades = document.getElementById("upgrades");
    upgrades.innerHTML = "";
    upgrades.innerHTML += '<br><button onclick="upgradeFarm()">Upgrade Farm Size $' + farm_upgrade_cost + '</button>';
    upgrades.innerHTML += '<br><button onclick="upgradeSpeed()">Upgrade Farm Speed $' + farm_speed_cost + '</button>';

    if (fill_upgrade == false) {
        upgrades.innerHTML += '<br><button onclick="upgradeFill()">Fill All Button $' + fill_all_cost + '</button>';
    }
}

function upgradeFill() {
    if (user.money >= fill_all_cost) {
        fill_upgrade = true;
        user.money -= fill_all_cost;
        document.getElementById("fillBtn").style.display = "Block";
        loadUpgrades()
        updateMoney()
    }
}

function upgradeSpeed() {
    if (user.money >= farm_speed_cost) {
        if (window.confirm("Warning, Upgrading the Farm wipes all seeds from the farm, Proceed?")) {
            user.money -= farm_speed_cost;
            farm_speed += 0.5;
            farm_speed_cost = farm_speed_cost * 4.5;
            farm_speed_cost = farm_speed_cost.toFixed(2);

            loadFarm()
            updateMoney()
        }
    }
}

function upgradeFarm() {
    if (user.money >= farm_upgrade_cost) {
        if (window.confirm("Warning, Upgrading Farm wipes all seeds from the farm, Proceed?")) {
            user.money -= farm_upgrade_cost;
            farmLvl += 1;
            farm_upgrade_cost = farm_upgrade_cost * 4.5;
            farm_upgrade_cost = farm_upgrade_cost.toFixed(2);
            farmLeft -= 2;
            farmSize -= 2;

            loadFarm()
            updateMoney()
        }
    }

}

function loadShop() {
    var shop = document.getElementById("shop");
    var profit = 0;
    shop.innerHTML = "";
    for (i = 0; i < seeds.length; i++) {
        if (user.rank >= seeds[i].rankReq && user.money >= seeds[i].cost) {
            profit = seeds[i].value * seeds[i].seedGain;
            shop.innerHTML += '<br>';
            if (profit > seeds[i].cost) {
                profit -= seeds[i].cost
                console.log("Total Profit from " + seeds[i].name + " is: $" + profit)
                shop.innerHTML += '<button class="profitable" onclick="buySeed(' + i + ')">Buy (x' + seeds[i].seedGain + ') ' + seeds[i].name + ' $' + seeds[i].cost + '</button>';
            }
            else {
                profit -= seeds[i].cost
                console.log("Total Profit from " + seeds[i].name + " is: $" + profit + " [UNPROFITABLE]")
                shop.innerHTML += '<button class="unprofitable" onclick="buySeed(' + i + ')">Buy (x' + seeds[i].seedGain + ') ' + seeds[i].name + ' $' + seeds[i].cost + '</button>';
            }
        }
        else if (user.rank >= seeds[i].rankReq){
            shop.innerHTML += '<br>';
            shop.innerHTML += '<button class="cant_afford" onclick="buySeed(' + i + ')">Buy (x' + seeds[i].seedGain + ') ' + seeds[i].name + ' $' + seeds[i].cost + '</button>';
        }
    }
}

function loadFarm() { //LOAD GRID ---------------------------------------------------------------//

    clearInterval(growing);
    growing = setInterval(farmGrow, 250);

    document.getElementById("startBtn").style.display = "None";
    document.getElementById("money").style.display = "Block";
    document.getElementById("rank").style.display = "Block";
    document.getElementById("huds").style.display = "Block";

    var farm = document.getElementById("farm");
    farm.style.display = "Inline-Grid";
    farm.style.left = farmLeft + "%";
    farmGrid = farmLvl * farmLvl;

    farm.style.gridTemplateColumns = "";
    var gridAuto = ""
    for (let i = 0; i < farmLvl; i++) {
        gridAuto += "auto "
    }
    farm.style.gridTemplateColumns = gridAuto;

    farm.innerHTML = '';
    farmArray = [];
    for (let i = 0; i < farmGrid; i++) {
        farm.innerHTML += ' <div id="' + i + '"onmouseover="collectPlot(' + i + ')" onclick="selectPlot(' + i + ')" class="plot"><div class="progressBar" id="progress' + i + '"></div></div>'
        farmArray.push({
            type: null,
            value: null,
            growing: false,
            speed: null,
            max: null,
            icon: null,
            ready: false,
            expGain: null,
        });
        document.getElementById(i).style.height = farmSize + "px"; 
        document.getElementById(i).style.width = farmSize + "px";
    }

    farm.style.transform = "Scale(1.5)";
    setTimeout(function() {
        farm.style.transform = "Scale(1.0)";
    },150)

    loadShop()
    loadUpgrades()
    updateRank()
    updateMoney();
    updateColors()
}

function collectPlot(plotNum) {
    if (farmArray[plotNum].ready == true) {
        var collect;
        collect = Math.random() * ((farmArray[plotNum].value + 1) - (farmArray[plotNum].value - 1)) + (farmArray[plotNum].value - 1);
        user.money += collect
        user.xp += farmArray[plotNum].expGain;
        farmArray[plotNum].value = 0;
        farmArray[plotNum].ready = false;
        document.getElementById("progress" + plotNum).style.backgroundColor = "#deebf7";
        document.getElementById("progress" + plotNum).innerHTML = "";

        loadShop()
        updateRank()
        updateMoney()
    }
}

function updatePlot(plotNum) {
    farmArray[plotNum].type = user.seed.name;
    farmArray[plotNum].value = user.seed.value;
    farmArray[plotNum].growing = true;
    farmArray[plotNum].speed = user.seed.speed;
    farmArray[plotNum].max = user.seed.speed;
    farmArray[plotNum].expGain = user.seed.expGain;
    document.getElementById("progress" + plotNum).innerHTML = '<img class="seeds" src="images/' + farmArray[plotNum].type + '.png">';
    user.seed.quantity -= 1;
    updateBag()
}

function fillAll() {
    for (let i = 0; i < farmGrid; i++) {
        if (farmArray[i].growing == false && user.seed.quantity > 0) {
            updatePlot(i)
        }
    }
}

function selectPlot(plotNum) {
    for (i = 0; i < seeds.length; i++) {
        if (user.seed.quantity > 0 && farmArray[plotNum].growing == false) {
            updatePlot(plotNum)
        }
        else {
            //console.log(farmArray[plotNum].speed + " seconds left until harvest")
        }
    } 
}

function farmGrow() {
    for (i = 0; i < farmArray.length; i++) {
        if (farmArray[i].growing == true) {
            farmArray[i].speed -= farm_speed;
            if (farmArray[i].speed <= 0) {
                farmArray[i].growing = false;
                farmArray[i].ready = true;
                farmArray[i].speed = 0;
                document.getElementById("progress" + i).style.height = "100%";
                document.getElementById("progress" + i).style.backgroundColor = "GreenYellow";
                document.getElementById("progress" + i).style.opacity = "1";
            }
            else {
                var progress;
                progress = (farmArray[i].speed / farmArray[i].max) * 100;
                document.getElementById("progress" + i).style.height = progress + "%";
                document.getElementById("progress" + i).style.width = "100%";
                document.getElementById("progress" + i).style.backgroundColor = "#bcbddc";
                document.getElementById("progress" + i).style.opacity = "0.7";

            }
        }
    }
}


function openHud(hud) {
    if (hud == 1) {
        if (shopOpen == false) {
            shopOpen = true;
            document.getElementById("shop").style.display = "Block";
            document.getElementById("shop").style.transform = "Scale(1.1)";
            setTimeout(function() {
                document.getElementById("shop").style.transform = "Scale(1.0)";
            },50)
        }
        else {
            shopOpen = false;
            document.getElementById("shop").style.transform = "Scale(0.01)";
            setTimeout(function() {
                document.getElementById("shop").style.display = "None";
            },100);
        }
    }
    else if (hud == 2) {
        if (upOpen == false) {
            upOpen = true;
            document.getElementById("upgrades").style.display = "Block";
            document.getElementById("upgrades").style.transform = "Scale(1.1)";
            setTimeout(function() {
                document.getElementById("upgrades").style.transform = "Scale(1.0)";
            },50)
        }
        else {
            upOpen = false;
            document.getElementById("upgrades").style.transform = "Scale(0.01)";
            setTimeout(function() {
                document.getElementById("upgrades").style.display = "None";
            },100);
        }
    }
    else if (hud == 3) {
        if (invOpen == false) {
            invOpen = true;
            document.getElementById("seedBag").style.display = "Inline-Block";
            document.getElementById("seedBag").style.transform = "Scale(1.1)";
            setTimeout(function() {
                document.getElementById("seedBag").style.transform = "Scale(1.0)";
            },50);
        }
        else {
            invOpen = false;
            document.getElementById("seedBag").style.transform = "Scale(0.01)";
            setTimeout(function() {
                document.getElementById("seedBag").style.display = "None";
            },100);
        }
    }
}
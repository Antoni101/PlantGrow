var farmGrid; //2(4) 3(9) 4(16) 5(25) 6(36)
var farmLvl = 2;
var farmArray = [];
var seedGain = 5;
var growing;
var bag;
var firstSeed = true;
var farm_upgrade_cost = 50;

var user = {
    "money": 8.25,
    "rank": 1,
    "xp": 0,
    "max_xp": 20
};

var seeds = [
    potato,
    carrot,
    corn,
    strawberry
];

function updateRank() {
    var rankTxt = document.getElementById("rank");
    if (user.xp >= user.max_xp) { //Rank Up
        user.max_xp = user.max_xp * 2;
        user.xp = 0;
        user.rank += 1;
        loadShop()
    }
    rankTxt.innerHTML = "Rank " + user.rank;

    console.log("XP: " + user.xp + "/" + user.max_xp);
}

function updateMoney() {
    var moneyTxt = document.getElementById("money");

    moneyTxt.innerHTML = "💰$" + user.money;
}

function updateBag() {
    bag = document.getElementById("seedBag");
    bag.innerHTML = "";
    for (i = 0; i < seeds.length; i++) {
        bag.innerHTML += '<p class="seeds" id="seed' + i + '" onclick="equipSeed(' + i + ')">' + seeds[i].icon + "|" + seeds[i].quantity + '</p>';
        if (seeds[i].equipped == true) {
            document.getElementById('seed' + i).style.color = "Yellow";
        }
    }
}

function equipSeed(seed) {
    for (i = 0; i < seeds.length; i++) {
        seeds[i].equipped = false;  
        document.getElementById('seed' + i).style.color = "Black";
    }
    seeds[seed].equipped = true;
    document.getElementById('seed' + seed).style.color = "Yellow";
}

function buySeed(seed) {
    if (user.money >= seeds[seed].cost && user.rank >= seeds[seed].rankReq) {
        user.money -= seeds[seed].cost;
        seeds[seed].quantity += seedGain;
        console.log("Bought " + seeds[seed].name);

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
    upgrades.innerHTML += '<button onclick="upgradeFarm()">Upgrade Farm $' + farm_upgrade_cost + '</button>';
}

function upgradeFarm() {
    if (user.money >= farm_upgrade_cost) {
        if (window.confirm("Warning, Upgrading Farm wipes all seeds from the farm, Proceed?")) {
            user.money -= farm_upgrade_cost;
            farmLvl += 1;
            farm_upgrade_cost = farm_upgrade_cost * 5;

            loadFarm()
            updateMoney()
        }
    }

}

function loadShop() {
    var shop = document.getElementById("shop");
    shop.innerHTML = "";
    for (i = 0; i < seeds.length; i++) {
        if (user.rank >= seeds[i].rankReq) {
            shop.innerHTML += '<br>';
            shop.innerHTML += '<button onclick="buySeed(' + i + ')">' + seeds[i].name + ' x' + seedGain + ' - $' + seeds[i].cost + '</button>';
        }
    }
}

function loadFarm() {
    document.getElementById("startBtn").style.display = "None";
    document.getElementById("money").style.display = "Block";
    document.getElementById("rank").style.display = "Block";
    var farm = document.getElementById("farm");

    farm.style.display = "Inline-Grid";

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
        farm.innerHTML += ' <div id="' + i + '"onmouseover="collectPlot(' + i + ')" onclick="selectPlot(' + i + ')" class="plot"></div>'
        farmArray.push({
            type: null,
            value: null,
            growing: false,
            speed: null,
            icon: null,
            ready: false,
            expGain: null,
        });
    }

    farm.style.transform = "Scale(1.5)";
    setTimeout(function() {
        farm.style.transform = "Scale(1.0)";
    },150)

    loadShop()
    loadUpgrades()
    updateBag()
    updateRank()
    updateMoney();
}

function collectPlot(plotNum) {
    if (farmArray[plotNum].ready == true) {
        user.money += farmArray[plotNum].value;
        user.xp += farmArray[plotNum].expGain;
        farmArray[plotNum].value = 0;
        farmArray[plotNum].ready = false;
        console.log("Collected from Plot " + plotNum);
        document.getElementById(plotNum).style.backgroundColor = "PaleGreen";
        document.getElementById(plotNum).innerHTML = "";

        updateRank()
        updateMoney()
    }
}

function selectPlot(plotNum) {
    if (firstSeed == true) {
        firstSeed = false;
        growing = setInterval(farmGrow, 2000);
    }
    for (i = 0; i < seeds.length; i++) {
        if (seeds[i].equipped == true && seeds[i].quantity > 0 && farmArray[plotNum].growing == false) {
            farmArray[plotNum].type = seeds[i].name;
            farmArray[plotNum].value = seeds[i].value;
            farmArray[plotNum].growing = true;
            farmArray[plotNum].speed = seeds[i].speed;
            farmArray[plotNum].icon = seeds[i].icon;
            farmArray[plotNum].expGain = seeds[i].expGain;
            document.getElementById(plotNum).innerHTML = farmArray[plotNum].icon;

            seeds[i].quantity -= 1;
            updateBag()

            break;
        }
        else {
            console.log(farmArray[plotNum].speed + " seconds left until harvest")
        }
    } 
}

function farmGrow() {
    for (i = 0; i < farmArray.length; i++) {
        if (farmArray[i].growing == true) {
            farmArray[i].speed -= 2;
            if (farmArray[i].speed <= 0) {
                farmArray[i].growing = false;
                farmArray[i].ready = true;
                farmArray[i].speed = 0;
                document.getElementById(i).style.backgroundColor = "GreenYellow";
            }
        }
    }
}
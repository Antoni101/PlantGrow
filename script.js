var farmGrid; //2(4) 3(9) 4(16) 5(25) 6(36)
var farmLvl = 2;
var farmArray = [];
var seedGain = 5;
var growing;
var bag;
var farm_upgrade_cost = 50;
var farm_speed = 1;
var farm_speed_cost = 100;
var farmSize = 100;

var user = {
    "money": 10.25,
    "rank": 1,
    "xp": 0,
    "max_xp": 20
};

var seeds = [
    potato,
    carrot,
    corn,
    strawberry,
    pepper,
    tomato,
    eggplant,
    melon,
    avocado,
    pear
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

    moneyTxt.innerHTML = "💰$" + user.money.toFixed(2);
}

function updateBag() {
    bag = document.getElementById("seedBag");
    bag.innerHTML = "";
    for (i = 0; i < seeds.length; i++) {
        bag.innerHTML += '<p class="seeds" id="seed' + i + '" onclick="equipSeed(' + i + ')">' + seeds[i].icon + "<font size='5'> x" + seeds[i].quantity + '</font></p>';
        if (seeds[i].quantity > 0) {
            document.getElementById('seed' + i).style.display = "Inline-Block";
        }
        else {
            document.getElementById('seed' + i).style.display = "None";
        }

        if (seeds[i].equipped == true) {
            document.getElementById('seed' + i).style.color = "Gold";
            document.getElementById('seed' + i).style.opacity = "0.9";
            document.getElementById('seed' + i).style.transform = "scale(1.2)";
        }
        else {
            document.getElementById('seed' + i).style.color = "Black";
            document.getElementById('seed' + i).style.opacity = "0.7";
            document.getElementById('seed' + i).style.transform = "scale(1.0)";
        }
    }
}

function equipSeed(seed) {
    for (i = 0; i < seeds.length; i++) {
        seeds[i].equipped = false;  
        document.getElementById('seed' + i).style.color = "Black";
        document.getElementById('seed' + i).style.opacity = "0.7";
        document.getElementById('seed' + i).style.transform = "scale(1.0)";
    }
    seeds[seed].equipped = true;
    document.getElementById('seed' + seed).style.color = "Gold";
    document.getElementById('seed' + seed).style.opacity = "0.9";
    document.getElementById('seed' + seed).style.transform = "scale(1.2)"
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
    upgrades.innerHTML += '<br><button onclick="upgradeFarm()">Upgrade Farm Size $' + farm_upgrade_cost + '</button>';
    upgrades.innerHTML += '<br><button onclick="upgradeSpeed()">Upgrade Farm Speed $' + farm_speed_cost + '</button>';
}

function upgradeSpeed() {
    if (window.confirm("Warning, Upgrading the Farm wipes all seeds from the farm, Proceed?")) {
        user.money -= farm_speed_cost;
        farm_speed += 0.5;
        farm_speed_cost = farm_speed_cost * 5;

        loadFarm()
        updateMoney()
    }
}

function upgradeFarm() {
    if (user.money >= farm_upgrade_cost) {
        if (window.confirm("Warning, Upgrading Farm wipes all seeds from the farm, Proceed?")) {
            user.money -= farm_upgrade_cost;
            farmLvl += 1;
            farm_upgrade_cost = farm_upgrade_cost * 5;
            farmSize -= 5;

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
            shop.innerHTML += '<button onclick="buySeed(' + i + ')">Buy (x' + seedGain + ') ' + seeds[i].name + ' $' + seeds[i].cost + '</button>';
        }
    }
}

function loadFarm() { //LOAD GRID ---------------------------------------------------------------//

    clearInterval(growing);
    growing = setInterval(farmGrow, 1000);

    document.getElementById("startBtn").style.display = "None";
    document.getElementById("money").style.display = "Block";
    document.getElementById("rank").style.display = "Block";
    document.getElementById("seedBag").style.display = "Inline-Block";

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
    updateBag()
    updateRank()
    updateMoney();
}

function collectPlot(plotNum) {
    if (farmArray[plotNum].ready == true) {
        var collect;
        collect = Math.random() * ((farmArray[plotNum].value + 1) - (farmArray[plotNum].value - 1)) + (farmArray[plotNum].value - 1);
        user.money += collect
        console.log("Got " + collect)
        user.xp += farmArray[plotNum].expGain;
        farmArray[plotNum].value = 0;
        farmArray[plotNum].ready = false;
        document.getElementById("progress" + plotNum).style.backgroundColor = "PaleGoldenRod";
        document.getElementById("progress" + plotNum).innerHTML = "";

        updateRank()
        updateMoney()
    }
}

function selectPlot(plotNum) {
    for (i = 0; i < seeds.length; i++) {
        if (seeds[i].equipped == true && seeds[i].quantity > 0 && farmArray[plotNum].growing == false) {
            farmArray[plotNum].type = seeds[i].name;
            farmArray[plotNum].value = seeds[i].value;
            farmArray[plotNum].growing = true;
            farmArray[plotNum].speed = seeds[i].speed;
            farmArray[plotNum].max = seeds[i].speed;
            farmArray[plotNum].icon = seeds[i].icon;
            farmArray[plotNum].expGain = seeds[i].expGain;
            document.getElementById("progress" + plotNum).innerHTML = farmArray[plotNum].icon;

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
                console.log(farmArray[i].speed + "/" + farmArray[i].max)
                document.getElementById("progress" + i).style.height = progress + "%";
                document.getElementById("progress" + i).style.width = "100%";
                document.getElementById("progress" + i).style.backgroundColor = "MediumSpringGreen";
                document.getElementById("progress" + i).style.opacity = "0.7";

            }
        }
    }
}

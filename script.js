var farmGrid; //2(4) 3(9) 4(16) 5(25) 6(36)
var farmLvl = 2;
var defaultPlot = '{ "value": null, "type": null, "level": 1, "ready": false, "growing": false }'
var farmArray = []

var money = 5;
var rank = 1;

var seeds = {
    "potatos": 0,
    "corn": 0,
    "carrots": 0,
    "strawberries": 0,
    "melons": 0,
}

function loadFarm() {

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
        farm.innerHTML += ' <div id="' + i + '" onclick="selectPlot(' + i + ')" class="plot"></div>'
        farmArray.push(defaultPlot)
    }

    farm.style.transform = "Scale(1.5)";
    setTimeout(function() {
        farm.style.transform = "Scale(1.0)";
    },150)

}

function selectPlot(plotNum) {
    
}
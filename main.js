var gameLoop;

/**
* Initalizes gameLoop and creates an instance of CustomGameLoop.
*/
function setup(buildings) {
    gameLoop = new CustomGameLoop();
}

/**
* Sets the size of the canvas and the slider and calls the initalization methods.
*/
function setupGraph(buildings, timeScale, startDate) {

    var canvasWidth = window.innerWidth/1.7;
    var canvasHeight = window.innerHeight/1.5;

    var slider = document.getElementById("slider");
    var sliderWidth = (canvasWidth-60) + "px"
    slider.style.width = sliderWidth;
    slider.style.visibility = "visible";
    slider.value = "1";
    slider.max = "1000";
    slider.min = "1";

    gameLoop.initializeCanvas(document.getElementById("canvas"));
    gameLoop.setCanvasSize(canvasWidth, canvasHeight);
    gameLoop.initializeGraph(buildings, timeScale, startDate, slider);


}

/**
* Gets values from the HTML form to build the graph and calls setupGraph.
*/
function buildGraph(buildingID, timeScaleName, dateName) {
    var buildings = getChosenValuesFromList(buildingID);
    var timeScale = getChosenValuesFromRadio(timeScaleName);
    var startDate = getFormattedStartDate(dateName);
    setupGraph(buildings, timeScale, startDate);
}

/**
* Helper function that gets elements from HTML dropdown lists.
* @returns {list}
*/
function getChosenValuesFromList(divID) {
    var chosenItems = [];
    var itemDropDown = document.getElementById(divID);
    for (var i = 0; i < itemDropDown.options.length; i++) {
        if (itemDropDown.options[i].selected == true) {
            var itemName = itemDropDown.options[i].value;
            chosenItems.push(itemName);
        }
    }
    return chosenItems;
}

/**
* Helper function that changes the HTML date input format to the format expected by the data class.
* @returns {string}
*/
function getFormattedStartDate(name) {
    //given: 2015-11-04
    //want: 11/4/2015

    var unformattedDate = document.getElementsByName("date")[0].value;

    var year = unformattedDate.substring(0,4);
    var month = unformattedDate.substring(5,7);
    var day = unformattedDate.substring(8,10);
    if(day < 10) {
        //get rid of the zero
        day = day.substring(1);
    }
    if(month < 10) {
        //get rid of the zero
        month = month.substring(1);
    }

    var formattedDate = month + "/" + day + "/" + year;

    return formattedDate;
}

/**
* Helper function that gets values chosen from HTML radio buttons.
* @returns {list}
*/
function getChosenValuesFromRadio(divName) {
    var chosenItems = [];
    var itemDropDown = document.getElementsByName(divName);
    for (var i = 0; i < itemDropDown.length; i++) {
        if (itemDropDown[i].checked == true) {
            var itemName = itemDropDown[i].value;
            chosenItems.push(itemName);
        }
    }
    return chosenItems;
}

/**
* HTML helper function that selects all elements in the select box. Called through HTML.
*/
function selectAll(divID) {
    var list = document.getElementById(divID);
    for (var i = 0; i < list.options.length; i++) {
        list.options[i].selected = true;
    }
}

/**
* Initalizes the process to create the graph.
*/
function initialize() {
    setup();
}

window.onload = initialize;

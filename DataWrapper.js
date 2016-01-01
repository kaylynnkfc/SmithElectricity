/**
 * DataWrapper provides functions to get one particular data set
 * from all the data.
 * @constructor
 * @returns {DataWrapper}
 */
function DataWrapper() {

    /*
     * List of selected buildings.
     * @type {list}
     * @private
     */
    this.buildings = [];

    /*
     * @type {string}
     * @private
     */
    this.timeScale = null;

    /*
     * @type {string}
     * @private
     */
    this.startDate = null;

    /*
     * @type {number}
     * @private
     */
    this.sliderValue = null;
}

/**
 * Gets all of the data within a time frame for one building.
 * @returns {number} Total electricity usage.
 * @param {string} building
 * Building to get the usage of.
 * @param {string} timeScale
 * @param {string} startDate
 * @param {string} sliderValue
 */
DataWrapper.prototype.getBuildingTotal = function(building,
                       timeScale, startDate, sliderValue) {

    //keeping this here so I can add this as an option later
    var useSlider = true;

    var total = 0;
    var iterations = data.length;
    var startIndex = -1;

    //first, find first instance of the correct date:
    for(var i = 0; i < data.length; i++) {
        var timeStamp = data[i]["timestamp"];
        if (this.isDateAMatch(startDate, timeStamp)) {
            startIndex = i;
            break;
        }
    }

    if(startIndex == -1) {
        console.log("Couldn't find date");
        startIndex = 0;
    }

    //all: 6840 (1year) year: 720 (1month) month: 24 (1day) day: 1 (1hour)
    var amountToDisplay = 8640;

    if(timeScale == "year") {
        iterations = 8640;
        amountToDisplay = 720;
    }

    else if (timeScale == "month") {

        var days = 31;

        var indexOfFirstSlash = startDate.indexOf("/");
        var month = startDate.substring(0,indexOfFirstSlash);

        //sep, april, june, nov (30) //4, 5, 8, 11
        if (month == 4 ||
           month == 5 ||
           month == 8 ||
           month == 11) {
               days = 30;
           }

        //february (28) //2
        else if (month == 2) {
            days = 28;
        }

        iterations = days * 24;
        amountToDisplay = 24;
    }

    else if (timeScale == "day") {
        iterations = 24;
        amountToDisplay = 1;
    }

    var endIndex = startIndex + iterations;

    if(endIndex > data.length) {
        endIndex = data.length;
    }

    var sliderStartIndex = startIndex;
    var sliderEndIndex = endIndex;

    var percentageOfSlider = sliderValue/1000;
    var startOfIterations = iterations * percentageOfSlider;
    var sliderStartIndex = startIndex + startOfIterations;
    var sliderEndIndex = sliderStartIndex + amountToDisplay;

    if (sliderEndIndex > data.length) {
        endIndex = data.length;
    }

    sliderStartIndex = Math.round(sliderStartIndex);
    sliderEndIndex = Math.round(sliderEndIndex);


    if (useSlider) {
        for(var i = sliderStartIndex; i < sliderEndIndex; i++) {
            total = total + data[i][building];
        }
    }
    else {
        for(var i = startIndex; i < endIndex; i++) {
            total = total + data[i][building];
        }
    }

    return total;
}

//returns true or false if the date given matches the
//timestamp (just a date, not time, is fine)

/**
 * Helper function that returns true or false if the date given
 * matches the timestamp.
 * @returns {boolean}
 * @param {string} date
 * @param {string} testTime
 * Date to test against.
 */
DataWrapper.prototype.isDateAMatch = function(date, testTime) {
    var dateRegEx = new RegExp(date);
    return dateRegEx.test(testTime)
}

/**
 * Gets data for an array of buildings.
 * @returns {list} List with key/value pairs for building/electricity
 * usage.
 * @param {list} buildings
 * @param {string} timeScale
 * @param {string} startDate
 * @param {number} sliderValue
 */
DataWrapper.prototype.getBuildingsDataset = function(buildings,
                          timeScale, startDate, sliderValue) {

    this.buildings = buildings;
    this.timeScale = timeScale;
    this.startDate = startDate;
    this.sliderValue = sliderValue;

    var currentData = [];

    for (var i = 0; i < buildings.length; i++) {
        var electricityUsage = this.getBuildingTotal(buildings[i],
                             timeScale, startDate, sliderValue);
        currentData.push({name:buildings[i], data: electricityUsage});
    }

    return currentData;
}


/**
 * DataArrayWrapper provides functions to use one particular dataset.
 * @constructor
 * @returns {DataArrayWrapper}
 */
function DataArrayWrapper(dataArray) {
    this.dataArray = dataArray;
}

/**
 * Updates the stored data to the new given array.
 * @returns {undefined}
 * @param {array} dataArray
 * New data
 */
DataArrayWrapper.prototype.updateData = function(dataArray) {
    this.dataArray = dataArray;
}

/**
 * Helper function to print the data in a readable form.
 * @returns {undefined}
 */
DataArrayWrapper.prototype.printArray = function() {
    for (var i = 0; i < this.dataArray.length; i++) {
        console.log("Place:" , this.dataArray[i].name,
                    "Data:" , this.dataArray[i].data);
    }
}

/**
 * Returns current stored data at the index specified.
 * @returns {number}
 * @param {number} index
 */
DataArrayWrapper.prototype.getData = function(index) {
    return this.dataArray[index].data;
}

/**
 * Gets name of the building at specified index.
 * @returns {string}
 * @param {number} index
 */
DataArrayWrapper.prototype.getName = function(index) {
    return this.dataArray[index].name;
}

/**
 * Returns length of data array.
 * @returns {number} length
 */
DataArrayWrapper.prototype.getLength = function() {
    return this.dataArray.length;
}

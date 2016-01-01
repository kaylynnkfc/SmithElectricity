/**
 * Manages all the elements that make up the graph.
 * This includes the data variables, size variables,
 * and all the visible elements.
 * @constructor
 * @returns {GraphManager}
 */
function GraphManager(buildingsArray, graphX,
                       graphY, graphHeight, graphWidth,
                       timeScale, startDate, sliderID) {

    /*
     * List of selected buildings.
     * @type {list}
     * @private
     */
    this.buildingsArray = buildingsArray;

    /*
     * @type {number}
     * @private
     */
    this.graphX = graphX;

    /*
     * @type {number}
     * @private
     */
    this.graphY = graphY;

    /*
     * @type {number}
     * @private
     */
    this.graphHeight = graphHeight;

    /*
     * @type {number}
     * @private
     */
    this.graphWidth = graphWidth;

    /*
     * @type {string}
     * @private
     */
    this.timeScale = timeScale;

    /*
     * @type {string}
     * @private
     */
    this.startDate = startDate;

    /*
     * @type {HTML Div ID}
     * @private
     */
    this.sliderID = sliderID;

    /*
     * Tracks all of the bar elements.
     * @type {list}
     * @private
     */
    this.allBarElements = [];

    /*
     * Tracks all graph elements, including the bar elements,
     * the slider, and the scale.
     * @type {list}
     * @private
     */
    this.allGraphElements = [];


    /*
     * @type {DataWrapper}
     * @private
     */
    this.dataWrapper =
        new DataWrapper();

    /*
     * An array of the actual data for the graph.
     * @type {DataArrayWrapper}
     * @private
     */
    this.dataArray =
        new DataArrayWrapper(this.dataWrapper.
                             getBuildingsDataset(this.buildingsArray,
                             this.timeScale, this.startDate,
                             this.sliderID.value));

    /*
     * The x/y scale for the graph.
     * @type {ScaleElement}
     * @private
     */
    this.scaleElement =
        new ScaleElement(graphX, graphY, graphWidth,
                         graphHeight, this.getMax(this.dataArray));


    this.allGraphElements.push(this.scaleElement);

    _this = this;

    /*
     * @type {number}
     * @private
     */
    this.maxValue = this.getMax(this.dataArray) +
                    ((1/2) * this.getMax(this.dataArray));

    this.createBars();

    this.sliderValue = this.sliderID.value;
}

/**
 * Draws all elements in allGraphElements and checks if slider has moved.
 * If it has, calls updateData.
 * @returns {undefined}
 * @param {HTMLCanvasG} G
 * HTML canvas
 */
GraphManager.prototype.draw = function(g) {
    for (var i = this.allGraphElements.length-1; i >=0; i--) {
        this.allGraphElements[i].draw(g);
    }

    if (this.sliderValue != this.sliderID.value) {
        this.updateData(this.sliderID.value);
    }

    this.sliderValue = this.sliderID.value;

}

/**
 * Updates the data based on the new slider position.
 * @returns {undefined}
 * @param {number} currentValue
 * Current slider value
 */
GraphManager.prototype.updateData = function(currentValue) {

    this.dataArray.updateData(this.dataWrapper.getBuildingsDataset
                          (this.buildingsArray,
                          this.timeScale, this.startDate, currentValue));

    for (var i = 0; i < this.allBarElements.length; i++) {

        var newBarData = this.createBarValues(this.dataArray,
              this.graphHeight, this.graphY, this.maxValue, i);

        var height = newBarData[0];
        var y = newBarData[1];
        var data = newBarData[2];

        this.allBarElements[i].setHeight(height);
        this.allBarElements[i].setY(y);
        this.allBarElements[i].setValue(data);
    }
}

/**
 * Creates mouseover effect when the bars change colors
 * by looping over active pointers and calling the appropirate
 * bar's mouseEnter method.
 * @returns {undefined}
 * @param {AssociativeArray} pointers
 * List of active pointers.
 */
GraphManager.prototype.onPointerMove = function(pointers) {

    for (var i = 0; i < this.allBarElements.length; i++) {
        this.allBarElements[i].mouseOut();
    }

    for (var pointer in pointers) {
        if (this.getBarElementUnderMouse(pointers[pointer].position) != -1) {
            this.getBarElementUnderMouse(pointers[pointer].position).mouseEnter();
        }
    }
}

/**
 * Creates bar objects and adds them to lists.
 * @returns {undefined}
 */
GraphManager.prototype.createBars = function () {

    var numElements = this.dataArray.getLength();
    var maxValue = this.getMax(this.dataArray);

    var elementsConsideredForBarCalculation = numElements;
    if(numElements < 3) {
        elementsConsideredForBarCalculation = 3;
    }

    var barTotalWidth = this.graphWidth / elementsConsideredForBarCalculation;
    var barVisibleWidth = barTotalWidth - ((1 / 8) * barTotalWidth);
    var graphCurrentX = this.graphX;

    var colors = this.createColorArray();

    for (var i = 0; i < numElements; i++) {
        var width = barVisibleWidth;

        var graphData =
            this.createBarValues(this.dataArray,
                                 this.graphHeight, this.graphY,
                                 this.maxValue, i);
        var height = graphData[0];
        var y = graphData[1];
        var data = graphData[2];

        var x = graphCurrentX;
        var name = this.getNameForBar(this.dataArray.getName(i));
        var color = this.getColor(colors);

        var newElement =
            new BarElement(x, y, width, height, name,
                           color, data);
        this.allBarElements.push(newElement);
        this.allGraphElements.push(newElement);

        graphCurrentX += barTotalWidth;
    }
}

/**
 * Helper method that generates the bar height, y, and data.
 * @returns {array}
 * @param {dataArray} data
 * Array of the data.
 * @param {number} graphHeight
 * Height of the entire graph.
 * @param {number} graphY
 * Y position of the graph.
 * @param {number} maxValue
 * Largest data value from the set.
 * @param {number} i
 * Index of the current bar.
 */
GraphManager.prototype.createBarValues = function(data,
                   graphHeight, graphY, maxValue, i) {

    var height = (data.getData(i) * graphHeight) / maxValue;
    var y = (graphHeight + graphY) - height;
    var data = data.getData(i);

    return [height, y, data];
}

/**
 * Random color for the bar.
 * @returns {color} Color code
 * @param {string} color
 * Code for a color
 */
GraphManager.prototype.getColor = function(colors) {

    var i = Math.floor((Math.random() * colors.length));
    var color = colors[i];

    return color;
}

/**
 * Creates a color an array for use in getColor.
 * @returns {array} Colors
 */
GraphManager.prototype.createColorArray = function() {
    return colors = ["#f51818", "#f57818", "#f5e318", "#5ef518",
                     "#18f5b6", "#0c67cf", "#7027d7"
                    ,"#fba1fb", "#60e0b3", "#dd64b8","#f890d5",
                     "#c1ac42", "#f3248f"];
}

/**
 * Formats the name correctly.
 * @returns {string} Formatted name
 * @param {string} name
 * Name from HTML list.
 */
GraphManager.prototype.getNameForBar = function (name) {
    var splitIndex = name.indexOf("_");

    if (splitIndex != -1 && name != "campus_center") {
        name = name.slice(0, splitIndex);
        name = name.charAt(0).toUpperCase() + name.slice(1);
        name = name + " House";
    }
    if (name == "campus_center") {
        name = "Campus Center";
    }
    if (name == "ford")  {
        name = "Ford";
    }

    return name;
}

/**
 * Helper function that gets max value of the data.
 * @returns {number} Max Value
 * @param {array} array
 * Data array.
 */
GraphManager.prototype.getMax = function(array) {
    var maxValue = 0;

    for(var i = 0; i<array.getLength(); i++){
        var value = array.getData(i);
        if(value>maxValue) {
            maxValue = value;
        }
    }
    return maxValue;
}

/**
 * Helper function gets all graph elements.
 * @returns {list} allGraphElements
 */
GraphManager.prototype.getAllElements = function() {
    return this.allGraphElements;
}

/**
 * Helper function gets all bar elements.
 * @returns {list} allBarElements
 */
GraphManager.prototype.getBarElementsArray = function () {
    return this.allBarElements;
}

/**
 * Hit testing function that, given a point, returns the bar
 * under that point, if one exists.
 * @returns {bar} Bar or -1.
 * @param {position} position
 * Position of pointer.
 */
GraphManager.prototype.getBarElementUnderMouse = function(position) {
    var pointerX = position.getX();
    var pointerY = position.getY();

    for (var i = 0; i < this.allBarElements.length; i++) {
        var barX = this.allBarElements[i].getX();
        var barY = this.allBarElements[i].getY();
        var barWidth = this.allBarElements[i].getWidth();
        var barHeight = this.allBarElements[i].getHeight();

        if((pointerX > barX && pointerX < barX + barWidth) &&
          (pointerY > barY && pointerY < barY + barHeight)) {
                return this.allBarElements[i];
          }
    }
    return -1;
}

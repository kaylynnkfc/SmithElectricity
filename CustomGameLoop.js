/**
 * Extends GameLoop and adds functionality.
 * @constructor
 * @returns {CustomGameLoop}
 */
function CustomGameLoop() {
    /*
     * List of selected buildings.
     * @type {list}
     * @private
     */
    this.buildings;
}

CustomGameLoop.prototype = new GameLoop();

/**
 * Initalizes canvas
 * @returns {undefined}
 * @param {HTMLCanvas} canvas
 * HTML canvas element
 */
CustomGameLoop.prototype.initializeCanvas = function(canvas) {
    GameLoop.prototype.initialize.call(this, canvas);

    /*
     * @type {canvas}
     * @private
     */
    this.canvas = canvas;

    var _this = this;
    window.addEventListener('resize',
                           function() {
                               _this.onWindowResize();
                            }, false);
}

/**
 * Resizes graph on window resize event
 * @returns {undefined}
 */
CustomGameLoop.prototype.onWindowResize = function () {
    var newWidth = window.innerWidth/1.7;
    var newHeight = window.innerHeight/1.5;
    this.setCanvasSize(newWidth, newHeight);

    //reset values that were calculated by the width/height
    this.initializeGraph(this.buildings, this.timeScale,
                         this.startDate, this.sliderID);

    var slider = document.getElementById("slider");
    var sliderWidth = (newWidth-60) + "px"
    slider.style.width = sliderWidth;
}

/**
 * Initializes graph by creating a graphManager element and a
 * pointerManager element as well as calculating sizing for the graph.
 * @returns {undefined}
 */
CustomGameLoop.prototype.initializeGraph =
    function(buildings, timeScale, startDate, sliderID) {

    this.buildings = buildings;

    /*
     * Tracks selected time scale (year, month, etc)
     * @type {string}
     * @private
     */
    this.timeScale = timeScale;

    /*
     * Tracks chosen start date.
     * @type {string}
     * @private
     */
    this.startDate = startDate;

    /*
     * Tracks HTML slider div ID.
     * @type {divID}
     * @private
     */
    this.sliderID = sliderID;

    var graphWidth = this.canvas.width - ((1 / 4 * this.canvas.width));
    var graphHeight = this.canvas.height - ((1/4 * this.canvas.height));
    var graphX = ((1 / 2) * (this.canvas.width - graphWidth));
    var graphY = ((1 / 4) * (this.canvas.height - graphHeight));

    /*
     * Instance of Graph Manager.
     * @type {graphManager}
     * @private
     */
    this.graphManager =
        new GraphManager(this.buildings,
                         graphX, graphY, graphHeight,
                         graphWidth, this.timeScale,
                         this.startDate, this.sliderID);

    /*
     * Instance of Pointer Manager
     * @type {pointerManager}
     * @private
     */
    this.pointerManager = new PointerManager(this.graphManager);
}

/**
 * Sets the canvas size
 * @param {number} width
 * New canvas width
 * @param {number} height
 * New canvas height
 * @returns {undefined}
 */
CustomGameLoop.prototype.setCanvasSize = function(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
}

/**
 * Gets the width of the canvas.
 * @returns {number} width
 */
CustomGameLoop.prototype.getCanvasWidth = function() {
    return this.canvas.width;
}

/**
 * Gets the height of the canvas.
 * @returns {number} height
 */
CustomGameLoop.prototype.getCanvasHeight = function() {
    return this.canvas.height;
}

/**
 * Draw method propegates the canvas g down to the graphManager's draw call.
 * @returns {undefined}
 */
CustomGameLoop.prototype.draw = function(g) {
    this.graphManager.draw(g);
}

/**
 * Calls pointerManager's onPointerEnter function
 * @returns {undefined}
 */
CustomGameLoop.prototype.onPointerEnter = function(id, position) {
    this.pointerManager.onPointerEnter(id, position);
}

/**
 * Calls pointerManager's onPointerMove function
 * @returns {undefined}
 */
CustomGameLoop.prototype.onPointerMove = function(id, position) {
    this.pointerManager.onPointerMove(id, position);
}

/**
 * Calls pointerManager's onPointerActivate function
 * @returns {undefined}
 */
CustomGameLoop.prototype.onPointerActivate = function(id, position) {
    this.pointerManager.onPointerActivate(id, position);
}

/**
 * Calls pointerManager's onPointerDeactivate function
 * @returns {undefined}
 */
CustomGameLoop.prototype.onPointerDeactivate = function(id, position) {
    this.pointerManager.onPointerDeactivate(id, position);
}

/**
 * Calls pointerManager's onPointerLeave function
 * @returns {undefined}
 */
CustomGameLoop.prototype.onPointerLeave = function(id, position) {
    this.pointerManager.onPointerLeave(id, position);
}

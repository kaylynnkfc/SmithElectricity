/**
* Visual class to wrap all elements.
* @constructor
* @returns {visual}
*/
function Visual() {

    /*
     * @type {number}
     * @private
     */
    this.width;

    /*
     * @type {number}
     * @private
     */
    this.height;

    /*
     * @type {number}
     * @private
     */
    this.x;

    /*
     * @type {number}
     * @private
     */
    this.y;
}

/**
 * Sets the height of the object.
 * @param {number} height
 * New height
 * @returns {undefined}
 */
Visual.prototype.setHeight = function(h) {
    this.height = h;
}

/**
 * Sets the y value of the object.
 * @param {number} y
 * New y
 * @returns {undefined}
 */
Visual.prototype.setY = function(y) {
    this.y = y;
}

/**
 * Gets the x value of the object.
 * @returns {number} x value
 */
Visual.prototype.getX = function() {
    return this.x;
}

/**
 * Gets the y value of the object.
 * @returns {number} y value
 */
Visual.prototype.getY = function() {
    return this.y;
}

/**
 * Gets the width of the object.
 * @returns {number} width
 */
Visual.prototype.getWidth = function() {
    return this.width;
}

/**
 * Gets the height of the object.
 * @returns {number} height
 */
Visual.prototype.getHeight = function() {
    return this.height;
}

/**
 * Gets overridden in other classes.
 * @param {HTMLCanavsG} g
 * @returns {undefined}
 */
Visual.prototype.draw = function(g) {}


/**
* Encapsulates all data and the draw method for the bar.
* @extends Visual
* @constructor
* @returns {BarElement}
*/
function BarElement(x, y, width, height, name, color, value) {

    /*
     * @type {number}
     * @private
     */
    this.x = x;

    /*
     * @type {number}
     * @private
     */
    this.y = y;

    /*
     * @type {number}
     * @private
     */
    this.width = width;

    /*
     * @type {number}
     * @private
     */
    this.height = height;

    /*
     * @type {string}
     * @private
     */
    this.name = name;

    /*
     * @type {string}
     * @private
     */
    this.color = color;

    /*
     * @type {number}
     * @private
     */
    this.value = value;

    /*
     * @type {boolean}
     * @private
     */
    this.mouseOver = false;
}

BarElement.prototype = new Visual();

/**
 * Draws the rectangle and label for the bar.
 * @param {g} CanvasG
 * HTMLCanvas G
 * @returns {undefined}
 */
BarElement.prototype.draw = function (g) {

    if(this.mouseOver == true) {
        g.fillStyle = "#b2dbd5";
    }
    else {
        g.fillStyle = this.color;
    }

    g.fillRect(this.x, this.y, this.width, this.height);

    var labelX = this.x + ((1 / 4) * this.width);
    var labelY = this.y + this.height + 10;

    g.fillStyle = "black";

    //Got how to rotate labels from here:
    //http://stackoverflow.com/questions/3167928/drawing-rotated-text-on-a-html5-canvas
    g.save();
    g.translate(labelX, labelY);
    g.rotate(Math.PI / 3);
    g.textAlign = "left";
    g.fillText(this.name, 0, 0);
    g.restore();

    if(this.mouseOver == true) {
        g.fillStyle = "black";
        var value = Math.floor(this.value) + " kWh";
        g.fillText(value, this.x+2, this.y - 5);
    }
}

/**
 * Sets value of the bar.
 * @param {number} newValue
 * New value of the bar.
 * @returns {undefined}
 */
BarElement.prototype.setValue = function(newValue) {
    this.value = newValue;
}

/**
 * Called on mouseover, changes this.mouseOver to true.
 * @returns {undefined}
 */
BarElement.prototype.mouseEnter = function() {
    this.mouseOver = true;
}

/**
 * Called on mouseout, changes this.mouseOver to false.
 * @returns {undefined}
 */
BarElement.prototype.mouseOut = function () {
    this.mouseOver = false;
}

/**
* Wraps the ScaleElement and contains draw method.
* @extends Visual
* @constructor
* @returns {ScaleElement}
*/
function ScaleElement (x, y, width, height, max) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.max = Math.floor(max);
}

ScaleElement.prototype = new Visual();

/**
 * Draws the scale on the x and y axis of the graph.
 * @param {g} CanvasG
 * HTMLCanvas G
 * @returns {undefined}
 */
ScaleElement.prototype.draw = function(g) {
    g.fillStyle = "black";
    var maxWithUnits = this.max + " kWh"
    g.fillText(maxWithUnits, this.x-((2/3)*this.x) - 8, this.y);

    var middleValueWithUnits = Math.floor(this.max/2) + " kWh"
    g.fillText(middleValueWithUnits, this.x-((2/3)*this.x) - 8,
               (this.y+(1/2)*this.height));

    g.beginPath();
    g.moveTo(this.x,this.y);
    g.lineTo(this.x,this.y+this.height);
    g.lineTo(this.x+this.width,this.y+this.height);
    g.stroke();
}


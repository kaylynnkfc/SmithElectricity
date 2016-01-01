
function PointerManager(graphManager) {
    this.pointers = {};
    this.graphManager = graphManager;
}

PointerManager.prototype.onPointerEnter = function(id, position) {
    this.addPointer(id, position);
}

PointerManager.prototype.onPointerMove = function(id, position) {
    this.movePointer(id, position);
    this.graphManager.onPointerMove(this.pointers);
}

PointerManager.prototype.onPointerActivate = function(id, position) {
    this.pointers[id].activate();
}

PointerManager.prototype.onPointerDeactivate = function(id, position) {
    this.pointers[id].deactivate();
}

PointerManager.prototype.onPointerLeave = function(id, position) {
    this.removePointer(id, position);
}

PointerManager.prototype.hasPointer = function(id) {
    return typeof this.pointers[id] != 'undefined';
}

PointerManager.prototype.addPointer = function(id, initialPosition) {
    this.pointers[id] = new Pointer(id, initialPosition);
}

PointerManager.prototype.movePointer = function(id, position) {
    this.pointers[id].move(position);
}

PointerManager.prototype.removePointer = function(id, position) {
    delete this.pointers[id];
}

function Pointer(id, initialPosition) {
    this.id = id;
    this.position = initialPosition.clone();
    this.isActive = false;
}

Pointer.prototype.move = function(position) {
    this.position.setX(position.getX());
    this.position.setY(position.getY());
}

Pointer.prototype.getPosition = function(position) {
    return this.position.clone();
}

Pointer.prototype.getIsActive = function() {
    return this.isActive;
}

Pointer.prototype.activate = function() {
    this.isActive = true;
}

Pointer.prototype.deactivate = function() {
    this.isActive = false;
}


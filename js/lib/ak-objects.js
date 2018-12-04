/*****************************************************************************

    andy-objects.js

    Andy Knoll
    November 2018

    Base class JS "classes" supporting inheritance and polymorphism.

        AKObject
        AKMvcApp
        AKCollection

*****************************************************************************/

var br = "\r\n";      // CRLF newline for output


// base AKObject class
AKObject = function(name, parent) {
    this._name = name;
    this._parent = parent;
    this._className = "AKObject";
};

// getters
AKObject.prototype.name      = function() { return this._name; };
AKObject.prototype.parent    = function() { return this._parent; };
AKObject.prototype.className = function() { return this._className; };

AKObject.prototype.info = function() {
    var s = "OBJECT PROPERTIES" + br;
    s += ".name: " + this.name() + br;

    if (this.parent() != null) {
        s += ".parent: " + this.parent().name() + br;
    } else {
        s += ".parent: null" + br;
    }

    s += ".className: " + this.className() + br;
    return s;
};






// AKMvcApp - inherits from AKObject
AKMvcApp = function(name, parent) {
    AKObject.call(this, name, parent);
    this._className = "AKMvcApp";

    this.models = this.createModels();  // override in cutom apps
    this.views  = this.createViews();
    this.ctrls  = this.createControllers();

    this.config = null;     // if using config object
};
AKMvcApp.prototype = Object.create(AKObject.prototype);
AKMvcApp.prototype.constructor = AKMvcApp;

// getters
AKMvcApp.prototype.model = function(idx) { return this.models.object(idx); };
AKMvcApp.prototype.view  = function(idx) { return this.views.object(idx); };
AKMvcApp.prototype.ctrl  = function(idx) { return this.ctrls.object(idx); };

// override in cutom apps
AKMvcApp.prototype.createModels = function() { 
    return new AKCollection("models", this);
};

AKMvcApp.prototype.createViews = function() { 
    return new AKCollection("views", this);
};

AKMvcApp.prototype.createControllers = function() {
    return new AKCollection("ctrls", this);
};

AKMvcApp.prototype.output = function(txt) { 
    // override for console or web app
};

AKMvcApp.prototype.info = function() {
	var s = "";
    s += AKObject.prototype.info.call(this);
    s += ".models: " + this.models + br;
    s += ".views: "  + this.views + br;
    s += ".ctrls: "  + this.ctrls + br;
    // new properties go here...
    return s;
};








// AKCollection
// a Collection of Objects
AKCollection = function(name, parent) {
    this._objects = [];
    this._currIndex = -1;
    AKObject.call(this, name, parent);
    this._className = "AKCollection";
};
AKCollection.prototype = Object.create(AKObject.prototype);       // no "new"
AKCollection.prototype.constructor = AKCollection;


// getters
AKCollection.prototype.object    = function(idx) { return this.byIndex(idx); };
AKCollection.prototype.currIndex = function() { return this._currIndex; };
AKCollection.prototype.count     = function() { return this._objects.length; };
AKCollection.prototype.isEmpty   = function() { return this.count() == 0; };

AKCollection.prototype.isFirstObject = function() { return this._currIndex == 0; };
AKCollection.prototype.isLastObject  = function() { return this._currIndex == this.count() - 1; };


// public methods
AKCollection.prototype.info = function() {
    var s = "";
    s += AKObject.prototype.info.call(this);
    s += "count: " + this.count() + br;
    s += "objects: " + br;
    s += this.childrenInfo();
    return s;
};

// do not list out all the childrenInfo() objects
AKCollection.prototype.infoShort = function() {
    var s = "";
    s += AKObject.prototype.info.call(this);
    s += "count: " + this.count() + br;
    return s;
};

AKCollection.prototype.childrenInfo = function() {
    var s = "";
    var obj = null;
    for (var i = 0; i < this.count(); i++) {
        obj = this.object(i);
        s += this.childInfo(obj, i);
    }
    return s;
};

// override as needed - used with methods above
AKCollection.prototype.childInfo = function(obj, idx) {
    var s = "  [" + idx + "] " + obj.name() + br;
    return s;
};


AKCollection.prototype.showRange = function(min, max) {
    var s = "";
    var obj = null;
    if (min < 0) min = 0;       // range checks
    if (max < min) max = min;
    if (max > this.count()-1) max = this.count()-1;
    for (var i = min; i <= max; i++) {
        obj = this.object(i);
        s += this.childInfo(obj, i);
    }
    return s;
};


// returns length
AKCollection.prototype.addObject = function(obj) {
    return this._objects.push(obj);
};

AKCollection.prototype.setCurrIndex = function(idx) {
    if (idx < 0) idx = 0;
    if (idx >= this.count()) idx = this.count()-1;
    this._currIndex = idx;
};

// new 09-17-2018 - now returns currObject
AKCollection.prototype.prev = function() {
    if (this.isEmpty()) return null;
    this._currIndex--;
    if (this._currIndex < 0) {
        this._currIndex = this.count()-1;        // wrap under
    }
    return this.currObject();
};

// new 09-17-2018 - now returns currObject
AKCollection.prototype.next = function() {
    if (this.isEmpty()) return null;
    this._currIndex++;
    if (this._currIndex == this.count()) {
        this._currIndex = 0;                    // wrap over
    }
    return this.currObject();
};

// new 09-17-2018
AKCollection.prototype.first = function() {
    if (this.isEmpty()) return null;
    this._currIndex = 0;
    return this.currObject();
};

// new 09-17-2018
AKCollection.prototype.last = function() {
    if (this.isEmpty()) return null;
    this._currIndex = this.count()-1;
    return this.currObject();
};

// alias methods
AKCollection.prototype.incrCurrIndex = function() { this.next(); };
AKCollection.prototype.decrCurrIndex = function() { this.prev(); };


AKCollection.prototype.currObject = function() {
    if (this.isEmpty()) return null;
    return this._objects[this._currIndex];
};

// alias name
AKCollection.prototype.current = function() {
    return this.currObject();
};


// search
AKCollection.prototype.byIndex = function(idx) {
    if (this.isEmpty()) return null;
    return this._objects[idx];      // no range check!
};

// search
AKCollection.prototype.byName = function(name) {
    if (this.isEmpty()) return null;
    for (var i = 0; i < this.count(); i++) {
        if (this._objects[i].name() == name) {
            return this._objects[i];
        }
    }
    return null;
};

AKCollection.prototype.clear = function(name) {
    while (!this.isEmpty()) {
        this._objects.pop();
    }
};

// Durstenfeld algorithm - shuffle any array in place
AKCollection.prototype.shuffle = function() {
    var i, j, tempObj;
    for (i = this._objects.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        tempObj = this._objects[i];
        this._objects[i] = this._objects[j];
        this._objects[j] = tempObj;
    }
};


/*
module.exports = {
    AKObject : AKObject,
    AKMvcApp : AKMvcApp,
    AKCollection : AKCollection
}
*/
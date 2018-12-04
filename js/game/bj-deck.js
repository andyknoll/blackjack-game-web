/*****************************************************************************

    bj-deck.js

    Andy Knoll
    November 2018

*****************************************************************************/

//var AKObjects = require("../lib/ak-objects.js");
//var BJCard    = require("./bj-card.js");

var br = "\r\n";


// BJDeck "class" - inherits from AKCollection
var BJDeck = function(name, parent) {
    AKCollection.call(this, name, parent);
    this._className = "BJDeck";
    this._createDeck();         // fill with cards at creation
};
BJDeck.prototype = Object.create(AKCollection.prototype);
BJDeck.prototype.constructor = BJDeck;

// getter
BJDeck.prototype.card = function(idx) { return this.object(idx); };

BJDeck.prototype._createDeck = function() {
    const suits  = ["D", "H", "C", "S"];
    const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];    
    var card = null;
    var idx = 0;
    var id = "";

    for (var s = 0; s < suits.length; s++) {
        for (var v = 0; v < values.length; v++) {
            id = this.name() + "-card-" + idx;
            card = new BJCard(id, this);
            card.setFaceValue(values[v], suits[s]);
            this.addObject(card);
            idx++;
        }
    }
};


// overridden to show Card values - not names
// called by base info() method
BJDeck.prototype.childInfo = function(obj, idx) {
    var brackets = "  [" + idx + "] ";
    var s = brackets.padEnd(8) + obj.faceValue() + br;
    return s;
};

// alias method name
BJDeck.prototype.getNextCard = function() {
    return this.next();
};

// shuffle and point to first card
BJDeck.prototype.reset = function() {
    this.shuffle();
    this.first();
};


//module.exports = BJDeck;

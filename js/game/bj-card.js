/*****************************************************************************

    bj-card.js

    Andy Knoll
    November 2018

*****************************************************************************/

// var AKObjects = require("../lib/ak-objects.js");

var br = "\r\n";


// BJCard "class"
var BJCard = function(name, parent) {
    AKObject.call(this, name, parent);
    this._className = "BJCard";
    this.value = "";
    this.suit  = "";
};
BJCard.prototype = Object.create(AKObject.prototype);
BJCard.prototype.constructor = BJCard;

BJCard.prototype.info = function() {
	var s = "";
    s += AKObject.prototype.info.call(this);
    s += ".value: "      + this.value + br;
    s += ".suit: "       + this.suit + br;
    s += ".faceValue: "  + this.faceValue() + br;
    s += ".pointValue: " + this.pointValue() + br;
    s += ".color: "      + this.color() + br;
    s += ".suitName: "   + this.suitName() + br;
    return s;
};

// called by Deck when creating cards
BJCard.prototype.setFaceValue = function(value, suit) {
    this.value = value;
    this.suit = suit;
};

BJCard.prototype.faceValue = function() {
    return this.value + "-" + this.suit;
};

BJCard.prototype.pointValue = function() {
    switch (this.value) {
        case "2"  : return 2;
        case "3"  : return 3;
        case "4"  : return 4;
        case "5"  : return 5;
        case "6"  : return 6;
        case "7"  : return 7;
        case "8"  : return 8;
        case "9"  : return 9;
        case "10" : return 10;
        case "J"  : return 10;
        case "Q"  : return 10;
        case "K"  : return 10;
        case "A"  : return 11;  // unless forced to 1
    }
};

BJCard.prototype.color = function() {
    switch (this.suit) {
        case "S" : return "black";
        case "C" : return "black";
        case "H" : return "red";
        case "D" : return "red";
    }
};

BJCard.prototype.suitName = function() {
    switch (this.suit) {
        case "S" : return "Spades";
        case "C" : return "Clubs";
        case "H" : return "Hearts";
        case "D" : return "Diamonds";
    }
};


//module.exports = BJCard;

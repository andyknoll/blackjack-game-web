/*****************************************************************************

    bj-multideck.js

    Andy Knoll
    November 2018

*****************************************************************************/

//var BJDeck = require("./bj-deck.js");

var br = "\r\n";


// BJMultiDeck "class" - a super Deck of Decks!
// inherits from BJDeck and overrides addDeck()
var BJMultiDeck = function(name, parent) {
    BJDeck.call(this, name, parent);
    this._className = "BJMultiDeck";
};
BJMultiDeck.prototype = Object.create(BJDeck.prototype);
BJMultiDeck.prototype.constructor = BJMultiDeck;

// override to do nothing
BJMultiDeck.prototype._createDeck = function() {
};

// adds individual deck cards to the master collection
BJMultiDeck.prototype.addDeck = function(deck) {
    var card;
    for (var i = 0; i < deck.count(); i++) {
        card = deck.card(i);
        this.addObject(card);
    }
    return this.count();
};

BJMultiDeck.prototype.createAndAddDecks = function(num) {
    var deck = null;
    for (var i = 0; i < num; i++) {
        deck = new BJDeck("deck" + i, this);
        this.addDeck(deck);
    }
};


//module.exports = BJMultiDeck;

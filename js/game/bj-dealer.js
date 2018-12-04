/*****************************************************************************

    bj-dealer.js

    Andy Knoll
    November 2018

*****************************************************************************/

//var BJPlayer = require("./bj-player.js");

var br = "\r\n";


// BJDealer "class" - inherits from BJPlayer
// must provide Deck to constructor (injection?)
var BJDealer = function(name, parent, deck) {
    BJPlayer.call(this, name, parent);
    this._className = "BJDealer";
    this.deck = deck;
};
BJDealer.prototype = Object.create(BJPlayer.prototype);
BJDealer.prototype.constructor = BJDealer;

// getters
BJDealer.prototype.game = function() { return this.parent(); };
BJDealer.prototype.deckCount = function() { return this.deck.count(); }

BJDealer.prototype.info = function() {
	var s = "";
    s += BJPlayer.prototype.info.call(this);
    s += ".deck: " + this.deck + br;
    s += ".deckCount: " + this.deckCount() + br;
    return s;
};

BJDealer.prototype.shuffleDeck = function() {
    this.deck.shuffle();
};

// assign one card from deck to one player's hand object
// Note: this does not pop() the card off the deck
BJDealer.prototype.dealCardTo = function(player) {
    var card = null;
    if (!player) return;
    card = this.deck.getNextCard();
    player.hand.addCard(card);
    //
};

BJDealer.prototype.dealFirstCards = function() {
    var players = this.game().players;
    var player = null;
    for (var n = 0; n < 2; n++) {                     // each of 2 cards
        for (var p = 0; p < players.count(); p++) {
            player = players.player(p);
            this.dealCardTo(player);       // the players first
        }
        this.dealCardTo(this);                        // finally the Dealer 
    }
};

BJDealer.prototype.upCard = function() { 
    if (this.hand.count() < 2) return null;
    return this.hand.card(1); 
};

/*
// override for Dealer - always hits 16 or less
BJDealer.prototype.isHitting = function() {
    var points = this.hand.pointTotal();
    return (points <= 16);
};
*/


// called once before each batch of rounds
// override for Dealer - use house cash
BJDealer.prototype.initRounds = function() {
    BJPlayer.prototype.initRounds.call(this);       // call base version
    this.cash = this.game().houseCash;
};


//module.exports = BJDealer;

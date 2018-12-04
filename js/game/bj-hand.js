/*****************************************************************************

    bj-hand.js

    Andy Knoll
    November 2018

    A Hand is a collection of Card objects. It is owned by a Player.

*****************************************************************************/

var br = "\r\n";

// BJHand "class"
var BJHand = function(name, parent) {
    AKCollection.call(this, name, parent);
    this._className = "BJHand";
    this.player = parent;
};
BJHand.prototype = Object.create(AKCollection.prototype);
BJHand.prototype.constructor = BJHand;

// getter
BJHand.prototype.card = function(idx) { return this.object(idx); };
BJHand.prototype.currRules = function() { return this.player.currRules(); };

// methods
BJHand.prototype.info = function() {
	var s = "";
    s += AKCollection.prototype.info.call(this);
    s += ".count: "      + this.count() + br;
    s += ".pointTotal: " + this.pointTotal() + br;
    s += ".currRules: "  + this.currRules.name() + br;
    return s;
};

BJHand.prototype.addCard = function(card) {
    if (card.value == "A") this.numAces++;  // is this still needed?
    return this.addObject(card);
};

// overridden to show face values
BJHand.prototype.childInfo = function(card, idx) {
    var s = "";
    var faceVal = card.faceValue();
    s += "  [" + idx + "] " + faceVal.padEnd(5) + br;
    return s;
};

// special cases if there is one or more than one Ace
BJHand.prototype.pointTotal = function() {
    var total = 0;
    var deduct = 0
    for (var i = 0; i < this.count(); i++) {
        total += this.card(i).pointValue();
    }
    if (total <= 21) return total;
    if (this.numAces == 1) deduct = 10;
    if (this.numAces > 1) {
        deduct = (this.numAces - 1) * 10;
    }
    return total - deduct;
};

BJHand.prototype.getStatus = function() {
    var points = this.pointTotal();
    var status = BJHand.UNDER;
    if ((points == 21) && (this.count() == 2)) {
        status = BJHand.BLACKJACK;
    } else if (points > 21) {
        status = BJHand.OVER;
    }
    return  status;
};

// MUST USE THE RULES GRID HERE!!!
BJHand.prototype.decideAction = function() {
    var game = this.player.game();
    var dealer = game.dealer;
    var upCardVal = dealer.upCard().pointValue();
    var player = this.player;
    var points = player.hand.pointTotal();

    // no need to use Rules grid for Dealer
    if (player == dealer) {
        // Dealer always hits on 16 and below
        if (this.pointTotal() <= 16) return BJHand.HIT;
    }

    // now use the rules grid for Players
    var action = this.currRules().decideAction(points, upCardVal);
    //console.log("CURR RULES ACTION RETURNED: " + action);
    return action;
};

// status codes
BJHand.UNDER = 0;
BJHand.OVER = 1;
BJHand.BLACKJACK = 2;

// action codes
BJHand.STAY = 0;
BJHand.HIT = 1;


//module.exports = BJHand;

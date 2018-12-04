/*****************************************************************************

    bj-player.js

    Andy Knoll
    November 2018

*****************************************************************************/

//var BJHand = require("./bj-hand.js");

var br = "\r\n";

// BJPlayer "class"
var BJPlayer = function(name, parent) {
    AKObject.call(this, name, parent);
    this._className = "BJPlayer";

    // each Player owns a Hand
    this.hand = new BJHand(this.name() + "_hand", this);

    this.nickname  = "";    // not same as object name()
    this.cash      = 0;
    this.inAnte    = 0;
    this.winCount  = 0;
    this.lossCount = 0;
    this.tieCount  = 0;
    this.outcome   = "";
    this.isBusted  = false;      // set each round
};
BJPlayer.prototype = Object.create(AKObject.prototype);
BJPlayer.prototype.constructor = BJPlayer;

// getters
BJPlayer.prototype.game = function() { return this.parent().parent(); };
BJPlayer.prototype.currRules = function() { return this.game().currRules(); };

BJPlayer.prototype.roundCount = function() { 
    return this.winCount + this.lossCount + this.tieCount;
};

BJPlayer.prototype.info = function() {
	var s = "";
    s += AKObject.prototype.info.call(this);
    s += ".nickname: " + this.nickname + br;
    s += ".cash: " + this.cash + br;
    s += ".hand: " + this.hand + br;
    s += ".game: " + this.game() + br;
    return s;
};

// do not count ties in result
BJPlayer.prototype.winPercent = function() { 
    // avoid NaN divide by zero from ties
    if (this.winCount + this.lossCount == 0) return 0; 
    return this.winCount / (this.winCount + this.lossCount);
};

// must count the cash in the ante too
BJPlayer.prototype.isBroke = function() { 
    return (this.cash + this.inAnte) < this.game().anteAmount;
};

BJPlayer.prototype.clearHand = function() {
    this.hand.clear();
    this.inAnte   = 0;
    this.isBusted = false;
    this.outcome  = "";
};

// move from avail cash to ante
// can still accept a deal if ante
BJPlayer.prototype.anteUp = function() {
    var anteAmt = this.game().anteAmount;
    if (this.cash >= anteAmt) {
        this.cash -= anteAmt;
        this.inAnte = anteAmt;  // instead of Boolean
    } else {
        this.isBusted = true;       // no more rounds
    }
};

// called once before each batch of rounds
BJPlayer.prototype.initRounds = function() {
    this.cash = this.game().startCash;
    this.clearHand();
    this.inAnte    = 0;
    this.winCount  = 0;
    this.lossCount = 0;
    this.tieCount  = 0;
    this.outcome   = "";
    this.isBusted  = false;
};


//module.exports = BJPlayer;

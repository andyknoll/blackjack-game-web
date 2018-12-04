/*****************************************************************************

    bj-rules.js

    Andy Knoll
    November 2018

    Trying this approach to handle multiple style games
    Vegas, Atlantic City, etc.

    This will be owned by the Game object. (perhaps the Player or Hand?)

*****************************************************************************/

//var AKObjects = require("../lib/ak-objects.js");

var br = "\r\n";


// BJRuleSet "class"
var BJRuleSet = function(name, parent) {
    AKObject.call(this, name, parent);
    this._className = "BJRuleSet";
    this.matrix = this.createMatrix();
};
BJRuleSet.prototype = Object.create(AKObject.prototype);
BJRuleSet.prototype.constructor = BJRuleSet;


// THIS IS THE MAIN DECISION ALGORITHM - called by Hand.decideAction()
// returns 0 (STAY) or 1 (HIT) or more in the future
BJRuleSet.prototype.decideAction = function(playerPoints, upCardVal) {
    //console.log("decideAction POINTS: " + playerPoints + "   UPCARD: " + upCardVal);
    // must enforce over range checks here...
    if (playerPoints > 21) return 0;
    return this.matrix[playerPoints][upCardVal];
};

// a grid of player hand values and dealer show cards
// override this for different playing styles (e.g. Vegas)
BJRuleSet.prototype.createMatrix = function() {
    return [
        [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11],
        [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [ 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [ 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [ 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [ 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [ 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [ 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [ 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [ 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
};






// BJNoviceRules "class"
var BJNoviceRules = function(name, parent) {
    BJRuleSet.call(this, name, parent);
    this._className = "BJNoviceRules";
};
BJNoviceRules.prototype = Object.create(BJRuleSet.prototype);
BJNoviceRules.prototype.constructor = BJNoviceRules;

// could just use the base class version - all zeros!
BJNoviceRules.prototype.createMatrix = function() {
    return [
        [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11],
        [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [ 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [ 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [ 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [ 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [ 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [ 7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [ 8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [ 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [10, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [11, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
};



// BJGreedyRules "class"
var BJGreedyRules = function(name, parent) {
    BJRuleSet.call(this, name, parent);
    this._className = "BJGreedyRules";
};
BJGreedyRules.prototype = Object.create(BJRuleSet.prototype);
BJGreedyRules.prototype.constructor = BJGreedyRules;

// all ones - player hits every time!
BJGreedyRules.prototype.createMatrix = function() {
    return [
        [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11],
        [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [ 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [ 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [ 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [ 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [ 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [ 7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [ 8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [ 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [10, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [11, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [13, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [14, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [16, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
};



// BJVegasRules "class"
var BJVegasRules = function(name, parent) {
    BJRuleSet.call(this, name, parent);
    this._className = "BJVegasRules";
};
BJVegasRules.prototype = Object.create(BJRuleSet.prototype);
BJVegasRules.prototype.constructor = BJVegasRules;



// BJACRules "class" - Atlantic City
var BJACRules = function(name, parent) {
    BJRuleSet.call(this, name, parent);
    this._className = "BJACRules";
};
BJACRules.prototype = Object.create(BJRuleSet.prototype);
BJACRules.prototype.constructor = BJACRules;




// BJRules "class" - collection of RuleSets
var BJRules = function(name, parent) {
    AKCollection.call(this, name, parent);
    this._className = "BJRules";
};
BJRules.prototype = Object.create(AKCollection.prototype);
BJRules.prototype.constructor = BJRules;

// getter
BJRules.prototype.ruleSet = function(idx) { return this.object(idx); };

BJRules.prototype.addRuleSet = function(ruleSet) {
    return this.addObject(ruleSet);
};

/*
module.exports = { 
    BJRuleSet     : BJRuleSet,          // includes matrix
    BJNoviceRules : BJNoviceRules,      // mostly stays
    BJGreedyRules : BJGreedyRules,      // mostly hits
    BJVegasRules  : BJVegasRules,       // Las Vegas
    BJACRules     : BJACRules,          // Atlantic City
    BJRules       : BJRules
}
*/  

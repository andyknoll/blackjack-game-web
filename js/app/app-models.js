/*****************************************************************************

    app-models.js

    Andy Knoll
    November 2018

    Blackjack simulation game - command line version.

    Modules (objects) :

        App
            AppModels
            AppViews
            AppCtrls

        Game
            Card
            Deck
            Dealer
            Player
            Players
            Hand
            Rules

    In this case there is a single BJGame Model which contains all others.
    
*****************************************************************************/

//var BJGame = require("../game/bj-game.js");

var br = "\r\n";        // CRLF for output

// AppModels "class"
var AppModels = function(name, parent) {
    AKCollection.call(this, name, parent);
    this._className = "AppModels";

    // this is the main BJGame object!
    this.bjGame = new BJGame("bjGame", this);
    this.addObject(this.bjGame);

    // the varous Game model objects are defined in their own files
    // Cards, Decks, Players, etc. - they are all props of this single Game
};
AppModels.prototype = Object.create(AKCollection.prototype);
AppModels.prototype.constructor = AppModels;

AppModels.prototype.info = function() {
	var s = "";
    s += AKCollection.prototype.info.call(this);
    s += ".bjGame: " + this.bjGame.name() + br;
    return s;
};


//module.exports = AppModels;

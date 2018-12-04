/*****************************************************************************

    app-views.js

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
            
*****************************************************************************/

//var BJConsoleView = require("../game/bj-view.js");

// AppViews "class"
var AppViews = function(name, parent) {
    AKCollection.call(this, name, parent);
    this._className = "AppViews";

    // only one View for this game
    this.bjView = new BJWebConsoleView("bjView", this);
    this.addObject(this.bjView);

};
AppViews.prototype = Object.create(AKCollection.prototype);
AppViews.prototype.constructor = AppViews;

AppViews.prototype.info = function() {
	var s = "";
    s += AKCollection.prototype.info.call(this);
    s += ".bjView: " + this.bjView.name() + br;
    return s;
};


//module.exports = AppViews;

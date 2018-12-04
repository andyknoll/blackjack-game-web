/*****************************************************************************

    app-ctrls.js

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

//var BJController = require("../game/bj-controller.js");

var br = "\r\n";        // CRLF for output

// AppCtrls "class"
var AppCtrls = function(name, parent) {
    AKCollection.call(this, name, parent);
    this._className = "AppCtrls";

    this.app = this.parent();           // alias
    this.models = this.app.models;      // can access app's Models
    this.views = this.app.views;        // can access app's Views

    this.bjCtrl = new BJController("bjCtrl", this);
    this.addObject(this.bjCtrl);

};
AppCtrls.prototype = Object.create(AKCollection.prototype);
AppCtrls.prototype.constructor = AppCtrls;

AppCtrls.prototype.info = function() {
	var s = "";
    s += AKCollection.prototype.info.call(this);
    s += ".models: " + this.models.name() + br;
    s += ".views: "  + this.views.name() + br;
    s += ".bjCtrl: " + this.bjCtrl.name() + br;
    return s;
};


// module.exports = AppCtrls;

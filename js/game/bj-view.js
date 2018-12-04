/*****************************************************************************

    bj-view.js

    Andy Knoll
    November 2018

    Blackjack simulation game - command line version.

    This is the BJWebConsoleView - output for the Blackjack simulation.
    This is basically the same as console.log but outputs to an area
    of the HTML screen and provides several buttons for user interaction.

*****************************************************************************/

//var BJHand = require("./bj-hand.js");       // is this cheating?

var br = "\r\n";    // CRLF for text files
//var br = "\r";        // CR only for screen

var hr = "============================================================";    // 60 chars


// BJWebConsoleView "class" - parent is AppViews
var BJWebConsoleView = function(name, parent) {
    AKObject.call(this, name, parent);
    this._className = "BJWebConsoleView";
    this.app = parent.parent();
    this.msg = "";

    // UI controls on screen
    this.$button1 = null;
    this.$button2 = null;
    this.$button3 = null;
    this.$button4 = null;
    this.$display = null;

    this.lines = [];
};
BJWebConsoleView.prototype = Object.create(AKObject.prototype);
BJWebConsoleView.prototype.constructor = BJWebConsoleView;

// output to console (not browser) in this version
BJWebConsoleView.prototype.output = function(txt) {
    console.log(txt);
    this.write(txt);
};

// convenience method call
BJWebConsoleView.prototype.debug = function(txt) {
    if (this.app.DEBUG) this.output("DEBUG: " + txt);
};



// "public" methods called by the BJ Controller



// called only once at app startup
BJWebConsoleView.prototype.createObjects = function() {
    this.msg = "BJWebConsoleView.createObjects";

    this.$button1 = $("#button1");
    this.$button2 = $("#button2");
    this.$button3 = $("#button3");
    this.$button4 = $("#button4");
    this.$display = $("#display");
    this.createWelcomeLines();
};

// called only once at app startup - set up handlers
BJWebConsoleView.prototype.initObjects = function() {
    this.msg = "BJWebConsoleView.initObjects";

    this.$button1.on("click", this, this.$buttonClicks);
    this.$button2.on("click", this, this.$buttonClicks);
    this.$button3.on("click", this, this.$buttonClicks);
    this.$button4.on("click", this, this.$buttonClicks);
};







BJWebConsoleView.prototype.initRounds = function() {
    this.msg = "BJWebConsoleView.initRounds";
};

// called many times - once each loop
BJWebConsoleView.prototype.startRound = function(game) {
    this.msg = "BJWebConsoleView.startRound";
    this.debug("Playing Round " + (game.currRound));
    this.debug("using " + game.currRules().name());
};

BJWebConsoleView.prototype.clearAllHands = function() {
    this.msg = "BJWebConsoleView.clearAllHands";
    this.debug("Players and Dealer clearing hands.")
};

BJWebConsoleView.prototype.shuffleDeck = function() {
    this.msg = "BJWebConsoleView.shuffleDeck";
    this.debug("Dealer shuffling deck.")
};

BJWebConsoleView.prototype.anteAllUp = function() {
    this.msg = "BJWebConsoleView.anteAllUp";
    this.debug("Players putting in their chips.")
};

BJWebConsoleView.prototype.dealFirstCards = function() {
    this.msg = "BJWebConsoleView.dealFirstCards";
    this.debug("Dealer dealing first two cards.")
    this.debug("")
};

BJWebConsoleView.prototype.dealPlayerCard = function(player) {
    this.msg = "BJWebConsoleView.dealPlayerCard";
    //this.debug("Dealing a card to " + player.nickname);
    this.showCardFaceValues(player);
};

BJWebConsoleView.prototype.showDealerUpCard = function(upCard) {
    this.msg = "BJWebConsoleView.showDealerUpCard";
    this.debug("")
    this.debug("Dealer's upcard is:  " + upCard.faceValue());
};


BJWebConsoleView.prototype.showHandStatus = function(status) {
    if (status == BJHand.BLACKJACK) {
        this.debug("Hand status is BLACKJACK");
    } else if (status == BJHand.OVER) {
        this.debug("Hand status is OVER");
    } else {
        this.debug("Hand status is UNDER");
    }
};


BJWebConsoleView.prototype.decidePlayerHitOrStay = function(player) {
    this.msg = "BJWebConsoleView.decidePlayerHitOrStay";
    this.debug("");
    this.debug(player.nickname + " is playing hand...");
    //this.debug("Current hand points: " + player.hand.pointTotal());
};

BJWebConsoleView.prototype.showPlayerIsBusted = function(player) {
    this.msg = "BJWebConsoleView.showPlayerIsBusted";
    this.debug(player.nickname + " BUSTED!");
};
    
BJWebConsoleView.prototype.showDealerIsBusted = function(dealer) {
    this.msg = "BJWebConsoleView.showDealerIsBusted";
    this.debug(dealer.nickname + " BUSTED!");
};
    

BJWebConsoleView.prototype.showPlayerHandAction = function(player, action) {
    var s = player.nickname;
    switch (action) {
        case BJHand.STAY :
            s += " is staying"
            break;
        case BJHand.HIT :
            s += " is hitting"
            break;
    }
    this.debug(s + " with " + player.hand.pointTotal());
};


BJWebConsoleView.prototype.scorePlayersHands = function() {
    this.msg = "BJWebConsoleView.scorePlayersHands";
};


BJWebConsoleView.prototype.scorePlayerHand = function(player, dealer) {
    this.msg = "BJWebConsoleView.scorePlayerHand";
    var playerHand = player.hand;
    var dealerHand = dealer.hand;
    var s = player.nickname;

    if (dealerHand.getStatus() == BJHand.OVER) {
        s = dealer.nickname + " BUSTED - " + player.nickname + " WON";
    } else if (playerHand.pointTotal() > dealerHand.pointTotal()) {
        s += " WON";
    } else if (playerHand.pointTotal() < dealerHand.pointTotal()) {
        s += " LOST";
    } else {
        s += " TIED";
    }
    this.debug("SCORING: " + s + " with " + playerHand.pointTotal());
};


BJWebConsoleView.prototype.completeRound = function() {
    this.msg = "BJWebConsoleView.completeRound";
};


// called many times to show an "animated" screen of play
// mostly testing for the web version - use setTimeout()
BJWebConsoleView.prototype.showRoundProgress = function(game) {
    //if (game.maxRounds > 1) return;     // only show progress for single round
    //this.showRoundProgressScreen(game);
};

// only called at end of each Round
BJWebConsoleView.prototype.showRoundStats = function(game) {
    this.clear();
    this.showRoundProgressScreen(game);
};

// called many times by the timer above to show an "animated" screen
BJWebConsoleView.prototype.showRoundProgressScreen = function(game) { 
    var players = game.players;
    var count = players.count();
    var currRound = game.currRound.toString();
    var player = null;
    var s = "";

    // output the heading
    s += hr;
    s += br;
    s += "Round: " + currRound.padEnd(7) + "C1    C2    C3    C4    C5    C6    CURR   PTS" + br;
    s += br;

    // show players' progress
    for (var i = 0; i <= count; i++) {
        if (i == count)
            player = game.dealer;
        else
            player = players.player(i);

        var name   = player.nickname;
        var hand   = player.hand;
        var points = hand.pointTotal().toString();
        var act    = "";

        if (hand.count() <= 2) {
            act = "DEAL";
        } else {
            var action = hand.decideAction();
            if (action == 0) act = "STAY";
            if (action == 1) act = "HIT";
        }

        if (player.outcome != "") act = player.outcome;     // only set after scoring
        if (player == game.dealer) act = "";
        s += this.showCardFaceValues(player).padEnd(50) + act.padEnd(8) + lpad(points, 2, " ") + br;
    }
    s += hr;
    this.output(s);
};

// general purpose number formatter
function lpad(value, numChars, char) {
    var result = new Array(numChars+1).join(char);
    return (result + value).slice(-numChars);
};

BJWebConsoleView.prototype.showFinalStats = function(game) { 
    //this.output("--BJWebConsoleView.showFinalStats");
    var players = game.players;
    var player = null;
    var numRounds = game.currRound.toString();
    var s = "";

    // output the heading
    s += br + hr + br;
    s += "Final stats for Blackjack simulation" + br;
    s += hr + br;
    s += "Rounds:   " + numRounds.padEnd(10) + "G     W     L     T       AVG       Cash" + br;
    s += br;

    // show players' stats
    for (var i = 0; i < players.count(); i++) {
        player = players.player(i);
        var name   = player.nickname;
        var rounds = player.roundCount().toString();
        var wins   = player.winCount.toString();
        var losses = player.lossCount.toString();
        var ties   = player.tieCount.toString();
        var pct    = player.winPercent();
        var cash   = player.cash;
        s += name.padEnd(20) + rounds.padEnd(6) + wins.padEnd(6) + losses.padEnd(6) + ties.padEnd(6);
        s += pct.toFixed(3) + lpad(cash, 11, " ") + br;
    }

    // show dealer's stats
    player = game.dealer;
    name   = player.nickname;
    rounds = player.roundCount().toString();
    wins   = player.winCount.toString();
    losses = player.lossCount.toString();
    ties   = player.tieCount.toString();
    pct    = player.winPercent();
    cash   = player.cash;
    // dealer's cash starts more to the left
    s += name.padEnd(20) + rounds.padEnd(6) + wins.padEnd(6) + losses.padEnd(6) + ties.padEnd(6);
    s += pct.toFixed(3) + lpad(cash, 11, " ") + br;
    s += hr + br;

    // determine house outcome and pretty output
    var profit = game.dealer.cash - game.houseCash;
    if (profit > 0) {
        s += "The house is up by $" + profit;
    } else if (profit < 0) {
        s += "The house lost $" + Math.abs(profit);
    } else {
        s += "The house came out even";
    }
    s += " after " + numRounds + " rounds." + br;
    s += hr + br;
    this.output(s);
};

// these were originally Model methods - moved here to View
BJWebConsoleView.prototype.showCardFaceValues = function(player) {
    var hand = player.hand;
    var vals = "";
    var s = "";
    for (var i = 0; i < hand.count(); i++) {
        vals += hand.card(i).faceValue().padEnd(5) + " ";
    }
    s = player.nickname.padEnd(14) + vals;
    this.debug(s);
    return s;
};

BJWebConsoleView.prototype.showCardValues = function(player) {
    var hand = player.hand;
    var vals = "";
    var s = "";
    for (var i = 0; i < hand.count(); i++) {
        vals += hand.card(i).value.padEnd(5) + " ";
    }
    s = player.nickname.padEnd(14) + vals;
    this.debug(s);
    return s;
};

BJWebConsoleView.prototype.showCardValuesAndPointTotal = function(player) {
    var s = player.nickname.padEnd(14) + player.hand.cardValues() + player.hand.pointTotal();
    this.debug(s);
    return s;
};


///////////////   ADDITIONS   //////////////////

// now we have a UI with buttons to manage
// NEED TO ENFORCE CORRECT BEHAVIOR!

BJWebConsoleView.prototype.$buttonClicks = function(e) {
    //alert("BJWebConsoleView.$buttonClicks")
    var $btn = $(e.target);
    var view = e.data;
    var id = $btn.attr("id");

    switch (id) {
        case "button1" : 
            view.animWelcomeScreen();
            break;
        case "button2" : 
            view.showInstructions();
            break;
        case "button3" : 
            //view.play1Round();        // in Controller
            break;
        case "button4" : 
            //view.play20Rounds();      // in Controller
            break;
    }
};
    
BJWebConsoleView.prototype.clear = function() {
    this.$display.html("");
};

BJWebConsoleView.prototype.write = function(s) {
    // no line breaks!
    var old = this.$display.html();
    this.$display.html(old + s);
};

BJWebConsoleView.prototype.createWelcomeLines = function() {
    this.lines = [
        "                                                           <br>",
        "  XXXX  XX     XXX   XXXX XX  XX     XX  XXX   XXXX XX  XX <br>",
        "  XX XX XX    XX XX XX    XX XX      XX XX XX XX    XX XX  <br>",
        "  XX XX XX    XX XX XX    XX XX      XX XX XX XX    XX XX  <br>",
        "  XXXX  XX    XXXXX XX    XXX        XX XXXXX XX    XXX    <br>",
        "  XX XX XX    XX XX XX    XX XX   XX XX XX XX XX    XX XX  <br>",
        "  XX XX XX    XX XX XX    XX XX   XX XX XX XX XX    XX XX  <br>",
        "  XX XX XX    XX XX XX    XX XX   XX XX XX XX XX    XX XX  <br>",
        "  XXXX  XXXXX XX XX  XXXX XX  XX   XXX  XX XX  XXXX XX  XX <br>",
        "                                                           <br>",
        "                                                           <br>",
        "                 XX  XXXXXX  XXXXXX  XX  XX                <br>",
        "                 XX  XX  XX  XX  XX  XX  XX                <br>",
        "                 XX  XX  XX  XX  XX  XX  XX                <br>",
        "                 XX  XXXXXX  XXXXXX  XXXXXX                <br>",
        "                 XX      XX  XX  XX      XX                <br>",
        "                 XX      XX  XX  XX      XX                <br>",
        "                 XX      XX  XXXXXX      XX                <br>",
        "                                                           <br>",
        "                                                           <br>",
        "                 ANDY KNOLL - NOVEMBER 2018                <br>",
        "                                                           <br>"
    ];
};

BJWebConsoleView.prototype.showWelcomeScreen = function() {
    var s = "";
    this.clear();
    for (var i = 0; i < this.lines.length; i++) {
        s += this.lines[i];
    }
    this.write(s);
};

BJWebConsoleView.prototype.showInstructions = function() {
    var s = "";
    this.clear();
    s += "                                                           " + "<br>";
    s += "   THIS IS A SIMULATION OF PLAYING ONE OR MORE ROUNDS OF   " + "<br>";
    s += "   BLACKJACK AGAINST THE HOUSE. EACH PLAYER STARTS WITH    " + "<br>";
    s += "   $200 AND EACH ROUND HAS A $20 ANTE TO PLAY.             " + "<br>";
    s += "                                                           " + "<br>";
    s += "   RUN THE GAME SEVERAL TIMES TO SEE CHANGING STATS ABOUT  " + "<br>";
    s += "   THE PLAYERS, THEIR WINS, LOSSES AND REMAINING CASH.     " + "<br>";
    s += "                                                           " + "<br>";
    s += "                                                           " + "<br>";
    s += "               *** ABOUT THIS APPLICATION ***              " + "<br>";
    s += "                                                           " + "<br>";
    s += "                                                           " + "<br>";
    s += "   This is a class project for the Front End Developer     " + "<br>";
    s += "   Professional Certification course at MCC Corporate      " + "<br>";
    s += "   College. It is designed as a tiny MVC app even though   " + "<br>";
    s += "   it runs entirely in a single pass like an old batch     " + "<br>";
    s += "   program. It was written as a NodeJS console app and     " + "<br>";
    s += "   developed via a series of tests on custom objects.      " + "<br>";
    s += "                                                           " + "<br>";
    s += "   The Game and supporting objects were then easily        " + "<br>";
    s += "   ported to a web host and some animation fun added.       " + "<br>";
    this.write(s);
};


BJWebConsoleView.prototype.animWelcomeScreen = function() {
    var self = this;
    this.clear();
    this.currLine = 0;

    this.timer = setInterval(function() {
        self.showNextLine();
    }, 75);
};


BJWebConsoleView.prototype.showNextLine = function() {
    var s = "";
    if (this.currLine >= this.lines.length) {
        this.currLine = 0;
        clearInterval(this.timer);
        this.blinkWelcomeScreen();
    } else {
        s = this.lines[this.currLine];
        this.write(s);
        this.currLine++;    
    }
};

BJWebConsoleView.prototype.blinkWelcomeScreen = function() {
    var self = this;
    this.clear();
    this.currBlink = 0;

    this.timer = setInterval(function() {
        self.blinkWelcome();
    }, 125);

};

BJWebConsoleView.prototype.blinkWelcome = function() {
    var s = "";
    if (this.currBlink > 6) {
        clearInterval(this.timer);
        return;
    }

    if (this.currBlink % 2 == 0) {
        this.showWelcomeScreen();
    } else {
        this.clear();
    }
    this.currBlink++;
};

// now using callback
BJWebConsoleView.prototype.play1Round = function(caller, callback) {
    var s = "node blackjack.js 1";
    this.clear();
    this.write("> ");
    this.typeSentence(s, 100, caller, callback, 1);
};

// now using callback
BJWebConsoleView.prototype.play20Rounds = function(caller, callback) {
    var s = "node blackjack.js 20";
    this.clear();
    this.write("> ");
    this.typeSentence(s, 100, caller, callback, 20);
};

// now using callback - extra param is crazy! refactor this!
BJWebConsoleView.prototype.typeSentence = function(s, dur, caller, callback, numRounds) {
    var self = this;
    var char = "";
    var pos = 0;
    this.timer = setInterval(function() {
        if (pos >= s.length) {
            clearInterval(self.timer);
            callback.call(caller, numRounds);
            return;
        }
        char = s[pos];
        self.write(char);
        pos++;
    }, dur);
};



//module.exports = BJWebConsoleView;

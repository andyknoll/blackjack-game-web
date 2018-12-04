/*****************************************************************************

    bj-controller.js

    Andy Knoll
    November 2018

    Blackjack simulation game - command line version.

    This is the BJController for the Blackjack simulation.
    This is the main driver of the program and makes calls to the
    Game API and updates the view(s) from the Game model values.

    In this sense it acts as a broker between the Models and Views.

*****************************************************************************/

//var BJHand = require("./bj-hand.js");   // for status and action codes

var br = "\r\n";        // CRLF for output


// BJController "class" - parent is AppCtrls
// can access Game model and Game view
var BJController = function(name, parent) {
    AKObject.call(this, name, parent);
    this._className = "BJController";

    this.app = this.parent().app;             // alias
    this.models = this.app.models;
    this.views = this.app.views;

    this.game = this.models.bjGame;
    this.view = this.views.bjView;
};
BJController.prototype = Object.create(AKObject.prototype);
BJController.prototype.constructor = BJController;

BJController.prototype.info = function() {
	var s = "";
    s += AKObject.prototype.info.call(this);
    s += ".game: " + this.game.name() + br;
    s += ".view: "  + this.view.name() + br;
    return s;
};


// convenience method call
BJController.prototype.output = function(txt) {
    this.view.output(txt);
};

// convenience method call
BJController.prototype.debug = function(txt) {
    if (this.app.DEBUG) this.view.debug(txt);
};



// actual app methods - called by tester
BJController.prototype.run = function() {
    // called only once at app startup
    this.createObjects();
    this.initObjects();

    // this.output() must now come after view created!
    // this should really be in the View anyway
    /*
    this.output("");
    this.output("running " + this.app.name() + br);
    this.output(new Date() + br);
    this.output("");
    this.output(br);
    */

   this.view.animWelcomeScreen();

    // WAIT FOR THE BUTTON CLICKS BEFORE STARTING!
    // this.playRounds();      // loops many games until completion

    /*
    this.output("");
    this.output(br);
    this.output("completed simulation" + br);    
    this.output(new Date() + br);    
    */
};

// called only once at app startup
BJController.prototype.createObjects = function() {
    //this.debug("BJController.createObjects");
    this.game.createObjects();
    this.debug(this.game.msg);
    this.view.createObjects();
    this.debug(this.view.msg);
};

// called only once at app startup
BJController.prototype.initObjects = function() {
    //this.debug("BJController.initObjects");
    this.game.initObjects();
    this.debug(this.game.msg);
    this.view.initObjects();
    this.debug(this.view.msg);

    // added for WebConsoleView
    this.view.$button3.on("click", this, this.$button3Click);
    this.view.$button4.on("click", this, this.$button4Click);
};

BJController.prototype.$button3Click = function(e) {
    var self = e.data;
    self.view.play1Round(self, self.playRounds);
};

BJController.prototype.$button4Click = function(e) {
    var self = e.data;
    self.view.play20Rounds(self, self.playRounds);
};





// loop the rounds many times
BJController.prototype.playRounds = function(numRounds) {
    //this.debug("BJController.playRounds");
    var self = this;
    var timer = 0;

    this.initRounds();      // clear out all totals
    timer = setInterval(function() {
        self.playSingleRound();     // must be before "if"
        if ((self.game.currRound == numRounds) || (self.game.players.allBroke())) {
            clearInterval(timer);
            self.showFinalStats();
        }
    }, 125);
};

// called once before each batch of rounds
BJController.prototype.initRounds = function() {
    //this.debug("BJController.initRounds");
    this.game.initRounds();
    this.view.initRounds(this.game);
    this.debug("");
};

// called many times - once each loop
BJController.prototype.playSingleRound = function() {
    //this.debug("BJController.playSingleRound");
    this.debug("Round: " + (this.game.currRound + 1));

    // STARTING
    this.startRound();              // shuffle, anteUp, deal, etc.
    this.clearAllHands();           // remove cards from last round
    this.shuffleDeck();             // all decks' cards
    this.anteAllUp();               // subtract from players cash

    // DEALING
    this.dealFirstCards();          // two cards to everyone

    // PLAYING
    this.decidePlayersHitOrStay();  // before dealer gets third card
    this.decideDealerHitOrStay();   // to Dealer only - might bust
    this.decideDealerBusted();      // Dealer only - all win

    // SCORING
    this.scorePlayersHands();       // remaining players and dealer
    this.completeRound();           // finish up, tally scores
};

// this would be event driven in an interactive game!
BJController.prototype.startRound = function() {
    //this.debug("BJController.startRound");
    this.game.startRound();
    this.view.startRound(this.game);
};


BJController.prototype.clearAllHands = function() {
    //this.debug("BJController.clearAllHands");
    this.game.clearAllHands();
    this.view.clearAllHands();
};

BJController.prototype.shuffleDeck = function() {
    //this.debug("BJController.shuffleDeck");
    this.game.shuffleDeck();
    this.view.shuffleDeck();
};

BJController.prototype.anteAllUp = function() {
    //this.debug("BJController.anteAllUp");
    this.game.anteAllUp();
    this.view.anteAllUp();
};

// Controller should do this - not the Dealer!
BJController.prototype.dealFirstCards = function() {
    //this.debug("BJController.dealFirstCards");
    var dealer = this.game.dealer;
    this.game.dealFirstCards();
    this.view.dealFirstCards();

    for (var c = 0; c < 2; c++) {
        for (var i = 0; i < this.game.players.count(); i++) {
            var player = this.game.players.player(i);
            if (!player.isBroke()) {
                this.dealPlayerCard(player);
            }
        }
        this.dealPlayerCard(dealer);      // and the Dealer too
        this.debug("");
    }
    this.view.showDealerUpCard(dealer.upCard());
};

BJController.prototype.dealPlayerCard = function(player) {
    //this.debug("BJController.dealPlayerCard");
    this.game.dealPlayerCard(player);
    this.view.dealPlayerCard(player);
    this.view.showRoundProgress(this.game);      // show card progress in view
};

BJController.prototype.decidePlayersHitOrStay = function() {
    //this.debug("BJController.decidePlayersHitOrStay");
    var players = this.game.players;
    for (var i = 0; i < players.count(); i++) {
        var player = this.game.players.player(i);
        if (!player.isBroke()) this.decidePlayerHitOrStay(player);
    }
};

// HIT or STAY according to strategy
BJController.prototype.decidePlayerHitOrStay = function(player) {
    //this.debug("BJController.decidePlayerHitOrStay");
    var hand = player.hand;
    var status = hand.getStatus();
    var action = hand.decideAction();       // must cache for view

    this.view.decidePlayerHitOrStay(player);
    //this.view.showCardFaceValues(player);
    this.view.showRoundProgress(this.game);          // show card progress in view

    while ((status == BJHand.UNDER) && (action == BJHand.HIT)) {
        this.view.showPlayerHandAction(player, action);
        this.dealPlayerCard(player);        // updates both model and view
        status = hand.getStatus();
        action = hand.decideAction();       // keep deciding if under
    }
    this.view.showPlayerHandAction(player, action);
    this.decidePlayerBusted(player);
    this.view.showRoundProgress(this.game);          // show STAY in view
    this.debug("");
};

BJController.prototype.decidePlayerBusted = function(player) {
    //this.debug("BJController.decidePlayerBusted");
    if (player.hand.getStatus() == BJHand.OVER) {
        this.game.scorePlayerIsBusted(player);
        this.view.showPlayerIsBusted(player);
        this.view.showRoundProgress(this.game);     // show progress in view
    }
};


BJController.prototype.decideDealerHitOrStay = function() {
    //this.debug("BJController.decideDealerHitOrStay");
    this.decidePlayerHitOrStay(this.game.dealer);
};

BJController.prototype.decideDealerBusted = function() {
    //this.debug("BJController.decideDealerBusted");
    var dealer = this.game.dealer;
    if (dealer.hand.getStatus() == BJHand.OVER) {
        this.view.showDealerIsBusted(dealer);       // scoring the bust later
        this.view.showRoundProgress(this.game);     // show progress in view
    }
};

// this includes the dealer too
BJController.prototype.scorePlayersHands = function() {
    //this.debug("BJController.scorePlayersHands");
    this.game.scorePlayersHands();
    this.view.scorePlayersHands();
    for (var i = 0; i < this.game.players.count(); i++) {
        var player = this.game.players.player(i);
        if (!player.isBroke() && !player.isBusted) {
            // skip non-players and ones who just busted
            this.scorePlayerHand(player, this.game.dealer);
        }
    }
};

BJController.prototype.scorePlayerHand = function(player, dealer) {
    //this.debug("BJController.scorePlayerHand");
    this.game.scorePlayerHand(player, dealer);
    //this.view.scorePlayerHand(player, dealer);
    this.view.showRoundProgress(this.game);          // show progress in view
};

// not currently used
BJController.prototype.completeRound = function() {
    //this.debug("BJController.completeRound");
    this.game.completeRound();
    this.view.completeRound();
    this.view.showRoundStats(this.game);          // show stats for this Round
};

BJController.prototype.showFinalStats = function() {
    //this.debug("BJController.showFinalStats");
    this.game.status = BJGame.IDLE;
    this.view.showFinalStats(this.game);
    this.debug("");
};

//module.exports = BJController;

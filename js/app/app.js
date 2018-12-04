// app.js

// NOTE: this test "app" is really the Controller and View combined!


var relPath = "js/card-maker/";
var cm = new CardMaker(relPath);
//alert("CardMaker created ok")    ;

var CARDS_DOWN = false;


var CURR_STATE  = "";       // STARTING, DEALING, PLAYING, SCORING, COMPLETING ?
var CURR_PLAYER = 0;
var CURR_CARD   = 0;
var MAX_CARDS   = 0;
var DEAL_DUR    = 250;

var card = null;

// VIEW controls
var $app     = $("#app");
var $table   = $("#table");
var $display = $("#display");

var $button1 = $("#button1");
var $button2 = $("#button2");
var $button3 = $("#button3");
var $button4 = $("#button4");
var $button5 = $("#button5");
var $button6 = $("#button6");
var $button7 = $("#button7");
var $button8 = $("#button8");

var $hand0 = $("#hand0");
var $hand1 = $("#hand1");
var $hand2 = $("#hand2");
var $hand3 = $("#hand3");

// calculate others from anchor cardLocs!
var cardLocs = [
    {"top": 140, "left": 850},     // 0
    {"top": 260, "left": 525},     // 1 - human
    {"top": 140, "left": 200},     // 2
    {"top":  15, "left": 525}      // 3 - dealer
];

var deckLocs = {"top": 0, "left": 1150};
var pileLocs = {"top": 0, "left": 0};



var log = function(s) {
    $display.html(s);
};


// click to flip card test - remove
var clickHandler = function(e) {
    var card = e.data;
    if (card._isUp) 
        card.flipDown(250);
    else
        card.flipUp(250);
};


// DEMO BUTTONS

var buttonsClickHandler = function(e) {
    var $btn = $(e.target);
    var btnId = $btn.attr("id");
    switch (btnId) {
        case "button1" : button1click(); break;
        case "button2" : button2click(); break;
        case "button3" : button3click(); break;
        case "button4" : button4click(); break;
        case "button5" : button5click(); break;
        case "button6" : button6click(); break;
        case "button7" : button7click(); break;
        case "button8" : button8click(); break;
    }
};

$button1.on("click", buttonsClickHandler);
$button2.on("click", buttonsClickHandler);
$button3.on("click", buttonsClickHandler);
$button4.on("click", buttonsClickHandler);
$button5.on("click", buttonsClickHandler);
$button6.on("click", buttonsClickHandler);
$button7.on("click", buttonsClickHandler);
$button8.on("click", buttonsClickHandler);

// button methods
button1click = function() {
    log("button1click");
    CURR_CARD = 0;
    MAX_CARDS = 1;
    createAndDeal();
};

button2click = function() {
    log("button2click");
    CURR_CARD = 0;
    MAX_CARDS = 4;
    createAndDeal();
};

button3click = function() {
    log("button3click");
    CURR_CARD = 0;
    MAX_CARDS = 8;
    createAndDeal();
};

button4click = function() {
    log("button4click");
    //alert(cm._cards.length)
    var card = cm.card(4);
    card.flipUp(250);
};

button5click = function() {
    log("button5click");
    hit();
};

button6click = function() {
    log("button6click");
    stay();
};

button7click = function() {
    log("button7click");
    playSingleRound();
};

button8click = function() {
    log("button8click");
    completeEvent();
};



// this is NOT in a loop - event driven!!!
createAndDeal = function() {
    //log("createAndDeal: " + MAX_CARDS);
    CURR_STATE  = "DEALING";
    //CURR_PLAYER = 0;
    //CURR_CARD   = 0;

    if (CURR_CARD >= MAX_CARDS) {
        //setTimeout(function() {
            playHands();
        //}, 1000);
    } else {
        log("creating and dealing: " + (CURR_CARD+1) + " of " + MAX_CARDS);
        //alert("creating and dealing: " + (CURR_CARD+1) + " of " + MAX_CARDS);
        CURR_PLAYER = CURR_CARD % 4;
        createOneRandomCard();
        dealOneCardTo(CURR_PLAYER);    
    }
};

/////////////////////////////////////////////////////////////////////////
createOneRandomCard = function() {
    //alert("createOneRandomCard")
    card = cm.createRandomCard("card");
    card.appendTo($table);
    card.setTopAndLeft(deckLocs.top, deckLocs.left);
    card.flipDown(0);       // must use the animation function!
    return card;
};
/////////////////////////////////////////////////////////////////////////


dealOneCardTo = function(player) {
    log("dealOneCardTo Player: " + player);
    var loc = cardLocs[player];     // must match array name!
    var batch = Math.floor(CURR_CARD / 4);
    var top  = loc.top;
    var left = loc.left + (batch * 40);
    card.animTo(top, left, DEAL_DUR);
};

dealAnotherCardTo = function(player) {
    log("dealAnotherCardTo Player: " + player);
    var loc  = cardLocs[player];
    var batch = 2;      // fake - remove!
    var top  = loc.top;
    var left = loc.left + (batch * 40);
    card.animTo(top, left, DEAL_DUR);
};

playHands = function() {
    CURR_PLAYER = 0;                // until STAY
    CURR_STATE = "PLAYING";         // handler might not have triggered yet!
    log("playHands for Player: " + CURR_PLAYER);
    decideHitOrStay();
};

decideHitOrStay = function() {
    log("decideHitOrStay for Player: " + CURR_PLAYER);
    var isHitting = false;
    var count = 0;

    var timer = setInterval(function() {
        count++;
        if (count <= 1) {
            hit();
        } else {
            clearInterval(timer);
            stay();    
        }
    }, 1000);

};


hit = function() {
    log("HIT - Player: " + CURR_PLAYER);
    CURR_STATE = "PLAYING";     // already set
    createOneRandomCard();
    CURR_CARD++;
    dealAnotherCardTo(CURR_PLAYER);    
};

stay = function() {
    CURR_PLAYER++;
    log("STAY - Changed To Player: " + CURR_PLAYER);
    if (CURR_PLAYER <= 3) {
        decideHitOrStay();
    } else {
        finishRound();
    }
};

finishRound = function() {
    log("Finishing Round");
    scoreCards();
    //removeCards();
};

scoreCards = function() {
    log("Scoring Cards");
    CURR_STATE = "SCORING"; 
    card = cm.card(4);      // flip Dealer's down card
    card.flipUp(250);

    setTimeout(function() {
        // check each hand here
        removeCards();
    }, 1000);
};

removeCards = function() {
    log("Removing Cards");
    CURR_STATE = "COMPLETING"; 
    var count = cm.cardCount();
    var card = null;
    var i = 0;

    var timer = setInterval(function() {
        i++;
        if (i < count) {
            log("FLIPPING CARD " + (i+1) + " OF " + count);
            card = cm.card(i);
            //card.flipDown(250);
        } else {
            clearInterval(timer);
            returnCards();
        }
    }, 100);
};


returnCards = function() {
    log("Returning Cards");
    CURR_STATE = "COMPLETING"; 
    var self = this;
    var count = cm.cardCount();
    var card = null;
    var i = 0;

    var timer = setInterval(function() {
        i++;
        if (i < count) {
            log("RETURNING CARD " + (i+1) + " OF " + count);
            card = cm.card(i);
            card.animTo(pileLocs.top, pileLocs.left, DEAL_DUR);
            //card.flipDown(250);   // does not work
        } else {
            clearInterval(timer);
            card = self.cm.lastCard();
            card.flipDown(250);
            for (var j = 1; j < self.cm.cardCount(); j ++) {
                //self.cm.card(j).remove();
            }
            //card.remove();
            //self.cm.clear();
            createOneRandomCard();      // so there is still one card in cards[]
            //start over
            /*
            setTimeout(function() {
                CURR_CARD = 0;
                MAX_CARDS = 8;
                createAndDeal();    
            }, 1000);
            */
        }
    }, 100);
};


setHandPositions = function() {
    $hand0.css({ "top": cardLocs[0].top, "left": cardLocs[0].left });
    $hand1.css({ "top": cardLocs[1].top, "left": cardLocs[1].left });
    $hand2.css({ "top": cardLocs[2].top, "left": cardLocs[2].left });
    $hand3.css({ "top": cardLocs[3].top, "left": cardLocs[3].left });
};





cardDealingHandler = function() {
    CURR_CARD++;
    createAndDeal();
};

cardPlayingHandler = function() {
    //alert("*cardPlayingHandler*");
};

completeEvent = function(e) {
    cardDealingHandler();      // fake - simulated
};


onAnimComplete = function(e) {
    //alert("onAnimComplete  CURR_CARD: " + CURR_CARD);
    var card = e.card;

    // TO DO: JUST CALL A COMMON ROUTING METHOD FOR ALL
    // cm.cardAnimComplete(card);      // or similar...

    if (CURR_STATE == "DEALING") {
        if (CURR_CARD != 3) card.flipUp(250);
        cardDealingHandler();      // simulated        
    }

    // do NOT set this before handler is triggered!
    if (CURR_STATE == "PLAYING") {
        //alert("onAnimComplete  PLAYING CURR_CARD: " + CURR_CARD);
        var len = cm._cards.length;
        card = cm.card(len-1);
        card.flipUp(250);
        cardPlayingHandler();      // simulated  
    }

    if (CURR_STATE == "COMPLETING") {
        //log("REMOVED CARD");
    }
};




playSingleRound = function() {
    alert("playSingleRound");
    createAndDeal2();
};

// this is NOT in a loop - event driven!!!
createAndDeal2 = function() {
    log("createAndDeal2");
    MAX_CARDS = 8;
    CURR_CARD = 0;
    CURR_STATE  = "DEALING";

    if (CURR_CARD >= MAX_CARDS) {
        //setTimeout(function() {
            playHands();
        //}, 1000);
    } else {
        log("creating and dealing: " + (CURR_CARD+1) + " of " + MAX_CARDS);
        CURR_PLAYER = CURR_CARD % 4;
        createOneRandomCard();
        dealOneCardTo(CURR_PLAYER);    
    }
};



// Card Manager setup
cm.$elem.on("ANIM_COMPLETE", onAnimComplete);       // change to addHandler()
cm.cardWidth = 120;
setHandPositions();
createOneRandomCard();


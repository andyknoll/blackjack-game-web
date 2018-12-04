/******************************************************************************

    card-maker.js

    Andy Knoll
    November 2018

    A collection of 52 sizable playing card images which keep their aspect
    ratios. Images have been compressed via TinyPNG.com and are full size.

    Although there is a pool of 52 fixed images (plus card backs) there can
    be many objects created which can contain and reuse these images.

    Even when a 10-deck MultiDeck has 520 cards in the pool there are still
    only a few visual objects currently on the table to display.

    Basic animation methods flip() and moveTo() are provided in the Card
    objects but no game logic belongs here! The Controller and View will
    determine the correct actions to take and screen positions for Cards.

    Each Card object has the Manager trigger a common "completed" event
    when the deal (move) animation is completed. The Controller must listen
    for thiese events and determine the next game action (async control).

    Images (paths) are accessed via card value and suit:

        getImage("3", "H");     // returns 3 of Hearts .PNG image

    TO DO:
        createCardFromObject({});
        createCardsFromArray([{},{},{},{}]);

        screenLocs[
            [{top:200, left:200}],
            [{top:200, left:300}],
            [{top:200, left:400}]
        ]
            
******************************************************************************/



var CardMaker = function(pathFromHtml) {
    this._pathFromHtml = pathFromHtml;
    this._paths  = [];
    this._images = [];
    this._cards  = [];

    this.cardWidth  = 150;        // default
    this.cardHeight = 230;
    this.$elem = $("<div></div>");  // for triggering events

    // getters
    this.path  = function(idx) { return this._paths[idx];  };
    this.image = function(idx) { return this._images[idx]; };
    this.card  = function(idx) { return this._cards[idx];  };

    this.cardCount = function(idx) { return this._cards.length;  };
    this.lastCard  = function() { return this.card(this.cardCount()-1);  };
    
    // always 52 images - decks may be larger
    this._createPaths = function() {
        var path = this._pathFromHtml;
        path += "img/";

        this._paths = [
            path + "AS.png",  path + "AC.png",   path + "AH.png",  path + "AD.png", 
            path + "2S.png",  path + "2C.png",   path + "2H.png",  path + "2D.png", 
            path + "3S.png",  path + "3C.png",   path + "3H.png",  path + "3D.png", 
            path + "4S.png",  path + "4C.png",   path + "4H.png",  path + "4D.png", 
            path + "5S.png",  path + "5C.png",   path + "5H.png",  path + "5D.png", 
            path + "6S.png",  path + "6C.png",   path + "6H.png",  path + "6D.png", 
            path + "7S.png",  path + "7C.png",   path + "7H.png",  path + "7D.png", 
            path + "8S.png",  path + "8C.png",   path + "8H.png",  path + "8D.png", 
            path + "9S.png",  path + "9C.png",   path + "9H.png",  path + "9D.png", 
            path + "10S.png", path + "10C.png",  path + "10H.png", path + "10D.png", 
            path + "JS.png",  path + "JC.png",   path + "JH.png",  path + "JD.png", 
            path + "QS.png",  path + "QC.png",   path + "QH.png",  path + "QD.png", 
            path + "KS.png",  path + "KC.png",   path + "KH.png",  path + "KD.png",
            path + "back-red.png"
        ]
    };

    // create 52 Image objects
    this._createImages = function() {
        this._images = [];
        for (var i = 0; i <= 52; i++) {
            this._images[i] = new Image();
        }
    };

    // could make this a preloader!
    this._loadImages = function() {
        // include the back card
        for (var i = 0; i <= 52; i++) {
            this._images[i].src = this._paths[i];
        }
    };

    this._convertValue = function(value) {
        switch(value) {
            case "A"  : return 0;
            case "2"  : return 1;
            case "3"  : return 2;
            case "4"  : return 3;
            case "5"  : return 4;
            case "6"  : return 5;
            case "7"  : return 6;
            case "8"  : return 7;
            case "9"  : return 8;
            case "0"  : return 9;        // allow 0 for 10
            case "10" : return 9;
            case "J"  : return 10;
            case "Q"  : return 11;
            case "K"  : return 12;
            default   : return 0;
        }
    };

    this._convertSuit = function(suit) {
        switch(suit.toUpperCase()) {
            case "S"  : return 0;
            case "C"  : return 1;
            case "H"  : return 2;
            case "D"  : return 3;
            default   : return 0;
        }
    };

    this._convertValueIdx = function(value) {
        switch(value) {
            case 0  : return "A";
            case 1  : return "2";
            case 2  : return "3";
            case 3  : return "4";
            case 4  : return "5";
            case 5  : return "6";
            case 6  : return "7";
            case 7  : return "8";
            case 8  : return "9";
            case 9  : return "10";
            case 10 : return "J";
            case 11 : return "Q";
            case 12 : return "K";
            default : return 0;
        }
    };

    this._convertSuitIdx = function(suit) {
        switch(suit) {
            case 0 : return "S";
            case 1 : return "C";
            case 2 : return "H";
            case 3 : return "D";
            default   : return 0;
        }
    };

    

    // public API calls
    this.clear = function() {
        var count = this.cardCount();
        for (var i = 0; i < count; i++) {
            this._cards.pop();
        }
    };

    this.createCard = function(value, suit, elemId) {
        var card = new cardObj(value, suit, elemId, this);  // pass parent
        this._cards.push(card);
        card.setWidth(this.cardWidth);      // can override with CSS
        card.setBGPath(this.getPath(value, suit));
        return card;
    };

    this.createRandomCard = function(elemId) {
        var v = Math.floor(Math.random() * 13);
        var s = Math.floor(Math.random() * 4);
        v = this._convertValueIdx(v);
        s = this._convertSuitIdx(s);
        var card = this.createCard(v, s, elemId);
        //alert("CM.createRandomCard ok");
        return card;
    };

    // 2..10 J..A,  S C H D
    this.getImage = function(value, suit) {
        var v = this._convertValue(value);
        var s = this._convertSuit(suit);
        var idx = (v * 4) + s;      // index into array
        return this.image(idx);
    };

    this.getPath = function(value, suit) {
        return this.getImage(value, suit).src;
    };

    this.getBackPath = function() {
        return this.path(52);
    };

    this.setCustomBack = function(path) {
        this._paths[52] = path;
        this._images[52].src = path;
    };

    // new 12/01 - pass in an array of props
    // THIS SHOULD NOT REALLY BE HERE! GAME LOGIC!
    this.dealCards = function(cardProps, dur) {
        var i = 0;
        var len = cardProps.length;

        if (len <= 0) return;
        // deal first immediately
        var props = cardProps[i];
        var card  = cm.card(i);
        //card.animTo(props.top, props.left, props.dur, props.complete);
        card.animTo(props.top, props.left, props.dur);
        // stagger the others
        var looper = setInterval(function() {
            i++;
            props = cardProps[i];
            card  = cm.card(props.index);
            //card.animTo(props.top, props.left, props.dur, props.complete);
            card.animTo(props.top, props.left, props.dur);
            if (i == len-1) {
                clearInterval(looper);
            }
        }, dur);
    };

    // pass the card object with the event
    this.onAnimComplete = function() {
        var card = this.owner;      // HTMLElement owner
        var cm = card.parent;
        cm.$elem.trigger({ type:"ANIM_COMPLETE", card: card});
    };


    // private methods called at creation
    this._createPaths();
    this._createImages();
    this._loadImages();
};














// only created by parent CardUI object
var cardObj = function(value, suit, elemId, parent) {
    // create the new element
    this.$elem = $("<div id='" + elemId + "' class='cm-card'></div>");
    this.elem = this.$elem[0];
    this.value = value;
    this.suit = suit;
    this.parent = parent;

    this._isUp = true;      // private properties
    this._ratioW = .6543;
    this._ratioH = 1.5282;

    this.$elem.owner = this;
    this.elem.owner = this;

    this.isUp = function() { return this._isUp; }
    //this.setIsUp = function(bool) { this._isUp = bool; }
    

    // 2..10 J..A,  S C H D
    this.getImage = function() {
        return this.parent.getImage(this.value, this.suit);
    };

    this.getPath = function() {
        return this.parent.getPath(this.value, this.suit);
    };

    // jQuery method
    this.setBGPath = function(path) {
        this.$elem.css("background-image", "url(" + path + ")");
    };


    // jQuery method
    // enforces correct H/W ratio
    this.setWidth = function(w) {
        this.$elem.css("width", w);
        this.$elem.css("height", w * this._ratioH);
    };

    // jQuery method
    // enforces correct H/W ratio
    this.setHeight = function(h) {
        this.$elem.css("height", h);
        this.$elem.css("width", h * this._ratioW);
    };

    this.setTop = function(t) {
        this.$elem.css({ top : t});
    };

    this.setLeft = function(l) {
        this.$elem.css({ left : l});
    };

    this.setTopAndLeft = function(t, l) {
        this.setTop(t);
        this.setLeft(l);
    };


    // jQuery method
    this.setValueAndSuit = function(value, suit) {
        this.value = value;
        this.suit = suit;
        this.setBGPath(this.getPath());
    };

    this.setRandomValueAndSuit = function() {
        //this.parent.setRandomValueAndSuit(elem);
        var v = Math.floor(Math.random() * 13);
        var s = Math.floor(Math.random() * 4);
        this.value = this.parent._convertValueIdx(v);
        this.suit  = this.parent._convertSuitIdx(s);
        this.setBGPath(this.getPath());
    };

    // _isUp must be true to show image correctly (not inverted)

    // jQuery method
    this.showUp = function() {
        this._isUp = true;
        this.$elem.css({ transform: 'rotateY(0deg)' });
        this.setBGPath(this.getPath());
    };

    // jQuery method
    this.showDown = function() {
        this._isUp = false;
        this.$elem.css({ transform: 'rotateY(180deg)' });
        var path = this.parent.getBackPath();
        this.setBGPath(path);
    };


    // jQuery method - fix for no animate() support
    this.flipUp = function(dur) {
        //alert("flipUp");
        var self = this;
        if (this._isUp) return;
        this.$elem.animate(
            {   deg: 0  },      // animate from 180 down to 0
            {
                duration: dur,
                step: function(now) {
                    $(this).css({ transform: 'rotateY(' + now + 'deg)' });
                    if (now < 90) {
                        if (!self._isUp) self.showUp();     // sets _isUp to true
                    }
                }
            }
        );
    };
    
    // jQuery method - fix for no animate() support
    this.flipDown = function(dur) {
        //alert("flipDown");
        var self = this;
        if (!this._isUp) return;
        this.$elem.animate(
            {   deg: 180  },      // animate from 0 up to 180
            {
                duration: dur,
                step: function(now) {
                    //alert("flipping: " + now);
                    $(this).css({ transform: 'rotateY(' + now + 'deg)' });
                    if (now > 90) {
                        if (self._isUp) self.showDown();     // sets _isUp to false
                    }
                }
            }
        );
    };
    
    // jQuery method
    this.moveTo = function(top, left) {
        this.$elem.css({ "top" : top, "left" : left });
    };

    //this.animTo = function(top, left, dur, complete) {
    this.animTo = function(top, left, dur) {
        var props = { "top" : top, "left" : left };
        // now hardcoded to always use parent callback
        //var opts = { "duration" : dur, "complete": this.parent.onAnimComplete };
        var opts = { "duration" : dur, "complete": this.parent.onAnimComplete };
        this.$elem.animate(props, opts);
    };

    this.appendTo = function($elem) {
        $elem.append(this.$elem);
    };

    this.remove = function() {
        this.$elem.remove();
    };


};


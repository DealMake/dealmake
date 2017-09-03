module.exports = function () {
    // That is this.
    var that = this;

    // Properties are used for reference.
    this.properties = {
        PAGE_NAME: "Let's Deal",
        PAGE_ID: "browse",
        BACKGROUND_COLOR: "##FFFFFF",
        CARD_COLOR: "#E0E0E0",
        CARD_WIDTH: 240,
        CARD_HEIGHT: 240,
        FRONT_INNER_MARGIN: 12,
        FRONT_IMAGE_SIZE: 64,
        FRONT_TITLE_HEIGHT: 24,
        FRONT_NAME_HEIGHT: 22,
        FRONT_PLACE_HEIGHT: 20,
        FRONT_TAG_SIZE: 14,
        FRONT_TOP_TEXT_PADDING: 8,
        FRONT_TAG_PADDING: 12,
        FRONT_IMAGE_PADDING: 16,
        FRONT_TITLE_COLOR: "#000000",
        FRONT_NAME_COLOR: "#000000",
        FRONT_PLACE_COLOR: "#000000",
        FRONT_TAG_COLOR: "#000000",
        FRONT_OVERLAY_MULT: 0.5,
        RETURN_TO_MIDDLE_TIME: 0.5,
        FLIP_TIME: 0.5,
        DRAG_ROTATION_DIV: 500,
        BACK_MARGIN_VERTICAL: 16,
        BACK_MARGIN_HORIZONTAL: 12,
        CARD_CORNER_RADIUS: 8,
        FRONT_CHECK_COLOR: "#00FF00",
        FRONT_X_COLOR: "#FF0000",
        BACK_TEXT_SIZE: 14,
        USED_CARD_FADE_TIME: 1,
        ALL_DONE_COLOR: "#404040",
        ALL_DONE_TEXT: "That's it for now.",
        LOADING_MORE_TEXT: "Loading more cards...",
        ALL_DONE_SIZE: 24,
        VERDICT_DISTANCE: 120,
        VERDICT_SPEED: 1000,
        THROW_VELOCITY_MULT: 0.5
    };

    // The page itself.
    this.page = null;

    // Add the page to the navigation view.
    this.initiateUI = function (tab) {

        this.tab = tab;

        // Add the tab to the tabfolder.
        this.page = new tabris.Page({
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        }).set({
            title: this.properties.PAGE_NAME
        }).appendTo(this.tab.navigationView);

        // Setup a data object.
        this.page.data = {};

        // Reference to this.
        this.page.data.myPage = this;

        console.log("GH1");

        // Background.
        this.page.data.browseBackground = new tabris.ImageView({
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        });
        this.page.data.browseBackground.set({
            image: _i("resources/images/bac-browse.png"),
            scaleMode: "fill"
        });
        this.page.data.browseBackground.appendTo(this.page);

        // Logo.
        /*
        this.page.data.bwLogo = new tabris.ImageView({
            centerY: -160,
            centerX: 0,
            width: 102,
            height: 102
        });
        this.page.data.bwLogo.set({
            image: _i("resources/images/log-dealmakebw.png")
        });
        this.page.data.bwLogo.appendTo(this.page);
        */

        console.log("GH2");

        // Card data.
        this.page.data.discardedCards = [];
        this.page.data.topCard = null;
        this.page.data.nextCard = null;
        this.page.data.queuedCards = [];

        // Card loading info.
        this.page.data.lastCardLoaded = -1;
        this.page.data.moreCards = true;
        this.page.data.loadingCards = true;
        this.page.data.nextCardText = null;
        this.page.data.topCardText = null;

        console.log("GH3");

        // Create and append the composite that will hold the next card.
        this.page.data.nextCardComposite = new tabris.Composite({
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        });
        this.page.data.nextCardComposite.appendTo(this.page);

        // Create and append the composite that will hold the top card.
        this.page.data.topCardComposite = new tabris.Composite({
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        });
        this.page.data.topCardComposite.appendTo(this.page);

        // Create and append the composite that will hold the discarded cards.
        this.page.data.discardedCardComposite = new tabris.Composite({
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        });
        this.page.data.discardedCardComposite.appendTo(this.page);

        console.log("GH4");

        // Create the topcard and nextcard.
        // this.createNextCard();
        // this.shiftCards();

        // Listen for horizontal panning.
        this.page.data.onPanHorizontal = function (event) {

            // If the topcard is ready for swiping.
            if (that.page.data.topCard != null && !that.page.data.topCard.composite.data.flipped && !that.page.data.topCard.composite.data.flipping && !that.page.data.topCard.composite.data.returningToMiddle) {

                // Depending on the status of the horizontal pan.
                switch (event.state) {

                    // If the panning has changed.
                    case "change":

                        // Update the X transformation and rotation.
                        that.page.data.topCard.composite.set({
                            transform: {
                                translationX: that.page.data.topCard.composite.get("transform").translationX + (event.velocityX * ((Date.now() - that.page.data.panLastCalled) / 1000)),
                                rotation: that.page.data.topCard.composite.get("transform").rotation + ((event.velocityX / that.properties.DRAG_ROTATION_DIV) * ((Date.now() - that.page.data.panLastCalled) / 1000))
                            }
                        });

                        // Update the transparency of the X and check based on the position of the card.
                        if (that.page.data.topCard.composite.get("transform").translationX < 0) {
                            that.page.data.topCard.composite.find("#check").set({
                                opacity: 0
                            });
                            that.page.data.topCard.composite.find("#x").set({
                                opacity: (-that.page.data.topCard.composite.get("transform").translationX / (that.page.get("bounds").width / 2)) * that.properties.FRONT_OVERLAY_MULT
                            });
                        } else if (that.page.data.topCard.composite.get("transform").translationX > 0) {
                            that.page.data.topCard.composite.find("#x").set({
                                opacity: 0
                            });
                            that.page.data.topCard.composite.find("#check").set({
                                opacity: (that.page.data.topCard.composite.get("transform").translationX / (that.page.get("bounds").width / 2)) * that.properties.FRONT_OVERLAY_MULT
                            });
                        }

                        break;

                        // If the drag ends, determine whether a verdict has been reached.
                    case "end":

                        // If the offset is beyond the verdict distance constant, a verdict has been reached.
                        if (Math.abs(that.page.data.topCard.composite.get("transform").translationX) > that.properties.VERDICT_DISTANCE) {
                            that.verdict(Math.sign(that.page.data.topCard.composite.get("transform").translationX) == 1 ? true : false, event.velocityX, event.velocityY);

                            // Also, if the velocity is beyond the verdict speed, a verdict has been reached.
                        } else if (Math.abs(event.velocityX) > that.properties.VERDICT_SPEED) {
                            that.verdict(Math.sign(event.velocityX) == 1 ? true : false, event.velocityX, event.velocityY);

                            // If neither of these conditions are met, cancel the drag.
                        } else {
                            that.cancelDrag();
                        }
                        break;

                        // If the drag was canceled (don't know why this would happen) just cancel the drag.
                    case "cancel":
                        that.cancelDrag();
                        break;
                }
            }

            // Update the last pan called (for deltatime purposes).
            that.page.data.panLastCalled = Date.now();
        };

        // Listen for tap.
        this.page.data.onTap = function (event) {
            if (that.page.data.topCard != null && !that.page.data.topCard.composite.data.flipping && !that.page.data.topCard.composite.data.returningToMiddle) {
                that.flipTopCard();
            }
        };

        console.log("GH6");

        // Add event listeners.
        this.page.on({
            panHorizontal: this.page.data.onPanHorizontal,
            tap: this.page.data.onTap
        });

        // Add an initial activity indicator.
        this.page.data.initAA = new tabris.ActivityIndicator({
            centerX: 0,
            centerY: 0
        });
        this.page.data.initAA.appendTo(this.page);

        this.getMoreCards();

        console.log("GH7");
    };

    // Called when the page is switched to.
    this.load = function () {

    };

    // Called when the page is switched away from.
    this.unload = function () {

    };

    // Called when the page is gone home to.
    this.homeState = function () {
        // Nothing for now.
    };

    /*
        <===--- Unique methods ---===>
    */

    this.createNextCard = function () {

        // Update the data objects accordingly.
        this.page.data.nextCard = this.page.data.queuedCards[0];
        this.page.data.queuedCards.shift();

        // Clear the contents of the nextcard composite.
        this.page.data.nextCardComposite.find().dispose();

        // Create a blank card composite and then build the front.
        this.page.data.nextCard.composite = this.createCardComposite();
        this.page.data.nextCard.composite.data.type = "next";
        this.buildFront(this.page.data.nextCard);
        this.page.data.nextCard.composite.appendTo(this.page.data.nextCardComposite);
    };

    this.createCardComposite = function () {

        // Create the composite.
        var comp = new tabris.Composite({
            centerX: 0,
            centerY: 64,
            width: this.properties.CARD_WIDTH,
            height: this.properties.CARD_HEIGHT,
            cornerRadius: this.properties.CARD_CORNER_RADIUS
        });

        // Set its transform (just in case) and background.
        comp.set({
            transform: {
                rotation: 0,
                translationX: 0,
                translationY: 0
            },
            background: this.properties.CARD_COLOR
        });

        // Setup some variables.
        comp.data = {};
        comp.data.type = "none";
        comp.data.flipped = false;
        comp.data.flipping = false;
        comp.data.returningToMiddle = false;

        // Return the composite.
        return comp;
    };

    this.shiftCards = function () {

        // If there is a next card.
        if (this.page.data.nextCard != null) {

            // Update the data objects accordingly.
            this.page.data.topCard = this.page.data.nextCard;
            this.page.data.topCard.composite.data.type = "top";

            // Detatch the new topcard from the nextcard composite.
            this.page.data.topCard.composite.detach();

            // Clear the contents of the topcard composite.
            this.page.data.topCardComposite.find().dispose();

            // Append the topcard to the topcard composite.
            this.page.data.topCard.composite.appendTo(this.page.data.topCardComposite);

            // If there are cards queued.
            if (this.page.data.queuedCards.length > 0) {

                // Create a new next card.
                this.createNextCard();

            } else {



                // Create an all done message and append it to the next card composite.
                this.page.data.nextCardText = new tabris.TextView({
                    centerX: 0,
                    centerY: 64
                });
                this.page.data.nextCardText.set({
                    text: this.properties.ALL_DONE_TEXT,
                    textColor: this.properties.ALL_DONE_COLOR,
                    font: this.properties.ALL_DONE_SIZE + "px"
                });
                this.page.data.nextCardComposite.append(this.page.data.nextCardText);

                // Set nextcard to null.
                this.page.data.nextCard = null;

            }
        } else if (this.page.data.topCard != null) {

            // If the topcard has not been set to null yet and there is no next card, set it to null.
            this.page.data.topCard = null;

            this.page.data.topCardText = this.page.data.nextCardText;
            this.page.data.nextCardText = null;
        }

    };

    this.cancelDrag = function () {

        // Make the X and check completely transparent
        this.page.data.topCard.composite.find("#check").set({
            opacity: 0
        });
        this.page.data.topCard.composite.find("#x").set({
            opacity: 0
        });

        // Set up the animation to return the card to the middle
        this.page.data.topCard.composite.data.returningToMiddle = true;
        var anim = this.page.data.topCard.composite.animate({
            transform: {
                translationX: 0,
                translationY: 0,
                rotation: 0
            }
        }, {
            delay: 0,
            duration: this.properties.RETURN_TO_MIDDLE_TIME * 1000,
            easing: "ease-out",
            repeat: 0,
            reverse: false
        });

        // After the animation, update the returning to middle variable.
        var targetCard = this.page.data.topCard.composite;
        anim.then(function () {
            targetCard.data.returningToMiddle = false;
        });
    };

    this.flipTopCard = function () {
        this.page.data.topCard.composite.data.flipping = true;

        // The first half of the flipping animation.
        var animShrink = this.page.data.topCard.composite.animate({
            transform: {
                scaleX: 0.01
            }
        }, {
            delay: 0,
            duration: (this.properties.FLIP_TIME / 2) * 1000,
            easing: "ease-out",
            repeat: 0,
            reverse: false
        });

        // Once it is complete, clear and construct card faces.
        animShrink.then(function () {

            // Toggle flipped.
            that.page.data.topCard.composite.data.flipped = !that.page.data.topCard.composite.data.flipped;

            if (that.page.data.topCard.composite.data.flipped) {

                // Clear the card.
                that.page.data.topCard.composite.find().dispose();

                // Detatch the discarded composite.
                that.page.data.discardedCardComposite.detach();

                // Construct the back of the card.
                that.buildBack(that.page.data.topCard);

            } else {

                // Clear the card.
                that.page.data.topCard.composite.find().dispose();

                // Attach the discarded composite.
                that.page.data.discardedCardComposite.appendTo(that.page);

                // Construct the front of the card.
                that.buildFront(that.page.data.topCard);
            }

            // The second half of the flipping animation.
            var animGrow = that.page.data.topCard.composite.animate({
                transform: {
                    scaleX: 1
                }
            }, {
                delay: 0,
                duration: (that.properties.FLIP_TIME / 2) * 1000,
                easing: "ease-in",
                repeat: 0,
                reverse: false
            });
            animGrow.then(function () {
                that.page.data.topCard.composite.data.flipping = false;
            });
        });
    };

    this.buildFront = function (card) {

        // Clear the existing contents of the card.
        card.composite.find().dispose();

        // Create the front composite and append it to the card.
        var frontComp = new tabris.Composite({
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        });
        frontComp.appendTo(card.composite);

        // Create the check mark and append it to the front composite.
        var checkMark = new tabris.TextView({
            centerX: 0,
            centerY: 0
        });
        checkMark.set({
            id: "check",
            opacity: 0,
            textColor: this.properties.FRONT_CHECK_COLOR,
            font: Math.floor(this.properties.CARD_WIDTH / 1.2) + "px",
            text: "\u2713"
        });
        checkMark.appendTo(frontComp);

        // Create the X mark and append it to the front composite.
        var xMark = new tabris.TextView({
            centerX: 0,
            centerY: 0
        });
        xMark.set({
            id: "x",
            opacity: 0,
            textColor: this.properties.FRONT_X_COLOR,
            font: Math.floor(this.properties.CARD_WIDTH / 1.2) + "px",
            text: "\u2717"
        });
        xMark.appendTo(frontComp);

        if (card.type == "vc") {

            // Create the profile image and append it to the front composite.
            var profile = new tabris.ImageView({
                left: this.properties.FRONT_INNER_MARGIN,
                top: this.properties.FRONT_INNER_MARGIN,
                width: this.properties.FRONT_IMAGE_SIZE,
                height: this.properties.FRONT_IMAGE_SIZE
            });
            profile.set({
                image: {
                    src: card.profileImage
                },
                cornerRadius: (this.properties.FRONT_IMAGE_SIZE / 2)
            });
            profile.appendTo(frontComp);

            // Create the tag and append it to the front composite.
            var tag = new tabris.TextView({
                left: this.properties.FRONT_INNER_MARGIN,
                top: this.properties.FRONT_INNER_MARGIN + this.properties.FRONT_IMAGE_SIZE + this.properties.FRONT_TAG_PADDING,
                bottom: this.properties.FRONT_INNER_MARGIN + this.properties.FRONT_TITLE_HEIGHT + this.properties.FRONT_TAG_PADDING,
                right: this.properties.FRONT_INNER_MARGIN
            });
            tag.set({
                textColor: this.properties.FRONT_TAG_COLOR,
                alignment: "center",
                font: this.properties.FRONT_TAG_SIZE + "px",
                text: card.tag
            });
            tag.appendTo(frontComp);

        } else {

            var imgSpacing = ((this.properties.CARD_HEIGHT - ((this.properties.FRONT_INNER_MARGIN * 2) + this.properties.FRONT_NAME_HEIGHT + this.properties.FRONT_TAG_PADDING)) - (this.properties.FRONT_IMAGE_SIZE * 2)) / 3;

            // Create the profile image and append it to the front composite.
            var profile = new tabris.ImageView({
                left: this.properties.FRONT_INNER_MARGIN,
                top: this.properties.FRONT_INNER_MARGIN + imgSpacing,
                width: this.properties.FRONT_IMAGE_SIZE,
                height: this.properties.FRONT_IMAGE_SIZE
            });
            profile.set({
                image: {
                    src: card.profileImage
                },
                cornerRadius: (this.properties.FRONT_IMAGE_SIZE / 2)
            });
            profile.appendTo(frontComp);

            // Create the logo image and append it to the front composite.
            var logo = new tabris.ImageView({
                left: this.properties.FRONT_INNER_MARGIN,
                top: this.properties.FRONT_INNER_MARGIN + this.properties.FRONT_IMAGE_SIZE + (imgSpacing * 2),
                width: this.properties.FRONT_IMAGE_SIZE,
                height: this.properties.FRONT_IMAGE_SIZE
            });
            logo.set({
                image: {
                    src: card.logo
                },
                cornerRadius: (this.properties.FRONT_IMAGE_SIZE / 2)
            });
            logo.appendTo(frontComp);

            // Create the tag and append it to the front composite.
            var tag = new tabris.TextView({
                left: this.properties.FRONT_INNER_MARGIN + this.properties.FRONT_IMAGE_SIZE + this.properties.FRONT_TAG_PADDING,
                top: this.properties.FRONT_INNER_MARGIN + this.properties.FRONT_IMAGE_SIZE + this.properties.FRONT_TAG_PADDING,
                bottom: this.properties.FRONT_INNER_MARGIN + this.properties.FRONT_TITLE_HEIGHT + this.properties.FRONT_TAG_PADDING,
                right: this.properties.FRONT_INNER_MARGIN
            });
            tag.set({
                textColor: this.properties.FRONT_TAG_COLOR,
                font: this.properties.FRONT_TAG_SIZE + "px",
                text: card.tag
            });
            tag.appendTo(frontComp);

        }

        // Create the title and append it to the front composite.
        var title = new tabris.TextView({
            centerX: 0,
            bottom: this.properties.FRONT_INNER_MARGIN,
            height: this.properties.FRONT_TITLE_HEIGHT,
            width: this.properties.CARD_WIDTH - (this.properties.FRONT_INNER_MARGIN * 2)
        });
        title.set({
            textColor: this.properties.FRONT_TITLE_COLOR,
            font: Math.floor(this.properties.FRONT_TITLE_HEIGHT / 1.2) + "px",
            maxLines: 1,
            alignment: "center",
            text: card.type == "e" ? card.title : card.profileName
        });
        title.appendTo(frontComp);

        // Create the profile name and append it to the front composite.
        if (card.type == "e") {
            var name = new tabris.TextView({
                left: this.properties.FRONT_INNER_MARGIN + this.properties.FRONT_IMAGE_SIZE + this.properties.FRONT_IMAGE_PADDING,
                top: this.properties.FRONT_INNER_MARGIN,
                height: this.properties.FRONT_NAME_HEIGHT,
                right: this.properties.FRONT_INNER_MARGIN
            });
            name.set({
                textColor: this.properties.FRONT_NAME_COLOR,
                font: Math.floor(this.properties.FRONT_NAME_HEIGHT / 1.2) + "px",
                maxLines: 1,
                text: card.profileName
            });
            name.appendTo(frontComp);
        }

        // Create the place and append it to the front composite.
        var place = new tabris.TextView({
            left: this.properties.FRONT_INNER_MARGIN + this.properties.FRONT_IMAGE_SIZE + this.properties.FRONT_IMAGE_PADDING,
            top: this.properties.FRONT_INNER_MARGIN + this.properties.FRONT_NAME_HEIGHT + this.properties.FRONT_TOP_TEXT_PADDING,
            height: this.properties.FRONT_PLACE_HEIGHT,
            right: this.properties.FRONT_INNER_MARGIN
        });
        place.set({
            textColor: this.properties.FRONT_PLACE_COLOR,
            font: Math.floor(this.properties.FRONT_PLACE_HEIGHT / 1.2) + "px",
            maxLines: 1,
            text: card.place
        });
        place.appendTo(frontComp);

        // Return the front composite (not needed, because it was already appended).
        return frontComp;
    };

    this.buildBack = function (card) {

        // Clear the existing contents of the card.
        card.composite.find().dispose();

        // Create a scroll view and append a text view.
        var backScroll = new tabris.ScrollView({
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            direction: "vertical"
        });
        backScroll.appendTo(card.composite);
        backScroll.append(new tabris.TextView({
            left: that.properties.BACK_MARGIN_HORIZONTAL,
            right: that.properties.BACK_MARGIN_HORIZONTAL,
            top: that.properties.BACK_MARGIN_VERTICAL,
            bottom: that.properties.BACK_MARGIN_VERTICAL,
            markupEnabled: true,
            font: that.properties.BACK_TEXT_SIZE + "px",
            text: card.back
        }));

        return backScroll;
    };

    this.verdict = function (approved, vx, vy) {

        // Handle approval.
        if (this.page.data.topCard.id > 0) {
            this.tab.app.apiCall("users/" + this.tab.app.user + "/verdict/" + this.page.data.topCard.id + "?token=" + this.tab.app.token, "POST", {
                approved: approved
            });
            if (this.page.data.moreCards && this.page.data.queuedCards.length < 5) {
                this.page.getMoreCards();
            }
        } else if (!this.tab.app.completedTutorial) {

            // If the user reaches a verdict on the tutorial, let the server know the tutorial has been completed.
            this.tab.app.apiCall("users/" + this.tab.app.user + "/tutorial?token=" + this.tab.app.token, "POST", {});
            this.tab.app.completedTutorial = true;
        }

        // Detach the topcard from the parent.
        this.page.data.topCard.composite.detach();

        // Attach the topcard to the discarded cards composite and set the type.
        this.page.data.topCard.composite.appendTo(this.page.data.discardedCardComposite);
        this.page.data.topCard.composite.data.type = "discarded";

        // Fade out animation plus movement due to velocity.
        var anim = this.page.data.topCard.composite.animate({
            transform: {
                translationX: this.page.data.topCard.composite.get("transform").translationX + (this.properties.USED_CARD_FADE_TIME * vx * this.properties.THROW_VELOCITY_MULT),
                translationY: this.page.data.topCard.composite.get("transform").translationY + (this.properties.USED_CARD_FADE_TIME * vy * this.properties.THROW_VELOCITY_MULT),
                rotation: this.page.data.topCard.composite.get("transform").rotation
            },
            opacity: 0
        }, {
            delay: 0,
            duration: this.properties.USED_CARD_FADE_TIME * 1000,
            easing: "ease-out",
            repeat: 0,
            reverse: false
        });
        anim.then(function () {

            // After the animation is done, remove the object from the discsrded cards array and dispose of the composite.
            for (var i = 0, fnd = false; i < that.page.data.discardedCards.length && !fnd; i++) {
                if (that.page.data.discardedCards[i].composite.cid == this.cid) {
                    that.page.data.discardedCards.splice(i, 1);
                    fnd = true;
                }
            }
            this.dispose();

        });

        // Update the data objects to reflect this.
        this.page.data.discardedCards.push(this.page.data.topCard);
        this.page.data.topCard = null;

        // Shift the next card up.
        this.shiftCards();
    };

    this.getMoreCards = function () {
        console.log("GOT MORE CARDS!");
        this.tab.app.apiCall("users/" + this.tab.app.user + "/browse?token=" + this.tab.app.token + "&radius=1&count=15&last=" + this.page.data.lastCardLoaded, "GET").then(function (res) {
            console.log(res);
            if (res.status == 200) {

                for (var i = 0; i < res.data.length; i++) {
                    that.page.data.queuedCards.push(res.data[i]);
                }

                if (res.data.length < 15) {
                    that.page.data.moreCards = false;

                    if (that.page.data.topCardText != null) {
                        that.page.data.topCardText.dispose();
                        that.page.data.topCardText = null;

                        that.createNextCard();
                        that.shiftCards();
                    } else if (that.page.data.nextCardText != null) {
                        that.page.data.topCardText.dispose();
                        that.page.data.topCardText = null;

                        that.createNextCard();
                    }
                }

                // Dispose of the activity indicator.
                if (that.page.data.lastCardLoaded == -1) {
                    if (!that.tab.app.completedTutorial) {

                        // Add a tutorial card.
                        that.page.data.queuedCards.unshift(that.tab.app.isVC ? {

                            // For VCs.
                            id: -1,
                            profileImage: "data:image/png;base64,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",
                            profileName: "John Smith",
                            tag: "Tap this card to see the back.",
                            title: "John's Hotdogs",
                            back: "This is a typical venture card. Tap this card to return to the front side. After that, swipe the card left or right to approve or disapprove of the venture.",
                            logo: "data:image/jpeg;base64,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",
                            place: "Nearby",
                            type: "e"

                        } : {

                            // For entreprenuers.
                            id: -1,
                            profileImage: "data:image/png;base64,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",
                            profileName: "John Smith",
                            tag: "Tap this card to see the back.",
                            back: "This is a typical venture capitalist card. Tap this card to return to the front side. After that, swipe the card left or right to approve or disapprove of the venture capitalist.",
                            place: "Nearby",
                            type: "vc"
                        });

                    }
                    that.page.data.initAA.dispose();

                    that.createNextCard();
                    that.shiftCards();
                }

                if (res.data.length > 0) {
                    that.page.data.lastCardLoaded = res.data[res.data.length - 1].id;
                }
            }
        });
    };

};

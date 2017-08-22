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
        this.tab.app.apiCall("users/" + this.tab.app.user + "/verdict/" + this.page.data.topCard.id + "?token=" + this.tab.app.token, "POST", {
            approved: approved
        });
        if (this.page.data.moreCards && this.page.data.queuedCards.length < 5) {
            this.page.getMoreCards();
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
        this.tab.app.apiCall("users/" + this.tab.app.user + "/browse?token=" + this.tab.app.token + "&count=15&last=" + this.page.data.lastCardLoaded, "GET").then(function (res) {
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

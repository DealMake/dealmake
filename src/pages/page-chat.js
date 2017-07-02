module.exports = function () {

    // That is this.
    var that = this;

    // Properties are used for reference.
    this.properties = {
        PAGE_NAME: "CHAT",
        PAGE_ID: "chat",
        OPENGRAPH_API_KEY: "59512525085d5624538c89cc",
        MESSAGE_WIDTH: 208,
        MESSAGE_PADDING_HORIZONTAL: 32,
        MESSAGE_PADDING_VERTICAL: 16,
        MESSAGE_COLOR_OTHER: "#EAEAEA",
        MESSAGE_COLOR_SELF: "#80B0FF",
        TEXT_COLOR_SELF: "#404040",
        TEXT_COLOR_OTHER: "#000000",
        BUBBLE_CORNER_RADIUS: 6,
        TIMESTAMP_COLOR: "#A0A0A0",
        TIMESTAMP_SIZE: 12,
        MESSAGE_TEXT_SIZE: 16,
        BUBBLE_MARGIN: 6,
        TAIL_SIZE: 16,
        NEW_MESSAGE_ZONE_HEIGHT: 48,
        NEW_MESSAGE_ZONE_COLOR: "#FFFFFF",
        NEW_MESSAGE_ZONE_PADDING: 10,
        NEW_MESSAGE_CAMERA_IMAGE: {
            src: "resources/images/msg_photo.png"
        },
        NEW_MESSAGE_SEND_IMAGE: {
            src: "resources/images/msg_send.png"
        },
        NEW_MESSAGE_AUTOCORRECT: true,
        NEW_MESSAGE_HINT: "Message"
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

        // Cache URLs so they don't have to be re-figgured-out every time the cell is refreshed.
        this.page.data.richCache = {};

        // Set up a reference to this.
        this.page.data.myPage = this;

        // Create a new collection view and append it.
        this.page.data.collectionView = new tabris.CollectionView({
            top: 0,
            bottom: this.properties.NEW_MESSAGE_ZONE_HEIGHT,
            left: 0,
            right: 0,
            refreshEnabled: false,
            itemCount: 0,
            createCell: function () {

                // Create the cell composite.
                var cell = new tabris.Composite({
                    left: 0,
                    right: 0
                });

                return cell;
            },
            updateCell: function (cell, index) {

                // Dispose of all the previous contents.
                cell.find().dispose();

                switch (that.page.data.contentParsed[index].type) {
                    case "timestamp":
                        var timestampView = new tabris.TextView({
                            top: that.properties.MESSAGE_PADDING_VERTICAL / 2,
                            centerX: 0,
                            bottom: that.properties.MESSAGE_PADDING_VERTICAL / 2
                        });
                        timestampView.set({
                            text: that.page.data.contentParsed[index].value,
                            maxLines: 1,
                            font: that.properties.TIMESTAMP_SIZE + "px",
                            textColor: that.properties.TIMESTAMP_COLOR
                        });
                        cell.append(timestampView);
                        break;

                    case "text":
                        var bubbleComposite, bubble, message, tail;
                        var msgType, side, antiSide, obj, tailChar;
                        if (that.page.data.contentParsed[index].me) {
                            msgType = "SELF";
                            side = "right";
                            antiSide = "left";
                            tailChar = "\u25B6";
                        } else {
                            msgType = "OTHER";
                            side = "left";
                            antiSide = "right";
                            tailChar = "\u25C0";
                        }

                        // Create the bubble composite
                        obj = {
                            top: that.properties.MESSAGE_PADDING_VERTICAL / 2,
                            bottom: that.properties.MESSAGE_PADDING_VERTICAL / 2,
                            width: that.properties.MESSAGE_PADDING_HORIZONTAL + that.properties.MESSAGE_WIDTH
                        };
                        obj[side] = 0;
                        bubbleComposite = new tabris.Composite(obj);

                        // Create the actual bubble
                        obj = {};
                        obj[side] = that.properties.MESSAGE_PADDING_HORIZONTAL;
                        obj[antiSide] = 0;
                        bubble = new tabris.Composite(obj);
                        bubble.set({
                            id: "bubble",
                            background: that.properties["MESSAGE_COLOR_" + msgType],
                            cornerRadius: that.properties.BUBBLE_CORNER_RADIUS
                        });

                        // Create the bubble tail.
                        obj = {
                            centerY: 0
                        };
                        obj[antiSide] = ["#bubble", -6];
                        tail = new tabris.TextView(obj);
                        tail.set({
                            textColor: that.properties["MESSAGE_COLOR_" + msgType],
                            font: that.properties.TAIL_SIZE + "px",
                            text: tailChar
                        });

                        // Create the message inside of the bubble.
                        message = new tabris.TextView({
                            left: that.properties.BUBBLE_MARGIN,
                            right: that.properties.BUBBLE_MARGIN,
                            top: that.properties.BUBBLE_MARGIN,
                            bottom: that.properties.BUBBLE_MARGIN
                        });
                        message.set({
                            textColor: that.properties["TEXT_COLOR_" + msgType],
                            font: that.properties.MESSAGE_TEXT_SIZE + "px",
                            text: that.page.data.contentParsed[index].value
                        });
                        bubble.append(message);
                        bubbleComposite.append(tail);
                        bubbleComposite.append(bubble);
                        cell.append(bubbleComposite);
                        break;

                    case "url":
                        var bubbleComposite, bubble, title, description, image, aa, tail;
                        var msgType, side, antiSide, obj, tailChar;
                        if (that.page.data.contentParsed[index].me) {
                            msgType = "SELF";
                            side = "right";
                            antiSide = "left";
                            tailChar = "\u25B6";
                        } else {
                            msgType = "OTHER";
                            side = "left";
                            antiSide = "right";
                            tailChar = "\u25C0";
                        }

                        // If the rich component hasn't loaded yet, create a blank bubble with an activity indicator.
                        if (!that.page.data.richCache[that.page.data.contentParsed[index].value]) {

                            // Create the bubble composite
                            obj = {
                                top: that.properties.MESSAGE_PADDING_VERTICAL / 2,
                                bottom: that.properties.MESSAGE_PADDING_VERTICAL / 2,
                                width: that.properties.MESSAGE_PADDING_HORIZONTAL + that.properties.MESSAGE_WIDTH
                            };
                            obj[side] = 0;
                            bubbleComposite = new tabris.Composite(obj);

                            // Create the actual bubble
                            obj = {};
                            obj[side] = that.properties.MESSAGE_PADDING_HORIZONTAL;
                            obj[antiSide] = 0;
                            bubble = new tabris.Composite(obj);
                            bubble.set({
                                id: "bubble",
                                background: that.properties["MESSAGE_COLOR_" + msgType],
                                cornerRadius: that.properties.BUBBLE_CORNER_RADIUS
                            });

                            // Create the bubble tail.
                            obj = {
                                centerY: 0
                            };
                            obj[antiSide] = ["#bubble", -6];
                            tail = new tabris.TextView(obj);
                            tail.set({
                                textColor: that.properties["MESSAGE_COLOR_" + msgType],
                                font: that.properties.TAIL_SIZE + "px",
                                text: tailChar
                            });

                            // Create the activity indicator.
                            aa = new tabris.ActivityIndicator({
                                width: 48,
                                height: 48,
                                centerX: 0
                            });
                            bubble.append(aa);

                            // Get the rich info.
                            that.getRichInfoFromURL(that.page.data.contentParsed[index].value, function (rich) {
                                that.page.data.richCache[that.page.data.contentParsed[index].value] = rich;
                                that.page.data.collectionView.refresh(index);
                            });

                        } else {

                            // The bubble composite.
                            obj = {
                                top: that.properties.MESSAGE_PADDING_VERTICAL / 2,
                                bottom: that.properties.MESSAGE_PADDING_VERTICAL / 2,
                                width: that.properties.MESSAGE_PADDING_HORIZONTAL + that.properties.MESSAGE_WIDTH
                            };
                            obj[side] = 0;
                            bubbleComposite = new tabris.Composite(obj);

                            // Create the actual bubble
                            obj = {};
                            obj[side] = that.properties.MESSAGE_PADDING_HORIZONTAL;
                            obj[antiSide] = 0;
                            bubble = new tabris.Composite(obj);
                            bubble.set({
                                id: "bubble",
                                background: that.properties["MESSAGE_COLOR_" + msgType],
                                cornerRadius: that.properties.BUBBLE_CORNER_RADIUS
                            });

                            // Handle taps to the bubble.
                            bubble.on("tap", function () {

                                // If an image is defined but a link isn't...
                                if (!that.page.data.richCache[that.page.data.contentParsed[index].value].href && that.page.data.richCache[that.page.data.contentParsed[index].value].image) {
                                    that.gotoImageView(that.page.data.richCache[that.page.data.contentParsed[index].value].image);

                                    // If a link is defined.
                                } else if (that.page.data.richCache[that.page.data.contentParsed[index].value].href) {
                                    that.gotoWebView(that.page.data.richCache[that.page.data.contentParsed[index].value].href, (that.page.data.richCache[that.page.data.contentParsed[index].value].siteName ? that.page.data.richCache[that.page.data.contentParsed[index].value].siteName : that.page.data.richCache[that.page.data.contentParsed[index].value].href));
                                }
                            });

                            // Create the bubble tail.
                            obj = {
                                centerY: 0
                            };
                            obj[antiSide] = ["#bubble", -6];
                            tail = new tabris.TextView(obj);
                            tail.set({
                                textColor: that.properties["MESSAGE_COLOR_" + msgType],
                                font: that.properties.TAIL_SIZE + "px",
                                text: tailChar
                            });

                            var top = that.properties.BUBBLE_MARGIN;
                            var addImage = false,
                                addTitle = false,
                                addDescription = false;

                            // Add a page and site title if applicable.
                            if (that.page.data.richCache[that.page.data.contentParsed[index].value].title || that.page.data.richCache[that.page.data.contentParsed[index].value].siteName) {
                                title = new tabris.TextView({
                                    left: that.properties.BUBBLE_MARGIN,
                                    right: that.properties.BUBBLE_MARGIN,
                                    top: top
                                });
                                title.set({
                                    id: "title",
                                    maxLines: 2,
                                    textColor: that.properties["TEXT_COLOR_" + msgType],
                                    font: that.properties.MESSAGE_TEXT_SIZE + "px",
                                    text: (that.page.data.richCache[that.page.data.contentParsed[index].value].title ? that.page.data.richCache[that.page.data.contentParsed[index].value].title : "") +
                                        (that.page.data.richCache[that.page.data.contentParsed[index].value].title && that.page.data.richCache[that.page.data.contentParsed[index].value].siteName ? " - " : "") +
                                        (that.page.data.richCache[that.page.data.contentParsed[index].value].siteName ? that.page.data.richCache[that.page.data.contentParsed[index].value].siteName : "")
                                });
                                addTitle = true;
                                top = ["#title", that.properties.BUBBLE_MARGIN];
                            }

                            // Add an image if applicable.
                            if (that.page.data.richCache[that.page.data.contentParsed[index].value].image) {
                                image = new tabris.ImageView({
                                    top: top,
                                    left: 0,
                                    right: 0
                                });
                                image.set({
                                    id: "image",
                                    image: {
                                        src: that.page.data.richCache[that.page.data.contentParsed[index].value].image
                                    }
                                });
                                addImage = true;
                                top = ["#image", that.properties.BUBBLE_MARGIN];
                            }

                            // Add a description if applicable.
                            if (that.page.data.richCache[that.page.data.contentParsed[index].value].description) {
                                description = new tabris.TextView({
                                    top: top,
                                    left: that.properties.BUBBLE_MARGIN,
                                    right: that.properties.BUBBLE_MARGIN,
                                    bottom: that.properties.BUBBLE_MARGIN
                                });
                                description.set({
                                    id: "description",
                                    textColor: that.properties["TEXT_COLOR_" + msgType],
                                    font: that.properties.MESSAGE_TEXT_SIZE + "px",
                                    text: that.page.data.richCache[that.page.data.contentParsed[index].value].description,
                                    maxLines: 3
                                });
                                addDescription = true;
                            }

                            // Append stuff.
                            if (addTitle) {
                                bubble.append(title);
                            }
                            if (addImage) {
                                bubble.append(image);
                            }
                            if (addDescription) {
                                bubble.append(description);
                            }
                        }

                        // Append stuff.
                        bubbleComposite.append(tail);
                        bubbleComposite.append(bubble);
                        cell.append(bubbleComposite);
                        break;
                }
            }
        });

        // Create the new message zone composite.
        this.page.data.newMessageZone = new tabris.Composite({
            left: 0,
            right: 0,
            bottom: 0,
            height: this.properties.NEW_MESSAGE_ZONE_HEIGHT
        });
        this.page.data.newMessageZone.set({
            background: this.properties.NEW_MESSAGE_ZONE_COLOR
        });

        // Create an imageview for the camera.
        this.page.data.cameraIcon = new tabris.ImageView({
            left: this.properties.NEW_MESSAGE_ZONE_PADDING,
            top: this.properties.NEW_MESSAGE_ZONE_PADDING,
            bottom: this.properties.NEW_MESSAGE_ZONE_PADDING
        });
        this.page.data.cameraIcon.set({
            id: "cameraIcon",
            image: this.properties.NEW_MESSAGE_CAMERA_IMAGE
        });

        // Create an imageview for the send.
        this.page.data.sendIcon = new tabris.ImageView({
            left: ["#cameraIcon", this.properties.NEW_MESSAGE_ZONE_PADDING],
            top: this.properties.NEW_MESSAGE_ZONE_PADDING,
            bottom: this.properties.NEW_MESSAGE_ZONE_PADDING
        });
        this.page.data.sendIcon.set({
            id: "sendIcon",
            image: this.properties.NEW_MESSAGE_SEND_IMAGE
        });
        this.page.data.sendIcon.on("tap", function () {

        });

        // Create a textinput for the message.
        this.page.data.textBox = new tabris.TextInput({
            left: ["#sendIcon", this.properties.NEW_MESSAGE_ZONE_PADDING],
            top: this.properties.NEW_MESSAGE_ZONE_PADDING,
            bottom: this.properties.NEW_MESSAGE_ZONE_PADDING,
            right: this.properties.NEW_MESSAGE_ZONE_PADDING
        });
        this.page.data.textBox.set({
            autoCorrect: this.properties.NEW_MESSAGE_AUTOCORRECT,
            enterKeyType: "send",
            message: this.properties.NEW_MESSAGE_HINT,
            type: "multiline"
        });

        // Append the new message zone content to the new message zone.
        this.page.data.newMessageZone.append(this.page.data.cameraIcon);
        this.page.data.newMessageZone.append(this.page.data.sendIcon);
        this.page.data.newMessageZone.append(this.page.data.textBox);

        // Append the collection view and new message zone.
        this.page.data.collectionView.appendTo(this.page);
        this.page.data.newMessageZone.appendTo(this.page);

        // No content has been parsed yet.
        this.page.data.contentParsed = null;
    };

    // Called when the page is switched to.
    this.load = function () {

    };

    // Called when the page is switched away from.
    this.unload = function () {

    };

    // Called when the page is gone home to.
    this.homeState = function () {

        // Re-add everything.
        var cnt = this.page.data.collectionView.columnCount;
        this.page.data.collectionView.remove(0, cnt);
        this.page.data.collectionView.insert(0, cnt);
    };

    /*
        Custom functions
    */

    this.setChatName = function (name) {
        this.page.set({
            title: name
        });
    };

    this.setChatTarget = function (target) {
        this.page.data.target = target;

        // Add some dummy content.
        this.page.data.content = [{
            user: this.page.data.target,
            text: "Hi!",
            time: Date.now() - (1000 * 60 * 60 * 5)
        }, {
            user: -1,
            text: "Howdy!",
            time: Date.now() - (1000 * 60 * 60 * 4.5)
        }, {
            user: this.page.data.target,
            text: "Have you seen how the rich chat features work?",
            time: Date.now() - (1000 * 60 * 60 * 2)
        }, {
            user: -1,
            text: "Oh, you mean I can just put in a link like this one https://www.youtube.com/watch?v=60RQVz-ihi8 and it has a little card?",
            time: Date.now() - (1000 * 60 * 60 * 1.8)
        }, {
            user: this.page.data.target,
            text: "Yah! That's what it looks like. I think it's pretty cool. This is a long chat message which will span multiple lines.",
            time: Date.now() - (1000 * 60 * 60 * 1.7)
        }];

        this.addContentToCollection();
    };

    this.addContentToCollection = function () {
        this.page.data.contentParsed = [];

        var lastDate = 0;
        for (var i = 0; i < this.page.data.content.length; i++) {

            // If the difference in time is more than an hour, add a timestamp.
            if (this.page.data.content[i].time - lastDate > (1000 * 60 * 60)) {
                this.page.data.contentParsed.push({
                    type: "timestamp",
                    value: this.timeAgo(this.page.data.content[i].time)
                });
                lastDate = this.page.data.content[i].time;
            }

            // Find URLs in the message.
            var urls = [];
            var currentPos = 0;
            while (currentPos != -1) {
                currentPos = this.page.data.content[i].text.indexOf("http", currentPos);
                if (currentPos > -1) {
                    var startPos = currentPos;
                    var endPos = this.page.data.content[i].text.indexOf(" ", currentPos) - 1;
                    if (endPos < 0) {
                        endPos = this.page.data.content[i].text.length - 1;
                    }
                    currentPos++;
                    urls.push({
                        start: startPos,
                        end: endPos,
                        value: this.page.data.content[i].text.substr(startPos, (endPos - startPos) + 1)
                    });
                }
            }

            // Add the messages and rich infos.
            var currentPos = 0;
            while (currentPos != -1) {
                if (urls.length > 0 && currentPos == urls[0].start) {
                    this.page.data.contentParsed.push({
                        type: "url",
                        value: urls[0].value,
                        me: this.page.data.content[i].user != this.page.data.target
                    });
                    currentPos = (urls[0].end + 1 < this.page.data.content[i].text.length ? urls[0].end + 1 : -1);
                    urls.shift();
                } else {
                    if (urls.length <= 0) {
                        nextPos = -1;
                    } else {
                        nextPos = urls[0].start;
                    }
                    var str = this.page.data.content[i].text.substr(currentPos, ((nextPos == -1 ? this.page.data.content[i].text.length - 1 : nextPos - 1) - currentPos) + 1).trim();
                    if (str != "") {
                        this.page.data.contentParsed.push({
                            type: "text",
                            value: str,
                            me: this.page.data.content[i].user != this.page.data.target
                        });
                    }
                    currentPos = nextPos;
                }
            }
        }

        this.page.data.collectionView.load(this.page.data.contentParsed.length);
    };

    this.getRichInfoFromURL = function (url, fn) {

        if (!(url.endsWith(".png") || url.endsWith(".gif") || url.endsWith(".jpeg") || url.endsWith(".jpg") || url.endsWith(".svg"))) {
            fetch("http://opengraph.io/api/1.0/site/" + encodeURIComponent(url) + "?app_id=" + this.properties.OPENGRAPH_API_KEY).then(function (response) {
                return response.json();
            }).then(function (json) {
                return {
                    title: json.hybridGraph.title,
                    siteName: json.hybridGraph.site_name,
                    description: json.hybridGraph.description,
                    image: json.hybridGraph.image,
                    href: json.hybridGraph.url
                };
            }).then(function (obj) {
                fn(obj);
            });
        } else {
            fn({
                image: url
            });
        }
    };

    this.timeAgo = function (date) {
        var seconds = Math.floor((new Date() - date) / 1000);
        var interval = Math.floor(seconds / 31536000);
        if (interval > 1) {
            return interval + " years ago";
        }
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
            return interval + " months ago";
        }
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
            return interval + " days ago";
        }
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
            return interval + " hours ago";
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
            return interval + " minutes ago";
        }
        return Math.floor(seconds) + " seconds ago";
    };

    this.gotoWebView = function (url, title) {

        // Create a web page, initiate its UI, set the target, etc.
        var page = new this.tab.app.PageWeb();
        page.initiateUI(this.tab);
        page.setTitle(title);
        page.setTarget(url);
        this.tab.navigationView.append(page.page);
    };

    this.gotoImageView = function (image) {

        // Create a image page, initiate its UI, set the target, etc.
        var page = new this.tab.app.PageImage();
        page.initiateUI(this.tab);
        page.setTarget(image);
        this.tab.navigationView.append(page.page);
    };

};

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
        MESSAGE_PADDING_VERTICAL: 8,
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
            src: _i("resources/images/msg_photo.png")
        },
        NEW_MESSAGE_SEND_IMAGE: {
            src: _i("resources/images/msg_send.png")
        },
        NEW_MESSAGE_AUTOCORRECT: true,
        NEW_MESSAGE_HINT: "Message",
        LOAD_SIZE: 25
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
        this.page.data.scrollView = new tabris.ScrollView({
            top: 0,
            bottom: this.properties.NEW_MESSAGE_ZONE_HEIGHT,
            left: 0,
            right: 0
        });
        this.page.data.loadMoreButton = new tabris.Button({
            top: this.properties.MESSAGE_PADDING_VERTICAL / 2,
            centerX: 0
        });
        this.page.data.loadMoreButton.set({
            id: "loadMore",
            text: "Load More"
        });
        this.page.data.scrollView.append(this.page.data.loadMoreButton);

        // Poll for new messages.
        this.page.data.pollInterval = setInterval(function () {
            that.pollMessages();
        }, 1000 * 10);
        this.page.on("dispose", function () {
            clearInterval(that.page.data.pollInterval);
        });

        // The top composite.
        this.page.data.topComposite = null;

        // The bottom composite.
        this.page.data.bottomComposite = null;

        // The last message id.
        this.page.data.lastMessageId = -1;

        // The first message id.
        this.page.data.firstMessageId = null;

        // Whether messages are currently being loaded.
        this.page.data.loadingMessages = false;

        // The target of the conversation.
        this.page.data.target = null;
        this.page.data.venture = null;

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
            that.sendContent();
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
        this.page.data.textBox.on("accept", function () {
            that.sendContent();
        });

        // Append the new message zone content to the new message zone.
        this.page.data.newMessageZone.append(this.page.data.cameraIcon);
        this.page.data.newMessageZone.append(this.page.data.sendIcon);
        this.page.data.newMessageZone.append(this.page.data.textBox);

        // Append the scroll view and new message zone.
        this.page.data.scrollView.appendTo(this.page);
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

        // TODO: Nothing for now.
    };

    /*
        Custom functions
    */

    this.pollMessages = function () {
        var that = this;

        // If the target has been defined and more content is not being loaded.
        if (this.page.data.target && this.page.data.venture && !this.page.data.loadingMessages) {

            this.tab.app.apiCall("users/" + this.tab.app.user + "/messages/" + this.page.data.target + "/" + this.page.data.venture + "/poll?token=" + this.tab.app.token + "&last=" + this.page.data.lastMessageId, "GET").then(function (resData, status) {
                if (status == 200) {
                    if (resData.length > 0) {

                        // Reverse array contents.
                        resData.reverse();

                        // Update the last message id and add the content to the collection.
                        if (!that.page.data.firstMessageId) {
                            that.page.data.firstMessageId = resData[0].id;
                        }
                        that.page.data.lastMessageId = resData[resData.length - 1].id;
                        that.addContentToCollection(resData, 1);

                    }
                }
            });

            this.tab.app.apiCall("users/" + this.tab.app.user + "/messages/" + this.page.data.target + "/" + this.page.data.venture + "/readall?token=" + this.tab.app.token, "POST");
        }
    };

    this.loadMoreMessages = function () {

        // Messages are loading.
        this.loadingMessages = true;

        // Get rid of the load more button.
        this.page.data.loadMoreButton.dispose();

        // Replace it with an activity indiactor.
        this.page.data.loadMoreAA = new tabris.ActivityIndicator({
            top: this.properties.MESSAGE_PADDING_VERTICAL / 2,
            centerX: 0
        });
        this.page.data.loadMoreAA.set({
            id: "loadMore"
        });
        this.page.data.scrollView.append(this.page.data.loadMoreAA);

        // Perform the XHR
        this.tab.app.apiCall("users/" + this.tab.app.user + "/messages/" + this.page.data.target + "/" + this.page.data.venture + "/contents?token=" + this.tab.app.token + "&offset=" + (this.page.firstMessageId != null ? this.page.firstMessageId : -1) + "&count=" + this.properties.LOAD_SIZE, "GET").then(function (resData, status) {
            if (status == 200) {
                if (resData.length > 0) {
                    // Reverse array contents.
                    resData.reverse();

                    // Update the first and last message ids.
                    that.page.data.firstMessageId = resData[0].id;
                    that.page.data.lastMessageId = Math.max(that.page.data.lastMessageId, resData[resData.length - 1].id);
                    that.addContentToCollection(resData, -1);

                    // No longer loading messages.
                    that.page.data.loadingMessages = false;
                }

                // Get rid of the load more aa.
                that.page.data.loadMoreAA.dispose();

                if (resData.length >= that.properties.LOAD_SIZE) {
                    // Replace it with a load more button.
                    that.page.data.loadMoreButton = new tabris.Button({
                        top: that.properties.MESSAGE_PADDING_VERTICAL / 2,
                        centerX: 0
                    });
                    that.page.data.loadMoreButton.set({
                        id: "loadMore",
                        text: "Load More"
                    });
                    that.page.data.scrollView.append(that.page.data.loadMoreButton);
                }
            }
        });

        // All the messages have been read.
        this.tab.app.apiCall("users/" + this.tab.app.user + "/messages/" + this.page.data.target + "/" + this.page.data.venture + "/readall?token=" + this.tab.app.token, "POST");
    };

    this.setChatName = function (name) {
        this.page.set({
            title: name
        });
    };

    this.setChatTarget = function (target, venture) {
        this.page.data.target = target;
        this.page.data.venture = venture;

        this.loadMoreMessages();
    };

    this.addContentToCollection = function (content, dir) {
        if (content.length > 0) {
            var contentParsed = [];

            var lastDate = 0;
            for (var i = 0; i < content.length; i++) {

                // If the difference in time is more than an hour, add a timestamp.
                if (content[i].time - lastDate > (1000 * 60 * 60)) {
                    contentParsed.push({
                        type: "timestamp",
                        value: this.timeAgo(content[i].time)
                    });
                    lastDate = content[i].time;
                }

                // Find URLs in the message.
                var urls = [];
                var currentPos = 0;
                while (currentPos != -1) {
                    currentPos = content[i].text.indexOf("http", currentPos);
                    if (currentPos > -1) {
                        var startPos = currentPos;
                        var endPos = content[i].text.indexOf(" ", currentPos) - 1;
                        if (endPos < 0) {
                            endPos = content[i].text.length - 1;
                        }
                        currentPos++;
                        urls.push({
                            start: startPos,
                            end: endPos,
                            value: content[i].text.substr(startPos, (endPos - startPos) + 1)
                        });
                    }
                }

                // Add the messages and rich infos.
                var currentPos = 0;
                while (currentPos != -1) {
                    if (urls.length > 0 && currentPos == urls[0].start) {
                        contentParsed.push({
                            type: "url",
                            value: urls[0].value,
                            me: content[i].user != this.page.data.target
                        });
                        currentPos = (urls[0].end + 1 < content[i].text.length ? urls[0].end + 1 : -1);
                        urls.shift();
                    } else {
                        if (urls.length <= 0) {
                            nextPos = -1;
                        } else {
                            nextPos = urls[0].start;
                        }
                        var str = content[i].text.substr(currentPos, ((nextPos == -1 ? content[i].text.length - 1 : nextPos - 1) - currentPos) + 1).trim();
                        if (str != "") {
                            contentParsed.push({
                                type: "text",
                                value: str,
                                me: content[i].user != this.page.data.target
                            });
                        }
                        currentPos = nextPos;
                    }
                }
            }

            // If the messages are being appended to the top of the page.
            if (dir == -1) {
                var cidCurrent = null;
                var cell, firstCell;
                for (var i = 0; i < contentParsed.length; i++) {
                    cell = new tabris.Composite({
                        left: 0,
                        right: 0,
                        top: (cidCurrent != null) ? ["#" + cidCurrent, this.properties.MESSAGE_PADDING_VERTICAL] : ["#loadMore", this.properties.MESSAGE_PADDING_VERTICAL]
                    });
                    if (i == 0) {
                        firstCell = cell;
                    }
                    cell.set({
                        id: cell.cid
                    });
                    cidCurrent = cell.cid;
                    this.setCellContent(contentParsed[i], cell);
                    this.page.data.scrollView.append(cell);
                }
                if (this.page.data.topComposite != null) {
                    this.page.data.topComposite.set({
                        top: ["#" + cidCurrent, this.properties.MESSAGE_PADDING_VERTICAL]
                    });
                }

                // If the bottom cell is undefined, set the last cell as the bottom cell.
                if (this.page.data.bottomComposite == null) {
                    this.page.data.bottomComposite = cell;
                }

                // Set the top composite to the first cell.
                this.page.data.topComposite = firstCell;
            } else {
                // Otherwise, if the messages are being appended to the bottom of the page.

                var cidCurrent = null;
                var cell, firstCell;
                for (var i = 0; i < contentParsed.length; i++) {
                    cell = new tabris.Composite({
                        left: 0,
                        right: 0,
                        top: (cidCurrent != null) ? ["#" + cidCurrent, this.properties.MESSAGE_PADDING_VERTICAL] : (this.page.data.bottomComposite != null ? ["#" + this.page.data.bottomComposite.cid, this.properties.MESSAGE_PADDING_VERTICAL] : ["#loadMore", this.properties.MESSAGE_PADDING_VERTICAL])
                    });
                    if (i == 0) {
                        firstCell = cell;
                    }
                    cell.set({
                        id: cell.cid
                    });
                    cidCurrent = cell.cid;
                    this.setCellContent(contentParsed[i], cell);
                    this.page.data.scrollView.append(cell);
                }

                // If the bottom cell is undefined, set the last cell as the bottom cell.
                if (this.page.data.topComposite == null) {
                    this.page.data.topComposite = firstCell;
                }

                // Set the bottom composite to the last cell.
                this.page.data.bottomComposite = cell;
            }
        }
    };

    this.setCellContent = function (content, cell) {

        // Dispose of all the previous contents.
        cell.find().dispose();

        switch (content.type) {
            case "timestamp":
                var timestampView = new tabris.TextView({
                    top: that.properties.MESSAGE_PADDING_VERTICAL / 2,
                    centerX: 0,
                    bottom: that.properties.MESSAGE_PADDING_VERTICAL / 2
                });
                timestampView.set({
                    text: content.value,
                    maxLines: 1,
                    font: that.properties.TIMESTAMP_SIZE + "px",
                    textColor: that.properties.TIMESTAMP_COLOR
                });
                cell.append(timestampView);
                break;

            case "text":
                var bubbleComposite, bubble, message, tail;
                var msgType, side, antiSide, obj, tailChar;
                if (content.me) {
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
                    text: content.value
                });
                bubble.append(message);
                bubbleComposite.append(tail);
                bubbleComposite.append(bubble);
                cell.append(bubbleComposite);
                break;

            case "url":
                var bubbleComposite, bubble, title, description, image, aa, tail;
                var msgType, side, antiSide, obj, tailChar;
                if (content.me) {
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
                if (!that.page.data.richCache[content.value]) {

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
                    that.getRichInfoFromURL(content.value, function (rich) {
                        that.page.data.richCache[content.value] = rich;
                        that.setCellContent(content, cell);
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
                        if (!that.page.data.richCache[content.value].href && that.page.data.richCache[content.value].image) {
                            that.gotoImageView(that.page.data.richCache[content.value].image);

                            // If a link is defined.
                        } else if (that.page.data.richCache[content.value].href) {
                            that.gotoWebView(that.page.data.richCache[content.value].href, (that.page.data.richCache[content.value].siteName ? that.page.data.richCache[content.value].siteName : that.page.data.richCache[content.value].href));
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
                    if (that.page.data.richCache[content.value].title || that.page.data.richCache[content.value].siteName) {
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
                            text: (that.page.data.richCache[content.value].title ? that.page.data.richCache[content.value].title : "") +
                                (that.page.data.richCache[content.value].title && that.page.data.richCache[content.value].siteName ? " - " : "") +
                                (that.page.data.richCache[content.value].siteName ? that.page.data.richCache[content.value].siteName : "")
                        });
                        addTitle = true;
                        top = ["#title", that.properties.BUBBLE_MARGIN];
                    }

                    // Add an image if applicable.
                    if (that.page.data.richCache[content.value].image) {
                        image = new tabris.ImageView({
                            top: top,
                            left: 0,
                            right: 0
                        });
                        image.set({
                            id: "image",
                            image: {
                                src: that.page.data.richCache[content.value].image
                            }
                        });
                        addImage = true;
                        top = ["#image", that.properties.BUBBLE_MARGIN];
                    }

                    // Add a description if applicable.
                    if (that.page.data.richCache[content.value].description) {
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
                            text: that.page.data.richCache[content.value].description,
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
    };

    this.getRichInfoFromURL = function (url, fn) {

        if (!(url.endsWith(".png") || url.endsWith(".gif") || url.endsWith(".jpeg") || url.endsWith(".jpg") || url.endsWith(".svg"))) {
            fetch("https://opengraph.io/api/1.0/site/" + encodeURIComponent(url) + "?app_id=" + this.properties.OPENGRAPH_API_KEY).then(function (response) {
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

    this.sendContent = function () {
        if (this.page.data.textBox.text != "") {
            
            // If the text box is not empty, send the message.
            this.tab.app.apiCall("users/" + this.tab.app.user + "/messages/" + this.page.data.target + "/" + this.page.data.venture + "?token=" + this.tab.app.token, "POST", {
                str: this.page.data.textBox.text
            });
            this.page.data.textBox.text = "";
            this.page.data.textBox.focused = false;
            this.pollMessages();
        }
    };

};

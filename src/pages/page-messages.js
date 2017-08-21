module.exports = function () {

    // That is this.
    var that = this;

    // Properties are used for reference.
    this.properties = {
        PAGE_NAME: "Messages",
        PAGE_ID: "messages",
        VERTICAL_CELL_PADDING: 8,
        HORIZONTAL_CELL_PADDING: 12,
        CELL_HEIGHT: 96,
        IMAGE_SIZE: 64,
        NEW_MESSAGES_SIZE: 32,
        NAME_TEXT_HEIGHT: 32,
        LAST_MESSAGE_HEIGHT: 20,
        LAST_TIME_HEIGHT: 20,
        MIDDLE_TEXT_PADDING: 8,
        NEW_MESSAGES_CIRCLE_COLOR: "#FF0000",
        NEW_MESSAGES_NUMBER_COLOR: "#FFFFFF",
        NAME_TEXT_COLOR: "#000000",
        LAST_MESSAGE_COLOR: "#000000",
        LAST_TIME_COLOR: "#606060",
        MESSAGES_HR_HEIGHT: 1,
        MESSAGES_HR_COLOR: "#C0C0C0",
        MESSAGES_CELL_BACKGROUND: "#FFFFFF",
        HELD_BACKGROUND: "#E0E0E0",
        NO_MESSAGES_COLOR: "#404040",
        NO_MESSAGES_SIZE: 32,
        NO_MESSAGES_TEXT: "No Conversations"
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
    };

    // Called when the page is switched to.
    this.load = function () {

        // Conversations have not been loaded yet.
        this.page.data.conversationsLoaded = false;

        // Create an activity indicator.
        this.page.data.activityIndicator = new tabris.ActivityIndicator({
            centerX: 0,
            top: 8
        });
        this.page.data.activityIndicator.appendTo(this.page);

        // Refresh the messages.
        // this.refreshMessages();

        /*
            DELETE WHAT COMES AFTER HERE
        */

        this.page.data.conversations = {
            id: 1,
            name: "John Smith",
            target: 1,
            venture: "DealMake App",
            ventureId: 1,
            lastMessage: "Any updates?",
            unreadMessages: 1,
            lastMessageTime: Date.now() - 10000,
            profile: {
                src: "data:image/jpeg;base64,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"
            }
        };

        var that = this;

        // Create a new collection view and append it.
        that.page.data.collectionView = new tabris.CollectionView({
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            refreshEnabled: true,
            itemCount: that.page.data.conversations.length + 1,
            createCell: function () {

                // Create the cell composite.
                var cell = new tabris.Composite({
                    height: that.properties.CELL_HEIGHT + that.properties.MESSAGES_HR_HEIGHT,
                    left: 0,
                    right: 0
                });

                // Create the main composite.
                var main = new tabris.Composite({
                    height: that.properties.CELL_HEIGHT,
                    left: 0,
                    right: 0,
                    top: 0
                });
                main.set({
                    id: "main",
                    background: that.properties.MESSAGES_CELL_BACKGROUND
                });
                main.appendTo(cell);

                // Create the profile image.
                var profile = new tabris.ImageView({
                    top: (that.properties.CELL_HEIGHT - that.properties.IMAGE_SIZE) / 2,
                    left: that.properties.HORIZONTAL_CELL_PADDING,
                    width: that.properties.IMAGE_SIZE,
                    height: that.properties.IMAGE_SIZE
                });
                profile.set({
                    id: "profile",
                    cornerRadius: that.properties.IMAGE_SIZE / 2
                });
                profile.appendTo(main);

                // Create the display name.
                var name = new tabris.TextView({
                    top: that.properties.VERTICAL_CELL_PADDING,
                    left: that.properties.HORIZONTAL_CELL_PADDING + that.properties.IMAGE_SIZE + that.properties.MIDDLE_TEXT_PADDING,
                    right: that.properties.MIDDLE_TEXT_PADDING + that.properties.NEW_MESSAGES_SIZE + that.properties.HORIZONTAL_CELL_PADDING,
                    height: that.properties.NAME_TEXT_HEIGHT
                });
                name.set({
                    id: "name",
                    maxLines: 1,
                    textColor: that.properties.NAME_TEXT_COLOR,
                    font: Math.floor(that.properties.NAME_TEXT_HEIGHT / 1.2) + "px"
                });
                name.appendTo(main);

                // Create the last message.
                var last = new tabris.TextView({
                    top: that.properties.VERTICAL_CELL_PADDING + that.properties.NAME_TEXT_HEIGHT + ((that.properties.CELL_HEIGHT - ((that.properties.VERTICAL_CELL_PADDING * 2) + that.properties.NAME_TEXT_HEIGHT + that.properties.LAST_MESSAGE_HEIGHT + that.properties.LAST_TIME_HEIGHT)) / 2),
                    left: that.properties.HORIZONTAL_CELL_PADDING + that.properties.IMAGE_SIZE + that.properties.MIDDLE_TEXT_PADDING,
                    right: that.properties.MIDDLE_TEXT_PADDING + that.properties.NEW_MESSAGES_SIZE + that.properties.HORIZONTAL_CELL_PADDING,
                    height: that.properties.LAST_MESSAGE_HEIGHT
                });
                last.set({
                    id: "last",
                    maxLines: 1,
                    textColor: that.properties.LAST_MESSAGE_COLOR,
                    font: Math.floor(that.properties.LAST_MESSAGE_HEIGHT / 1.2) + "px"
                });
                last.appendTo(main);

                // Create the last message time.
                var time = new tabris.TextView({
                    top: that.properties.VERTICAL_CELL_PADDING + that.properties.NAME_TEXT_HEIGHT + that.properties.LAST_MESSAGE_HEIGHT + (that.properties.CELL_HEIGHT - ((that.properties.VERTICAL_CELL_PADDING * 2) + that.properties.NAME_TEXT_HEIGHT + that.properties.LAST_MESSAGE_HEIGHT + that.properties.LAST_TIME_HEIGHT)),
                    left: that.properties.HORIZONTAL_CELL_PADDING + that.properties.IMAGE_SIZE + that.properties.MIDDLE_TEXT_PADDING,
                    right: that.properties.MIDDLE_TEXT_PADDING + that.properties.NEW_MESSAGES_SIZE + that.properties.HORIZONTAL_CELL_PADDING,
                    height: that.properties.LAST_TIME_HEIGHT
                });
                time.set({
                    id: "time",
                    maxLines: 1,
                    textColor: that.properties.LAST_TIME_COLOR,
                    font: Math.floor(that.properties.LAST_TIME_HEIGHT / 1.2) + "px"
                });
                time.appendTo(main);

                // Create the count
                var count = new tabris.TextView({
                    top: (that.properties.CELL_HEIGHT - that.properties.NEW_MESSAGES_SIZE) / 2,
                    right: that.properties.HORIZONTAL_CELL_PADDING,
                    height: that.properties.NEW_MESSAGES_SIZE,
                    width: that.properties.NEW_MESSAGES_SIZE
                });
                count.set({
                    id: "count",
                    background: that.properties.NEW_MESSAGES_CIRCLE_COLOR,
                    textColor: that.properties.NEW_MESSAGES_NUMBER_COLOR,
                    cornerRadius: that.properties.NEW_MESSAGES_SIZE / 2,
                    alignment: "center",
                    font: Math.floor(that.properties.NEW_MESSAGES_SIZE / 1.2) + "px"
                });
                count.appendTo(main);

                // Create the horizontal rule.
                var hrBottom = new tabris.Composite({
                    height: that.properties.MESSAGES_HR_HEIGHT,
                    left: 0,
                    right: 0,
                    bottom: 0
                });
                hrBottom.set({
                    background: that.properties.MESSAGES_HR_COLOR
                });
                hrBottom.appendTo(cell);

                return cell;
            },
            updateCell: function (cell, index) {
                if (index <= 0) {

                    // The top horizontal rule.
                    cell.find("#main").dispose();
                    cell.set({
                        height: that.properties.MESSAGES_HR_HEIGHT
                    });

                } else {

                    // Add the data to the widgets.
                    cell.find("#main").find("#profile").set({
                        image: that.page.data.conversations[index - 1].profile
                    });
                    cell.find("#main").find("#name").set({
                        text: that.page.data.conversations[index - 1].name
                    });
                    cell.find("#main").find("#last").set({
                        text: that.page.data.conversations[index - 1].lastMessage
                    });
                    cell.find("#main").find("#time").set({
                        text: that.timeAgo(that.page.data.conversations[index - 1].lastMessageTime)
                    });
                    cell.find("#main").find("#count").set({
                        text: that.page.data.conversations[index - 1].unreadMessages.toString(),
                        visible: that.page.data.conversations[index - 1].unreadMessages !== 0
                    });

                    // Darken the cell when it is held.
                    /*
                    cell.find("#main").on("touchStart", function () {
                        this.set({background: that.properties.HELD_BACKGROUND});
                    });
                    cell.find("#main").on("touchEnd", function () {
                        this.set({background: that.properties.MESSAGES_CELL_BACKGROUND});
                    });
                    cell.find("#main").on("touchCancel", function () {
                        this.set({background: that.properties.MESSAGES_CELL_BACKGROUND});
                    });
                    */

                    // Listen for a tap and send the user to the chat page.
                    cell.find("#main").on("tap", function () {
                        // Create a chat page, initiate its UI, set the target and .
                        var page = new that.tab.app.PageChat();
                        page.initiateUI(that.tab);
                        page.setChatName(that.page.data.conversations[index - 1].name);
                        page.setChatTarget(that.page.data.conversations[index - 1].target, that.page.data.conversations[index - 1].ventureId);
                        that.tab.navigationView.append(page.page);
                    });
                }
            }
        });

        // Handle refresh.
        that.page.data.collectionView.on("refresh", function () {
            that.refreshMessages();
        });

        that.page.data.collectionView.appendTo(that.page);

        // Dispose of the activity indicator.
        that.page.data.activityIndicator.dispose();

        that.page.data.conversationsLoaded = true;
    };

    // Called when the page is switched away from.
    this.unload = function () {
        this.page.data.collectionView.dispose();

    };

    // Called when the page is gone home to.
    this.homeState = function () {
        // Nothing for now
    };

    /*
        Unique functions.
    */
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

    this.refreshMessages = function () {
        var that = this;

        this.tab.app.apiCall("users/" + that.tab.app.user + "/messageindex?token=" + that.tab.app.token, "GET").then(function (res) {
            if (res.status == 200) {
                that.page.data.conversations = [];

                for (var i = 0; i < res.data.messages.length; i++) {
                    that.page.data.conversations.push({
                        id: res.data.messages[i].id,
                        name: res.data.users[res.data.messages[i].user].name,
                        target: res.data.messages[i].user,
                        venture: res.data.ventures[res.data.messages[i].venture].name,
                        ventureId: res.data.messages[i].venture,
                        lastMessage: res.data.messages[i].lastMessage,
                        unreadMessages: res.data.messages[i].unreadMessages,
                        lastMessageTime: res.data.messages[i].lastMessageTime,
                        profile: {
                            src: res.data.users[res.data.messages[i].user].profile
                        }
                    });
                }

                if (!that.tab.app.isVC) {
                    that.page.data.conversations.sort(function (a, b) {
                        if (a.venture == b.venture) {
                            return b.lastMessageTime - a.lastMessageTime;
                        } else {
                            return a.venture.toLowerCase().localeCompare(b.venture.toLowerCase());
                        }
                    });
                } else {
                    that.page.data.conversations.sort(function (a, b) {
                        return b.lastMessageTime - a.lastMessageTime;
                    });
                }

                if (!that.page.data.conversationsLoaded) {

                    // Create a new collection view and append it.
                    that.page.data.collectionView = new tabris.CollectionView({
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        refreshEnabled: true,
                        itemCount: that.page.data.conversations.length + 1,
                        createCell: function () {

                            // Create the cell composite.
                            var cell = new tabris.Composite({
                                height: that.properties.CELL_HEIGHT + that.properties.MESSAGES_HR_HEIGHT,
                                left: 0,
                                right: 0
                            });

                            // Create the main composite.
                            var main = new tabris.Composite({
                                height: that.properties.CELL_HEIGHT,
                                left: 0,
                                right: 0,
                                top: 0
                            });
                            main.set({
                                id: "main",
                                background: that.properties.MESSAGES_CELL_BACKGROUND
                            });
                            main.appendTo(cell);

                            // Create the profile image.
                            var profile = new tabris.ImageView({
                                top: (that.properties.CELL_HEIGHT - that.properties.IMAGE_SIZE) / 2,
                                left: that.properties.HORIZONTAL_CELL_PADDING,
                                width: that.properties.IMAGE_SIZE,
                                height: that.properties.IMAGE_SIZE
                            });
                            profile.set({
                                id: "profile",
                                cornerRadius: that.properties.IMAGE_SIZE / 2
                            });
                            profile.appendTo(main);

                            // Create the display name.
                            var name = new tabris.TextView({
                                top: that.properties.VERTICAL_CELL_PADDING,
                                left: that.properties.HORIZONTAL_CELL_PADDING + that.properties.IMAGE_SIZE + that.properties.MIDDLE_TEXT_PADDING,
                                right: that.properties.MIDDLE_TEXT_PADDING + that.properties.NEW_MESSAGES_SIZE + that.properties.HORIZONTAL_CELL_PADDING,
                                height: that.properties.NAME_TEXT_HEIGHT
                            });
                            name.set({
                                id: "name",
                                maxLines: 1,
                                textColor: that.properties.NAME_TEXT_COLOR,
                                font: Math.floor(that.properties.NAME_TEXT_HEIGHT / 1.2) + "px"
                            });
                            name.appendTo(main);

                            // Create the last message.
                            var last = new tabris.TextView({
                                top: that.properties.VERTICAL_CELL_PADDING + that.properties.NAME_TEXT_HEIGHT + ((that.properties.CELL_HEIGHT - ((that.properties.VERTICAL_CELL_PADDING * 2) + that.properties.NAME_TEXT_HEIGHT + that.properties.LAST_MESSAGE_HEIGHT + that.properties.LAST_TIME_HEIGHT)) / 2),
                                left: that.properties.HORIZONTAL_CELL_PADDING + that.properties.IMAGE_SIZE + that.properties.MIDDLE_TEXT_PADDING,
                                right: that.properties.MIDDLE_TEXT_PADDING + that.properties.NEW_MESSAGES_SIZE + that.properties.HORIZONTAL_CELL_PADDING,
                                height: that.properties.LAST_MESSAGE_HEIGHT
                            });
                            last.set({
                                id: "last",
                                maxLines: 1,
                                textColor: that.properties.LAST_MESSAGE_COLOR,
                                font: Math.floor(that.properties.LAST_MESSAGE_HEIGHT / 1.2) + "px"
                            });
                            last.appendTo(main);

                            // Create the last message time.
                            var time = new tabris.TextView({
                                top: that.properties.VERTICAL_CELL_PADDING + that.properties.NAME_TEXT_HEIGHT + that.properties.LAST_MESSAGE_HEIGHT + (that.properties.CELL_HEIGHT - ((that.properties.VERTICAL_CELL_PADDING * 2) + that.properties.NAME_TEXT_HEIGHT + that.properties.LAST_MESSAGE_HEIGHT + that.properties.LAST_TIME_HEIGHT)),
                                left: that.properties.HORIZONTAL_CELL_PADDING + that.properties.IMAGE_SIZE + that.properties.MIDDLE_TEXT_PADDING,
                                right: that.properties.MIDDLE_TEXT_PADDING + that.properties.NEW_MESSAGES_SIZE + that.properties.HORIZONTAL_CELL_PADDING,
                                height: that.properties.LAST_TIME_HEIGHT
                            });
                            time.set({
                                id: "time",
                                maxLines: 1,
                                textColor: that.properties.LAST_TIME_COLOR,
                                font: Math.floor(that.properties.LAST_TIME_HEIGHT / 1.2) + "px"
                            });
                            time.appendTo(main);

                            // Create the count
                            var count = new tabris.TextView({
                                top: (that.properties.CELL_HEIGHT - that.properties.NEW_MESSAGES_SIZE) / 2,
                                right: that.properties.HORIZONTAL_CELL_PADDING,
                                height: that.properties.NEW_MESSAGES_SIZE,
                                width: that.properties.NEW_MESSAGES_SIZE
                            });
                            count.set({
                                id: "count",
                                background: that.properties.NEW_MESSAGES_CIRCLE_COLOR,
                                textColor: that.properties.NEW_MESSAGES_NUMBER_COLOR,
                                cornerRadius: that.properties.NEW_MESSAGES_SIZE / 2,
                                alignment: "center",
                                font: Math.floor(that.properties.NEW_MESSAGES_SIZE / 1.2) + "px"
                            });
                            count.appendTo(main);

                            // Create the horizontal rule.
                            var hrBottom = new tabris.Composite({
                                height: that.properties.MESSAGES_HR_HEIGHT,
                                left: 0,
                                right: 0,
                                bottom: 0
                            });
                            hrBottom.set({
                                background: that.properties.MESSAGES_HR_COLOR
                            });
                            hrBottom.appendTo(cell);

                            return cell;
                        },
                        updateCell: function (cell, index) {
                            if (index <= 0) {

                                // The top horizontal rule.
                                cell.find("#main").dispose();
                                cell.set({
                                    height: that.properties.MESSAGES_HR_HEIGHT
                                });

                            } else {

                                // Add the data to the widgets.
                                cell.find("#main").find("#profile").set({
                                    image: that.page.data.conversations[index - 1].profile
                                });
                                cell.find("#main").find("#name").set({
                                    text: that.page.data.conversations[index - 1].name
                                });
                                cell.find("#main").find("#last").set({
                                    text: that.page.data.conversations[index - 1].lastMessage
                                });
                                cell.find("#main").find("#time").set({
                                    text: that.timeAgo(that.page.data.conversations[index - 1].lastMessageTime)
                                });
                                cell.find("#main").find("#count").set({
                                    text: that.page.data.conversations[index - 1].unreadMessages.toString(),
                                    visible: that.page.data.conversations[index - 1].unreadMessages !== 0
                                });

                                // Darken the cell when it is held.
                                /*
                                cell.find("#main").on("touchStart", function () {
                                    this.set({background: that.properties.HELD_BACKGROUND});
                                });
                                cell.find("#main").on("touchEnd", function () {
                                    this.set({background: that.properties.MESSAGES_CELL_BACKGROUND});
                                });
                                cell.find("#main").on("touchCancel", function () {
                                    this.set({background: that.properties.MESSAGES_CELL_BACKGROUND});
                                });
                                */

                                // Listen for a tap and send the user to the chat page.
                                cell.find("#main").on("tap", function () {
                                    // Create a chat page, initiate its UI, set the target and .
                                    var page = new that.tab.app.PageChat();
                                    page.initiateUI(that.tab);
                                    page.setChatName(that.page.data.conversations[index - 1].name);
                                    page.setChatTarget(that.page.data.conversations[index - 1].target, that.page.data.conversations[index - 1].ventureId);
                                    that.tab.navigationView.append(page.page);
                                });
                            }
                        }
                    });

                    // Handle refresh.
                    that.page.data.collectionView.on("refresh", function () {
                        that.refreshMessages();
                    });

                    that.page.data.collectionView.appendTo(that.page);

                    // Dispose of the activity indicator.
                    that.page.data.activityIndicator.dispose();

                    that.page.data.conversationsLoaded = true;
                } else {
                    that.page.data.collectionView.refreshIndicator = false;
                    that.page.data.collectionView.remove(that.page.data.collectionView.itemCount);
                    that.page.data.collectionView.load(that.page.data.conversations.length);
                }

            }
        });
    };

};

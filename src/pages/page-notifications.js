module.exports = function () {

    // That is this.
    var that = this;

    // Properties are used for reference.
    this.properties = {
        PAGE_NAME: "Notifications",
        PAGE_ID: "notifications",
        VERTICAL_CELL_PADDING: 8,
        HORIZONTAL_CELL_PADDING: 12,
        IMAGE_SIZE: 48,
        TITLE_HEIGHT: 24,
        TAG_SIZE: 18,
        TIME_HEIGHT: 20,
        MIDDLE_TEXT_PADDING: 8,
        TITLE_COLOR: "#000000",
        TAG_COLOR: "#000000",
        TIME_COLOR: "#606060",
        NOTIFICATIONS_HR_HEIGHT: 1,
        NOTIFICATIONS_HR_COLOR: "#C0C0C0",
        UNVIEWED_BACKGROUND: "#FFFFFF",
        VIEWED_BACKGROUND: "#E0E0E0",
        VIEWED_OPACITY: 0.5,
        ACTION_INDEX: [
            function (options) {
                // Go to the chat page.
                var page = new that.tab.app.PageChat();
                page.initiateUI(that.tab);
                page.setChatName(options.name);
                page.setChatTarget(options.target, options.venture);
                that.tab.navigationView.append(page.page);
            },
        ]
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

        // Set up a reference to this.
        this.page.data.myPage = this;
    };

    // Called when the page is switched to.
    this.load = function () {
        var that = this;

        // Create and append an activity indicator.
        this.page.data.activityIndicator = new tabris.ActivityIndicator({
            centerX: 0,
            top: 8
        });
        this.page.data.activityIndicator.appendTo(this.page);

        // Notifications have not been loaded.
        this.page.data.notificationsLoaded = false;

        // Create the notification array.
        this.page.data.notifications = [];

        // Load the notifications.
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                var resData = JSON.parse(this.responseText);
                if (this.status == 200) {

                    // Dispose of the activity indicator.
                    that.page.data.activityIndicator.dispose();

                    that.page.data.notifications = resData;

                    // Create a new collection view and append it.
                    that.page.data.collectionView = new tabris.CollectionView({
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        refreshEnabled: true,
                        itemCount: that.page.data.notifications.length + 1,
                        createCell: function () {

                            // Create the cell composite.
                            var cell = new tabris.Composite({
                                left: 0,
                                right: 0
                            });

                            // Create the main composite.
                            var main = new tabris.Composite({
                                left: 0,
                                right: 0,
                                top: 0
                            });
                            main.set({
                                id: "main"
                            });
                            main.appendTo(cell);

                            // Create the notIcon image.
                            var notIcon = new tabris.ImageView({
                                centerY: 0,
                                left: that.properties.HORIZONTAL_CELL_PADDING,
                                width: that.properties.IMAGE_SIZE,
                                height: that.properties.IMAGE_SIZE
                            });
                            notIcon.set({
                                id: "notIcon"
                            });
                            notIcon.appendTo(main);

                            // Create the display name.
                            var title = new tabris.TextView({
                                top: that.properties.VERTICAL_CELL_PADDING,
                                left: that.properties.HORIZONTAL_CELL_PADDING + that.properties.IMAGE_SIZE + that.properties.MIDDLE_TEXT_PADDING,
                                right: that.properties.HORIZONTAL_CELL_PADDING,
                                height: that.properties.NAME_TEXT_HEIGHT
                            });
                            title.set({
                                id: "title",
                                maxLines: 1,
                                textColor: that.properties.TITLE_COLOR,
                                font: Math.floor(that.properties.TITLE_HEIGHT / 1.2) + "px"
                            });
                            title.appendTo(main);

                            // Create the last message.
                            var tag = new tabris.TextView({
                                top: that.properties.VERTICAL_CELL_PADDING + that.properties.TITLE_HEIGHT + that.properties.MIDDLE_TEXT_PADDING,
                                left: that.properties.HORIZONTAL_CELL_PADDING + that.properties.IMAGE_SIZE + that.properties.MIDDLE_TEXT_PADDING,
                                right: that.properties.HORIZONTAL_CELL_PADDING
                            });
                            tag.set({
                                id: "tag",
                                textColor: that.properties.TAG_COLOR,
                                font: that.properties.TAG_SIZE + "px"
                            });
                            tag.appendTo(main);

                            // Create the last message time.
                            var time = new tabris.TextView({
                                left: that.properties.HORIZONTAL_CELL_PADDING + that.properties.IMAGE_SIZE + that.properties.MIDDLE_TEXT_PADDING,
                                right: that.properties.HORIZONTAL_CELL_PADDING,
                                height: that.properties.TIME_HEIGHT,
                                top: ["#tag", that.properties.MIDDLE_TEXT_PADDING]
                            });
                            time.set({
                                id: "time",
                                maxLines: 1,
                                textColor: that.properties.TIME_COLOR,
                                font: Math.floor(that.properties.TIME_HEIGHT / 1.2) + "px"
                            });
                            time.appendTo(main);

                            // Create some space
                            main.append(new tabris.Composite({
                                top: ["#time", 0],
                                height: that.properties.VERTICAL_CELL_PADDING
                            }));

                            // Create the horizontal rule.
                            var hrBottom = new tabris.Composite({
                                height: that.properties.NOTIFICATIONS_HR_HEIGHT,
                                left: 0,
                                right: 0,
                                bottom: 0
                            });
                            hrBottom.set({
                                background: that.properties.NOTIFICATIONS_HR_COLOR
                            });
                            hrBottom.appendTo(cell);

                            return cell;
                        },
                        updateCell: function (cell, index) {
                            if (index <= 0) {
                                cell.find("#main").dispose();
                                cell.set({
                                    height: that.properties.NOTIFICATIONS_HR_HEIGHT
                                });
                            } else {
                                cell.find("#main").find("#notIcon").set({
                                    image: that.page.data.notifications[index - 1].icon
                                });
                                if (that.page.data.notifications[index - 1].roundIcon) {
                                    cell.find("#main").find("#notIcon").set({
                                        cornerRadius: that.properties.IMAGE_SIZE / 2
                                    });
                                }
                                cell.find("#main").find("#title").set({
                                    text: that.page.data.notifications[index - 1].name
                                });
                                cell.find("#main").find("#tag").set({
                                    text: that.page.data.notifications[index - 1].info
                                });
                                cell.find("#main").find("#time").set({
                                    text: that.timeAgo(that.page.data.notifications[index - 1].time)
                                });
                                if (that.page.data.notifications[index - 1].viewed) {
                                    cell.find("#main").set({
                                        background: that.properties.VIEWED_BACKGROUND
                                    });
                                    cell.find("#main").find("#notIcon").set({
                                        opacity: that.properties.VIEWED_OPACITY
                                    });
                                    cell.find("#main").find("#title").set({
                                        opacity: that.properties.VIEWED_OPACITY
                                    });
                                    cell.find("#main").find("#tag").set({
                                        opacity: that.properties.VIEWED_OPACITY
                                    });
                                    cell.find("#main").find("#time").set({
                                        opacity: that.properties.VIEWED_OPACITY
                                    });
                                } else {
                                    cell.find("#main").set({
                                        background: that.properties.UNVIEWED_BACKGROUND
                                    });
                                }

                                cell.find("#main").on("tap", function () {
                                    if (that.page.data.notifications[index - 1].action.type >= 0) {
                                        that.properties.ACTION_INDEX[that.page.data.notifications[index - 1].action.type](that.page.data.notifications[index - 1].action.options);
                                    }
                                });
                            }
                        }
                    });

                    // On refresh.
                    that.page.data.collectionView.on("refresh", function () {
                        that.poll();
                    });

                    that.page.data.collectionView.appendTo(that.page);

                    that.page.data.notifications = resData;
                    that.page.data.notificationsLoaded = true;
                    that.page.data.lastNotificationId = resData[0].id;

                    var xhrRead = new XMLHttpRequest();
                    xhrRead.withCredentials = true;
                    xhrRead.open("POST", "http://deal-make.com/api/v1/users/" + that.tab.app.user + "/notifications/readall?token=" + that.tab.app.token);
                    xhrRead.setRequestHeader("content-type", "application/json");
                    xhrRead.setRequestHeader("cache-control", "no-cache");
                    xhrRead.send();
                }
            }
        });
        xhr.open("GET", "http://deal-make.com/api/v1/users/" + this.tab.app.user + "/notifications?token=" + this.tab.app.token);
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.send();

        // Poll for new notifications.
        this.page.data.pollInterval = setInterval(function () {
            that.poll();
        }, 1000 * 10);

        // The last notification id.
        this.page.data.lastNotificationId = -1;
    };

    // Called when the page is switched away from.
    this.unload = function () {
        clearInterval(this.page.data.pollInterval);

        this.page.data.collectionView.dispose();
    };

    // Called when the page is gone home to.
    this.homeState = function () {

        // Nothing for now.
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

    // Poll the notifications.
    this.poll = function () {
        var that = this;

        if (this.page.data.notificationsLoaded) {
            var xhr = new XMLHttpRequest();
            xhr.withCredentials = true;
            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    var resData = JSON.parse(this.responseText);
                    if (this.status == 200) {
                        if (resData.length > 0) {
                            that.page.data.lastNotificationId = resData[0].id;
                            that.page.data.notifications.unshift(resData);
                            that.page.data.collectionView.load(that.page.data.notifications.length);

                            var xhrRead = new XMLHttpRequest();
                            xhrRead.withCredentials = true;
                            xhrRead.open("POST", "http://deal-make.com/api/v1/users/" + that.tab.app.user + "/notifications/readall?token=" + that.tab.app.token);
                            xhrRead.setRequestHeader("content-type", "application/json");
                            xhrRead.setRequestHeader("cache-control", "no-cache");
                            xhrRead.send();
                        }
                        that.page.data.collectionView.refreshIndicator = false;
                    }
                }
            });
            xhr.open("GET", "http://deal-make.com/api/v1/users/" + that.tab.app.user + "/notifications/poll?token=" + that.tab.app.token + "&last=" + that.page.data.lastNotificationId);
            xhr.setRequestHeader("content-type", "application/json");
            xhr.setRequestHeader("cache-control", "no-cache");
            xhr.send();
        }
    }

};

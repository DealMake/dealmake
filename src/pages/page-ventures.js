module.exports = function () {

    // That is this.
    var that = this;

    // Properties are used for reference.
    this.properties = {
        PAGE_NAME: "Ventures",
        PAGE_ID: "ventures",
        PAGE_BACKGROUND: "#FFFFFF",
        BUTTON_EDIT_IMAGE: {
            src: _i("resources/images/but-edit.png")
        },
        BUTTON_DELETE_IMAGE: {
            src: _i("resources/images/but-delete.png")
        },
        PLUS_IMAGE: {
            src: _i("resources/images/but-new.png")
        },
        HORIZONTAL_CELL_PADDING: 8,
        CELL_HEIGHT: 64,
        IMAGE_SIZE: 48,
        VENTURES_HR_HEIGHT: 1,
        VENTURES_HR_COLOR: "#C0C0C0",
        VENTURES_CELL_BACKGROUND: "#FFFFFF",
        TEXT_HEIGHT: 24,
        MIDDLE_TEXT_VERTICAL_PADDING: 4,
        MIDDLE_TEXT_HORIZONTAL_PADDING: 16,
        BUTTON_HORIZONTAL_PADDING: 12,
        BUTTON_VERTICAL_PADDING: 8,
        BUTTON_SIZE: 24,
        TEXT_COLOR: "#000000"
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
            title: this.properties.PAGE_NAME,
            background: this.properties.PAGE_BACKGROUND
        }).appendTo(this.tab.navigationView);

        // Setup a data object.
        this.page.data = {};

        // Set up a reference to this.
        this.page.data.myPage = this;

        // Put up an activity indicator while getting the users ventures.
        this.page.data.activityIndicator = new tabris.ActivityIndicator({
            top: 8,
            centerX: 0
        });
        this.page.append(this.page.data.activityIndicator);

        // Ventures array.
        this.page.data.ventures = [];

        // Get the user's ventures.
        this.tab.app.apiCall("users/" + this.tab.app.user + "/ventures?token=" + this.tab.app.token, "GET").then(function (res) {
            if (res.status == 200) {

                that.page.data.ventures = res.data;

                // Get rid of the activity indicator.
                that.page.data.activityIndicator.dispose();

                // The collectionview.
                that.page.data.collectionView = new tabris.CollectionView({
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    itemCount: that.page.data.ventures.length + 2,
                    refreshEnabled: false,
                    createCell: function () {

                        // Create the cell composite.
                        var cell = new tabris.Composite({
                            height: that.properties.CELL_HEIGHT + that.properties.VENTURES_HR_HEIGHT,
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
                            background: that.properties.VENTURES_CELL_BACKGROUND
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
                            centerY: -((that.properties.TEXT_HEIGHT + that.properties.MIDDLE_TEXT_VERTICAL_PADDING) / 2),
                            left: that.properties.HORIZONTAL_CELL_PADDING + that.properties.IMAGE_SIZE + that.properties.MIDDLE_TEXT_HORIZONTAL_PADDING,
                            right: that.properties.BUTTON_HORIZONTAL_PADDING + that.properties.BUTTON_SIZE + that.properties.HORIZONTAL_CELL_PADDING,
                            height: that.properties.TEXT_HEIGHT
                        });
                        name.set({
                            id: "name",
                            maxLines: 1,
                            textColor: that.properties.TEXT_COLOR,
                            font: Math.floor(that.properties.TEXT_HEIGHT / 1.2) + "px"
                        });
                        name.appendTo(main);

                        // Create the tag.
                        var tag = new tabris.TextView({
                            centerY: ((that.properties.TEXT_HEIGHT + that.properties.MIDDLE_TEXT_VERTICAL_PADDING) / 2),
                            left: that.properties.HORIZONTAL_CELL_PADDING + that.properties.IMAGE_SIZE + that.properties.MIDDLE_TEXT_HORIZONTAL_PADDING,
                            right: that.properties.BUTTON_HORIZONTAL_PADDING + that.properties.BUTTON_SIZE + that.properties.HORIZONTAL_CELL_PADDING,
                            height: that.properties.TEXT_HEIGHT
                        });
                        tag.set({
                            id: "tag",
                            maxLines: 1,
                            textColor: that.properties.TEXT_COLOR,
                            font: Math.floor(that.properties.TEXT_HEIGHT / 1.2) + "px"
                        });
                        tag.appendTo(main);

                        // Create the edit button.
                        var editB = new tabris.ImageView({
                            centerY: -((that.properties.BUTTON_SIZE + that.properties.BUTTON_VERTICAL_PADDING) / 2),
                            right: that.properties.HORIZONTAL_CELL_PADDING,
                            width: that.properties.BUTTON_SIZE,
                            height: that.properties.BUTTON_SIZE
                        });
                        editB.set({
                            image: that.properties.BUTTON_EDIT_IMAGE,
                            id: "edit"
                        });
                        editB.appendTo(main);

                        // Create the delete button.
                        var deleteB = new tabris.ImageView({
                            centerY: ((that.properties.BUTTON_SIZE + that.properties.BUTTON_VERTICAL_PADDING) / 2),
                            right: that.properties.HORIZONTAL_CELL_PADDING,
                            width: that.properties.BUTTON_SIZE,
                            height: that.properties.BUTTON_SIZE
                        });
                        deleteB.set({
                            image: that.properties.BUTTON_DELETE_IMAGE,
                            id: "delete"
                        });
                        deleteB.appendTo(main);

                        // Create the horizontal rule.
                        var hrBottom = new tabris.Composite({
                            height: that.properties.VENTURES_HR_HEIGHT,
                            left: 0,
                            right: 0,
                            bottom: 0
                        });
                        hrBottom.set({
                            background: that.properties.VENTURES_HR_COLOR
                        });
                        hrBottom.appendTo(cell);

                        return cell;
                    },
                    updateCell: function (cell, index) {

                        if (index <= 0) {

                            // The top horizontal rule.
                            cell.find("#main").dispose();
                            cell.set({
                                height: that.properties.VENTURES_HR_HEIGHT
                            });

                        } else if (index >= that.page.data.ventures.length + 1) {

                            // The "add new" cell.
                            cell.find("#main")[0].find().dispose();
                            var plus = new tabris.ImageView({
                                centerY: 0,
                                left: that.properties.HORIZONTAL_CELL_PADDING,
                                width: that.properties.IMAGE_SIZE,
                                height: that.properties.IMAGE_SIZE
                            });
                            plus.set({
                                image: that.properties.PLUS_IMAGE
                            });
                            cell.append(plus);
                            var txt = new tabris.TextView({
                                centerY: 0,
                                left: that.properties.HORIZONTAL_CELL_PADDING + that.properties.IMAGE_SIZE + that.properties.MIDDLE_TEXT_HORIZONTAL_PADDING,
                                right: that.properties.HORIZONTAL_CELL_PADDING,
                                height: that.properties.TEXT_HEIGHT
                            });
                            txt.set({
                                text: "Create New Venture"
                            });
                            cell.append(txt);

                        } else {

                            // Add the data to the widgets.
                            cell.find("#main").find("#profile").set({
                                image: {
                                    src: that.page.data.ventures[index - 1].logo
                                }
                            });
                            cell.find("#main").find("#name").set({
                                text: that.page.data.ventures[index - 1].name
                            });
                            cell.find("#main").find("#tag").set({
                                text: that.page.data.ventures[index - 1].tag
                            });

                            // Listen for taps on the edit button.
                            cell.find("#main").find("#edit").on("tap", function () {
                                // Create the venture edit page.
                                var page = new that.tab.app.PageEditVenture();
                                page.initiateUI(that.tab);
                                page.setTarget(index - 1);
                                page.setTitle(that.page.data.ventures[index - 1].name);
                                page.setInfo(that.page.data.ventures[index - 1]);
                                that.tab.navigationView.append(page.page);
                            });

                            // Listen for taps on the delete button.
                            cell.find("#main").find("#delete").on("tap", function () {

                                (new tabris.AlertDialog({
                                    title: "Delete Venture",
                                    message: "Are you sure you want to delete the venture '" + that.page.data.ventures[index - 1].name + "'?",
                                    buttons: {
                                        ok: "Delete",
                                        cancel: "Keep"
                                    }
                                })).on("closeOk", function () {
                                    that.tab.app.apiCall("users/" + that.tab.app.user + "/ventures/" + that.page.data.ventures[index - 1].ind + "/delete?token=" + that.tab.app.token, "POST").then(function (res) {
                                        if (res.status == 200) {
                                            that.refreshVentures();
                                        }
                                    });
                                }).open();
                            });

                            // Darken the cell when it is held.
                            /*
                            cell.find("#main").on("touchStart", function () {
                                this.set({background: that.properties.HELD_BACKGROUND});
                            });
                            cell.find("#main").on("touchEnd", function () {
                                this.set({background: that.properties.VENTURES_CELL_BACKGROUND});
                            });
                            cell.find("#main").on("touchCancel", function () {
                                this.set({background: that.properties.VENTURES_CELL_BACKGROUND});
                            });
                            */
                        }
                    }
                });
                that.page.append(that.page.data.collectionView);
            }
        });
    };

    // Called when the page is switched to.
    this.load = function () {

    };

    // Called when the page is switched away from.
    this.unload = function () {

    };

    /*
        Custom functions
    */
    this.refreshVentures = function () {
        // Get the user's ventures.
        this.tab.app.apiCall("users/" + this.tab.app.user + "/ventures?token=" + this.tab.app.token, "GET").then(function (res) {
            if (res.status == 200) {
                that.page.data.ventures = res.data;

                that.page.data.collectionView.remove(0, that.page.data.collectionView.itemCount);
                that.page.data.collectionView.load(that.page.data.ventures.length + 2);
            }
        });
    };


};

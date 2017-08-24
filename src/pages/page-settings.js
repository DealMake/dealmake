module.exports = function () {

    // That is this.
    var that = this;

    // Properties are used for reference.
    this.properties = {
        PAGE_NAME: "Settings",
        PAGE_ID: "settings",
        VERTICAL_CELL_PADDING: 6,
        HORIZONTAL_CELL_PADDING: 12,
        CELL_HEIGHT: 40,
        TEXT_COLOR: "#000000",
        SETTINGS_HR_HEIGHT: 1,
        SETTINGS_HR_COLOR: "#C0C0C0",
        SETTINGS_CELL_BACKGROUND: "#FFFFFF",
        DISABLED_CELL_BACKGROUND: "#E0E0E0",
        DISABLED_CELL_OPACITY: 0.5
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

        // Create a new collection view and append it.
        this.page.data.collectionView = new tabris.CollectionView({
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            refreshEnabled: false,
            itemCount: 7 + 1,
            createCell: function () {

                // Create the cell composite.
                var cell = new tabris.Composite({
                    height: that.properties.CELL_HEIGHT + that.properties.SETTINGS_HR_HEIGHT,
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
                    background: that.properties.SETTINGS_CELL_BACKGROUND
                });
                main.appendTo(cell);

                // Create the main textview.
                var text = new tabris.TextView({
                    //top: that.properties.VERTICAL_CELL_PADDING,
                    left: that.properties.HORIZONTAL_CELL_PADDING,
                    right: that.properties.HORIZONTAL_CELL_PADDING,
                    centerY: 0
                });
                text.set({
                    id: "text",
                    maxLines: 1,
                    textColor: that.properties.TEXT_COLOR,
                    font: Math.floor((that.properties.CELL_HEIGHT - (that.properties.VERTICAL_CELL_PADDING * 2)) / 1.2) + "px"
                });
                text.appendTo(main);

                // Create the horizontal rule.
                var hrBottom = new tabris.Composite({
                    height: that.properties.SETTINGS_HR_HEIGHT,
                    left: 0,
                    right: 0,
                    bottom: 0
                });
                hrBottom.set({
                    background: that.properties.SETTINGS_HR_COLOR
                });
                hrBottom.appendTo(cell);

                return cell;
            },
            updateCell: function (cell, index) {
                if (index <= 0) {
                    cell.find("#main").dispose();
                    cell.set({
                        height: that.properties.SETTINGS_HR_HEIGHT
                    });
                } else {
                    var str, isContent, action;
                    var disabled = false;
                    switch (index - 1) {
                        case 0:
                            str = "Manage Account";
                            isContent = true;
                            action = function () {
                                // Open the account management UI.
                                var page = new that.tab.app.PageAccount();
                                page.initiateUI(that.tab);
                                that.tab.navigationView.append(page.page);
                            };
                            break;
                        case 1:
                            str = "Ventures";
                            isContent = true;
                            if (that.tab.app.isVC) {
                                disabled = true;
                            } else {
                                action = function () {
                                    // Open the venture management UI.
                                    var page = new that.tab.app.PageVentures();
                                    page.initiateUI(that.tab);
                                    that.tab.navigationView.append(page.page);
                                };
                            }
                            break;
                        case 2:
                            str = "VC Settings";
                            isContent = true;
                            if (!that.tab.app.isVC) {
                                disabled = true;
                            } else {
                                action = function () {
                                    // Open the vc management UI.
                                    var page = new that.tab.app.PageEditVC();
                                    page.initiateUI(that.tab);
                                    that.tab.navigationView.append(page.page);
                                };
                            }
                            break;
                        case 3:
                            isContent = false;
                            break;
                        case 4:
                            str = "About";
                            isContent = true;
                            action = function () {
                                // Open the about page.
                                var page = new that.tab.app.PageAbout();
                                page.initiateUI(that.tab);
                                that.tab.navigationView.append(page.page);
                            };
                            break;
                        case 5:
                            str = "Terms of Service";
                            isContent = true;
                            action = function () {
                                // Open the terms of service page.
                                var page = new that.tab.app.PageToS();
                                page.initiateUI(that.tab);
                                that.tab.navigationView.append(page.page);
                            };
                            break;
                        case 6:
                            str = "Credits";
                            isContent = true;
                            break;
                        case 7:
                            isContent = false;
                            break;
                    }
                    if (isContent) {
                        cell.find("#main").find("#text").set({
                            text: str
                        });

                        cell.on("tap", action);
                    }
                    if (disabled) {
                        cell.find("#main").set({
                            background: that.properties.DISABLED_CELL_BACKGROUND,
                            opacity: that.properties.DISABLED_CELL_OPACITY
                        });
                    }
                }
            }
        });
        this.page.data.collectionView.appendTo(this.page);
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

};

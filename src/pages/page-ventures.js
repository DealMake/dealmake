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
                console.log(res.data);

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

                        cell.off("tap");

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
                            cell.on("tap", function () {
                                var page = new that.tab.app.PageEditVenture();
                                page.initiateUI(that.tab);
                                page.setTarget(-1);
                                page.setTitle("New Venture");
                                page.setInfo({
                                    name: "Venture",
                                    tag: "My venture.",
                                    back: "Some information about the venture.",
                                    genre: 15,
                                    logo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfhCBEACS1dBP6AAAAEi0lEQVRo3sWZa2wUVRTHfwuVbltpXQq0aUKAtlQr2Kg8FKIxJGp9ECVGEh8JqQkmRpQKBkhUgmgIhqiRGL+oBDH0S0lEv2B8JEQxoiLEYmrptmm1ChTaWmrLLotljx96dpzZx+zO7Oz2TDaze8495/+/987ce85dmGSZmpV3Ec+yiDZksui3IAg7Jwu+gSiCEKJycgi0Inq9PRnw9Vw1CISoyD+BFgNeEN7MN/wCxhGEk/yFIFxidn4J7NOeP8xz+m13PuHn8y+C0IaPQs4gCGPMyh+B97XXawB4Xn+9kS/4OVxBENqZAoBfx2CUmfkh8J72+AlDs0E1u/IBX8VlBCFo2kf8nNUxKM89gXe0t00WbbNqc74vVBBCEHoosOiLOIcg/MOM3BLYrT19OsHyglpezyV8OWMIQh/TEmyxMRghkDsCO7WX65NaN6p1R67gA4wgCGfxJ7UX0Y8gXOS6zINmlpIVUM1ytrAUgO18l7TVOFEaAT+1TKOYMOH0oX0pLVXUGVc11xj6C8wnlMKnmF7LrjhMF93GZygdgTITZB3XpgDZarvvbeKtlLZhuk10BmPqUtbzIUc5b0kwkl8htun6n3pEN/F3BpGEYY6zl3ofX3CvTcAofxCkkyBBgvRlmICXU8sC/dTaLk2nfPQn5HMDJshuIhlB2skMCx3rbtELm41B6Wcttzl5hVxJgDs0jROusApgu0Fhb5oZ9kL8HFa0CKtjyq0GhQNZFmvppIgvFenyRO9j0mxQaDW9815LCUcUJcx98cZntNASPk2y1Xgh0zlqvM53J2vQZNQ6h1Os9tlIGcc0+hgrUzV6XNNt4WuKPYUP8JNGHuVOu4aPaMYrfMt0z+DLOalRR1iRrvGDmnQKxyjzBH4Wp4zld1kmDvdo3if87EGGV0m7RhticaZOdzGqTm1ZFlxVnNZIg9zsxHE5F9WxPYvzjzl0aZTz3OTUeQlD6hx0WW4E6NEI57jRTYAGLmiADa4INKn3Ga53O4QLNcR+V9671LvBrpH97jem905XBNr1bruw2xNYGBfKmfyqd9vHL5cETjPuDYEwPa4IROjyhkAHUVcEYpPgmoCPesDtBPxPoMJuNbUjMI8STwjYjoEdgewewbwQuJ+DHKIpZSLbqyuJ431gQj7WBCp5AbuCb4xEtoNHU7T6AUH40R2BEwjC8SSWRXyWUOudSMxzgQ9sO2ErUzQt+ShOP4/9poN60UPrWBoXn+/FThBrnBOoUdfNJt1s9hAxAR7hdmo4YCH0ObeaPFaqdrVzAg+p6wP6u5QdRp40MeSNpik5ZLJEOcgNapmpum3OCbykrnOBQjYyYILoZE3CrC7jK8vE7GMugJ6dtTon0KJZfAFP0WcK/Sfr4g4pzQP+vallhHep1FqwwzmBXxCEAX4zhRzkxbQ10yr1nLgu8buOiMNaayrhuNdslNcozcjXx2MEE17TW5wRqLM4R9jj8D+hAtZZJk5Y64xAo+F41XicnEohzaajr1edOVfrFHziLqE2pISXGUaIZl4VxWQpr7AkK/CYBHjSzUqYJ/kPXxhmngf75WIAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTctMDgtMTdUMDA6MDk6NDUrMDI6MDDsMI0gAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE3LTA4LTE3VDAwOjA5OjQ1KzAyOjAwnW01nAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAASUVORK5CYII="
                                });
                                that.tab.navigationView.append(page.page);
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

module.exports = function () {

    // That is this.
    var that = this;

    // Properties are used for reference.
    this.properties = {
        PAGE_NAME: "Account",
        PAGE_ID: "account",
        PAGE_BACKGROUND: "#000000"
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

        // Setup an activity indicator when the information is loading.
        this.page.data.aa = new tabris.ActivityIndicator({
            top: 24,
            centerX: 0
        });
        this.page.data.aa.appendTo(this.page);

        // Get the information.
        this.tab.apiCall("users/" + that.user + "?token=" + that.token, "GET").then(function (resData, status) {
            if (status == 200) {
                that.page.data.aa.dispose();

                that.setInfo(resData);
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
    this.setInfo = function (info) {
        var that = this;

        // Create a name label.
        this.page.data.nameTV = new tabris.TextView({
            centerX: -32,
            centerY: -96
        });
        this.page.data.nameTV.set({
            text: "Name: ",
            font: Math.floor(22 / 1.3) + "px"
        });
        this.page.data.nameTV.appendTo(this.page);

        // Create a name text input.
        this.page.data.nameTI = new tabris.TextInput({
            centerX: 32,
            centerY: -96
        });
        this.page.data.nameTI.set({
            text: info.name
        });
        this.page.data.nameTI.appendTo(this.page);

        // Create a profile label.
        this.page.data.profileTV = new tabris.TextView({
            centerX: -32,
            centerY: -64
        });
        this.page.data.profileTV.set({
            text: "Profile",
            font: Math.floor(22 / 1.3) + "px"
        });
        this.page.data.profileTV.appendTo(this.page);

        // Create a profile preview.
        this.page.data.profileIV = new tabris.ImageView({
            centerX: 32,
            centerY: -32,
            width: 64,
            height: 64
        });
        this.page.data.profileIV.set({
            image: info.profile
        });
        this.page.data.profileIV.on({
            select: function () {
                navigator.camera.getPicture(function (img) {
                    that.page.data.profileIV.set({
                        image: img
                    });
                }, function (message) {
                    that.page.tab.app.handError(new Error(message));
                }, {
                    quality: 50,
                    targetWidth: 64,
                    targetHeight: 64,
                    sourceType: navigator.Camera.PictureSourceType.PHOTOLIBRARY,
                    destinationType: navigator.Camera.DestinationType.DATA_URL
                });
            }
        });
        this.page.data.profileIV.appendTo(this.page);

        // Create the cancel button.
        this.page.data.cancelB = new tabris.Button({
            left: 16,
            bottom: 16
        });
        this.page.data.cancelB.set({
            text: "Cancel"
        });
        this.page.data.cancelB.on({
            select: function () {
                that.page.dispose();
            }
        });
        this.page.data.cancelB.appendTo(this.page);

        // Create the save button.
        this.page.data.saveB = new tabris.Button({
            right: 16,
            bottom: 16
        });
        this.page.data.saveB.set({
            text: "Save"
        });
        this.page.data.saveB.on({
            select: function () {
                if (that.page.data.nameTI.text != "") {
                    that.page.tab.app.apiCall("users/" + that.page.tab.app.user + "/update?token=" + that.page.tab.app.token, "POST", {
                        name: that.page.data.nameTI.text,
                        profile: that.page.data.profileIV.image
                    }).then(function (resData, status) {
                        if (status == 200) {
                            that.page.dispose();
                        }
                    });
                }
            }
        });
        this.page.data.saveB.appendTo(this.page);

    };


};

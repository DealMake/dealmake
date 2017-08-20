module.exports = function () {

    // That is this.
    var that = this;

    // Properties are used for reference.
    this.properties = {
        PAGE_NAME: "Edit VC Info",
        PAGE_ID: "editvc",
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
        this.tab.apiCall("users/" + that.user + "/vc?token=" + that.token, "GET").then(function (resData, status) {
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

        // Add the tag label.
        this.page.data.tagTV = new tabris.TextView({
            centerX: -32,
            centerY: -64
        });
        this.page.data.tagTV.set({
            text: "Profile: ",
            font: Math.floor(22 / 1.3) + "px"
        });
        this.page.data.tagTV.appendTo(this.page);

        // Add the tag box.
        this.page.data.tagTI = new tabris.TextInput({
            centerX: 80,
            centerY: -64,
            width: 160,
            height: 64
        });
        this.page.data.tagTI.set({
            message: "A sentence for your VC card.",
            type: "multiline",
            text: info.tag
        });
        this.page.data.tagTI.appendTo(this.page);

        // Add the back label.
        this.page.data.backTV = new tabris.TextView({
            centerX: -32,
            centerY: 0
        });
        this.page.data.backTV.set({
            text: "Profile: ",
            font: Math.floor(22 / 1.3) + "px"
        });
        this.page.data.backTV.appendTo(this.page);

        // Add the back box.
        this.page.data.tagTI = new tabris.TextInput({
            centerX: 80,
            centerY: 0,
            width: 160,
            height: 64
        });
        this.page.data.tagTI.set({
            message: "The back of your VC's card.",
            type: "multiline",
            text: info.back
        });
        this.page.data.tagTI.appendTo(this.page);

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
                    that.page.tab.app.apiCall("users/" + that.page.tab.app.user + "/vc/update?token=" + that.page.tab.app.token, "POST", {
                        tag: that.page.data.tagTI.text,
                        back: that.page.data.backTI.image
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
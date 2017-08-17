module.exports = function () {

    // That is this.
    var that = this;

    // Properties are used for reference.
    this.properties = {
        PAGE_NAME: "Edit Venture",
        PAGE_ID: "editVenture",
        PAGE_BACKGROUND: "#FFFFFF",
        GENRES: [
            "Auto & Vehicles",
            "Beauty & Fashion",
            "Comedy",
            "Education",
            "Entertainment",
            "Family Entertainment",
            "Film & Animation",
            "Food",
            "Gaming",
            "How-to & Style",
            "Music",
            "News & Politics",
            "Nonprofits & Activism",
            "People & Blogs",
            "Pets & Animals",
            "Science & Technology",
            "Sports",
            "Travel & Events"
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
            title: this.properties.PAGE_NAME,
            background: this.properties.PAGE_BACKGROUND
        }).appendTo(this.tab.navigationView);

        // Setup a data object.
        this.page.data = {};

        // Set up a reference to this.
        this.page.data.myPage = this;
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
    this.setTitle = function (title) {
        this.page.set({
            title: title
        });
    };

    this.setTarget = function (target) {
        this.target = target;
    }

    this.setInfo = function (info) {
        var that = this;

        // Create a name label.
        this.page.data.nameTV = new tabris.TextView({
            centerX: -32,
            centerY: -160
        });
        this.page.data.nameTV.set({
            text: "Name: ",
            font: Math.floor(22 / 1.3) + "px"
        });
        this.page.data.nameTV.appendTo(this.page);

        // Create a name text input.
        this.page.data.nameTI = new tabris.TextInput({
            centerX: 80,
            centerY: -160,
            width: 160,
            height: 32
        });
        this.page.data.nameTI.set({
            text: info.name
        });
        this.page.data.nameTI.appendTo(this.page);

        // Create a profile label.
        this.page.data.logoTV = new tabris.TextView({
            centerX: -32,
            centerY: -128
        });
        this.page.data.logoTV.set({
            text: "Profile: ",
            font: Math.floor(22 / 1.3) + "px"
        });
        this.page.data.logoTV.appendTo(this.page);

        // Create a profile preview.
        this.page.data.logoIV = new tabris.ImageView({
            centerX: 32,
            centerY: -128,
            width: 64,
            height: 64
        });
        this.page.data.logoIV.set({
            image: info.logo
        });
        this.page.data.logoIV.on({
            select: function () {
                navigator.camera.getPicture(function (img) {
                    that.page.data.logoIV.set({
                        image: "data:image/jpg;base64," + img
                    });
                }, function (message) {
                    that.page.tab.app.handError(new Error(message));
                }, {
                    quality: 50,
                    targetWidth: 64,
                    targetHeight: 64,
                    sourceType: 0,
                    destinationType: 0
                });
            }
        });
        this.page.data.logoIV.appendTo(this.page);

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
            message: "A sentence your venture.",
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
            message: "The back of your venture's card.",
            type: "multiline",
            text: info.back
        });
        this.page.data.tagTI.appendTo(this.page);

        // Add the genre label.
        this.page.data.genreTV = new tabris.TextView({
            centerX: -32,
            centerY: 32
        });
        this.page.data.genreTV.set({
            text: "Genre: ",
            font: Math.floor(22 / 1.3) + "px"
        });
        this.page.data.genreTV.appendTo(this.page);

        // Create a picker.
        this.page.data.genreP = new tabris.Picker({
            centerX: 32,
            centerY: 32,
            height: 32,
            width: 64
        });
        this.page.data.genreP.set({
            itemCount: GENRES.length,
            itemText: function (index) {
                return GENRES[index];
            },
            selectionIndex: info.genre
        });
        this.page.data.genreP.appendTo(this.page);

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
            text: this.target == -1: "Create": "Save"
        });
        this.page.data.saveB.on({
            select: function () {
                if (that.page.data.nameTI.text != "") {
                    if (that.target != -1) {
                        that.page.tab.app.apiCall("users/" + that.page.tab.app.user + "/ventures?token=" + that.page.tab.app.token, "POST", {
                            name: that.page.data.nameTI.text,
                            logo: that.page.data.logoIV.image,
                            tag: that.page.data.tagTV.text,
                            back: that.page.data.backTV.text,
                            genre: that.page.data.genreP.selectionIndex
                        }).then(function (resData, status) {
                            if (status == 200) {
                                that.page.dispose();
                            }
                        });
                    } else {
                        // Get the longitude and latitude.
                        navigator.geolocation.getCurrentPosition(function (geo) {

                            // Reverse geocode.
                            var xhr = new XMLHttpRequest();
                            xhr.addEventListener("readystatechange", function () {
                                if (this.readyState === 4) {
                                    var resData = JSON.parse(this.responseText);

                                    that.apiCall("users", "POST", {
                                        name: that.page.data.nameTI.text,
                                        logo: that.page.data.logoIV.image,
                                        tag: that.page.data.tagTV.text,
                                        back: that.page.data.backTV.text,
                                        genre: that.page.data.genreP.selectionIndex,
                                        latitude: geo.coords.latitude,
                                        longitude: geo.coords.longitude,
                                        place: resData[0].formatted_address
                                    }).then(function (resData, status) {
                                        if (status == 200) {
                                            that.page.dispose();
                                        }
                                    });
                                }
                            });
                            xhr.open("GET", "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + geo.coords.latitude + "," + geo.coords.longitude + "&result_type=political&key=AIzaSyD_RXoSJoSeG4tnr7jf6fYLxCfnJvzW1_8");
                            xhr.send();
                        });
                    }
                }
            }
        });
        this.page.data.saveB.appendTo(this.page);

    };


};

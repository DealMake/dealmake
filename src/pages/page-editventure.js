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

        // Inputs and whatnot.
        this.snappedInput = null;
        this.inputs = [];
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
    };

    this.setInfo = function (info) {
        var that = this;

        // Create a name label.
        this.page.data.nameTV = new tabris.TextView({
            centerX: -64,
            centerY: -192
        });
        this.page.data.nameTV.set({
            text: "Name: ",
            font: Math.floor(22 / 1.3) + "px"
        });
        this.page.data.nameTV.appendTo(this.page);
        this.inputs.push(this.page.data.nameTV);
        this.page.data.nameTV.data = {};
        this.page.data.nameTV.data.snapAmount = 192;

        // Create a name text input.
        this.page.data.nameTI = new tabris.TextInput({
            centerX: 48,
            centerY: -192,
            width: 160,
            height: 32
        });
        this.page.data.nameTI.set({
            text: info.name
        });
        this.page.data.nameTI.appendTo(this.page);
        this.inputs.push(this.page.data.nameTI);
        this.page.data.nameTI.data = {};
        this.page.data.nameTI.data.snapAmount = 192;
        this.page.data.nameTI.on({
            focus: function () {
                that.snapToInput(this);
            }
        });
        this.page.data.nameTI.on({
            blur: function () {
                that.unsnapInput(this);
            }
        });

        // Create a logo label.
        this.page.data.logoTV = new tabris.TextView({
            centerX: -64,
            centerY: -128
        });
        this.page.data.logoTV.set({
            text: "Logo: ",
            font: Math.floor(22 / 1.3) + "px"
        });
        this.page.data.logoTV.appendTo(this.page);
        this.inputs.push(this.page.data.logoTV);
        this.page.data.logoTV.data = {};
        this.page.data.logoTV.data.snapAmount = 128;

        // Create a profile preview.
        this.page.data.logoIV = new tabris.ImageView({
            centerX: 0,
            centerY: -128,
            width: 64,
            height: 64
        });
        this.page.data.logoIV.set({
            image: info.logo
        });
        this.page.data.logoIV.on({
            tap: function () {
                navigator.camera.getPicture(function (img) {
                    that.page.data.logoIV.set({
                        image: "data:image/jpg;base64," + img
                    });
                }, function (message) {
                    that.tab.app.handleError(new Error(message));
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
        this.inputs.push(this.page.data.logoIV);
        this.page.data.logoIV.data = {};
        this.page.data.logoIV.data.snapAmount = 128;
        this.page.data.logoIV.on({
            focus: function () {
                that.snapToInput(this);
            }
        });
        this.page.data.logoIV.on({
            blur: function () {
                that.unsnapInput(this);
            }
        });

        // Add the tag label.
        this.page.data.tagTV = new tabris.TextView({
            centerX: -64,
            centerY: -48
        });
        this.page.data.tagTV.set({
            text: "Tag: ",
            font: Math.floor(22 / 1.3) + "px"
        });
        this.page.data.tagTV.appendTo(this.page);
        this.inputs.push(this.page.data.tagTV);
        this.page.data.tagTV.data = {};
        this.page.data.tagTV.data.snapAmount = 48;

        // Add the tag box.
        this.page.data.tagTI = new tabris.TextInput({
            centerX: 48,
            centerY: -48,
            width: 160,
            height: 64
        });
        this.page.data.tagTI.set({
            message: "A sentence your venture.",
            type: "multiline",
            text: info.tag
        });
        this.page.data.tagTI.appendTo(this.page);
        this.inputs.push(this.page.data.tagTI);
        this.page.data.tagTI.data = {};
        this.page.data.tagTI.data.snapAmount = 48;
        this.page.data.tagTI.on({
            focus: function () {
                that.snapToInput(this);
            }
        });
        this.page.data.tagTI.on({
            blur: function () {
                that.unsnapInput(this);
            }
        });

        // Add the back label.
        this.page.data.backTV = new tabris.TextView({
            centerX: -64,
            centerY: 24
        });
        this.page.data.backTV.set({
            text: "Back: ",
            font: Math.floor(22 / 1.3) + "px"
        });
        this.page.data.backTV.appendTo(this.page);
        this.inputs.push(this.page.data.backTV);
        this.page.data.backTV.data = {};
        this.page.data.backTV.data.snapAmount = -24;

        // Add the back box.
        this.page.data.backTI = new tabris.TextInput({
            centerX: 48,
            centerY: 24,
            width: 160,
            height: 64
        });
        this.page.data.backTI.set({
            message: "The back of your venture's card.",
            type: "multiline",
            text: info.back
        });
        this.page.data.backTI.appendTo(this.page);
        this.inputs.push(this.page.data.backTI);
        this.page.data.backTI.data = {};
        this.page.data.backTI.data.snapAmount = -24;
        this.page.data.backTI.on({
            focus: function () {
                that.snapToInput(this);
            }
        });
        this.page.data.backTI.on({
            blur: function () {
                that.unsnapInput(this);
            }
        });

        // Add the picker label.
        this.page.data.genreTV = new tabris.TextView({
            centerX: -64,
            centerY: 82
        });
        this.page.data.genreTV.set({
            text: "Genre: ",
            font: Math.floor(22 / 1.3) + "px"
        });
        this.page.data.genreTV.appendTo(this.page);
        this.inputs.push(this.page.data.genreTV);
        this.page.data.genreTV.data = {};
        this.page.data.genreTV.data.snapAmount = -82;

        // Create a picker.
        this.page.data.genreP = new tabris.Picker({
            centerX: 48,
            centerY: 82,
            height: 32,
            width: 160
        });
        this.page.data.genreP.set({
            itemCount: that.properties.GENRES.length,
            itemText: function (index) {
                return that.properties.GENRES[index];
            },
            selectionIndex: info.genre
        });
        this.page.data.genreP.appendTo(this.page);
        this.inputs.push(this.page.data.genreP);
        this.page.data.genreP.data = {};
        this.page.data.genreP.data.snapAmount = -82;
        this.page.data.genreP.on({
            focus: function () {
                that.snapToInput(this);
            }
        });
        this.page.data.genreP.on({
            blur: function () {
                that.unsnapInput(this);
            }
        });

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
            text: this.target == -1 ? "Create" : "Save"
        });
        this.page.data.saveB.on({
            select: function () {
                if (that.page.data.nameTI.text != "") {
                    if (that.target != -1) {
                        that.tab.app.apiCall("users/" + that.tab.app.user + "/ventures?token=" + that.tab.app.token, "POST", {
                            name: that.page.data.nameTI.text,
                            logo: that.page.data.logoIV.image.src,
                            tag: that.page.data.tagTV.text,
                            back: that.page.data.backTV.text,
                            genre: that.page.data.genreP.selectionIndex
                        }).then(function (res) {
                            if (res.status == 200) {
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

                                    that.tab.app.apiCall("/users/" + that.tab.app.user + "/ventures?token=" + that.tab.app.token, "POST", {
                                        name: that.page.data.nameTI.text,
                                        logo: that.page.data.logoIV.image.src,
                                        tag: that.page.data.tagTV.text,
                                        back: that.page.data.backTV.text,
                                        genre: that.page.data.genreP.selectionIndex,
                                        latitude: geo.coords.latitude,
                                        longitude: geo.coords.longitude,
                                        place: resData.results[0].formatted_address
                                    }).then(function (res) {
                                        if (res.status == 200) {
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

    this.snapToInput = function (input) {
        this.snappedInput = input;
        for (var i = 0; i < this.inputs.length; i++) {
            this.inputs[i].transform = {
                translationY: input.data.snapAmount
            };
            if (i < this.inputs.indexOf(input) || (i == this.inputs.indexOf(input) - 1 && Math.floor(i / 2) == i / 2)) {
                this.inputs[i].opacity = 0;
            }
        }
        this.page.data.cancelB.transform = {
            translationX: 9999
        };
        this.page.data.saveB.transform = {
            translationX: 9999
        };

        // This is a really strange bug that I'm fixing.
        if (this.tab.TAB_ID == "browse") {
            this.tab.navigationView.pages()[0].data.bwLogo.transform = {
                translationX: 9999
            };
        }
    };

    this.unsnapInput = function (input) {
        this.snappedInput = null;
        for (var i = 0; i < this.inputs.length; i++) {
            this.inputs[i].transform = {
                translationY: 0
            };
            if (i < this.inputs.indexOf(input) || (i == this.inputs.indexOf(input) - 1 && Math.floor(i / 2) == i / 2)) {
                this.inputs[i].opacity = 1;
            }
        }
        this.page.data.cancelB.transform = {
            translationX: 0
        };
        this.page.data.saveB.transform = {
            translationX: 0
        };

        // This is a really strange bug that I'm fixing.
        if (this.tab.TAB_ID == "browse") {
            this.tab.navigationView.pages()[0].data.bwLogo.transform = {
                translationX: 0
            };
        }
    }


};

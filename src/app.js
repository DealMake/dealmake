_i = require("./i.js");

// The app object.
var App = function () {

    // This is that.
    var that = this;

    this.init = function () {
        // The acount has not been entered.
        this.appEntered = false;

        // Account stuff composite;
        this.accountComposite = new tabris.Composite({
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        });
        this.accountComposite.appendTo(tabris.ui.contentView);
        this.accountComposite.data = {};
        this.accountComposite.data.accountBackground = new tabris.ImageView({
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        });
        this.accountComposite.data.accountBackground.set({
            image: _i("resources/images/bac-account.png"),
            scaleMode: "fill"
        });
        this.accountComposite.data.accountBackground.appendTo(this.accountComposite);
        this.accountComposite.data.accountForm = new tabris.Composite({
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        });
        this.accountComposite.data.accountForm.appendTo(this.accountComposite);

        // Nothing is loading.
        this.accountComposite.data.isSomethingLoading = false;

        // Nothing is animating.
        this.accountComposite.data.isSomethingAnimating = false;

        // Build the sign in.
        this.buildSignIn();
    };

    this.buildSignIn = function () {
        var that = this;

        // If the account data does not exists, create it.
        if (!this.accountComposite.data.savedAccountData) {
            this.accountComposite.data.savedAccountData = {};
            this.accountComposite.data.savedAccountData.name = "";
            this.accountComposite.data.savedAccountData.email = "";
            this.accountComposite.data.savedAccountData.phone = "";
            this.accountComposite.data.savedAccountData.password = "";
            this.accountComposite.data.savedAccountData.isVC = false;
            this.accountComposite.data.savedAccountData.tag = "";
            this.accountComposite.data.savedAccountData.back = "";
            this.accountComposite.data.savedAccountData.profile = "data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMS4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDQ4Mi45IDQ4Mi45IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0ODIuOSA0ODIuOTsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSI2NHB4IiBoZWlnaHQ9IjY0cHgiPgo8Zz4KCTxnPgoJCTxwYXRoIGQ9Ik0yMzkuNywyNjAuMmMwLjUsMCwxLDAsMS42LDBjMC4yLDAsMC40LDAsMC42LDBjMC4zLDAsMC43LDAsMSwwYzI5LjMtMC41LDUzLTEwLjgsNzAuNS0zMC41ICAgIGMzOC41LTQzLjQsMzIuMS0xMTcuOCwzMS40LTEyNC45Yy0yLjUtNTMuMy0yNy43LTc4LjgtNDguNS05MC43QzI4MC44LDUuMiwyNjIuNywwLjQsMjQyLjUsMGgtMC43Yy0wLjEsMC0wLjMsMC0wLjQsMGgtMC42ICAgIGMtMTEuMSwwLTMyLjksMS44LTUzLjgsMTMuN2MtMjEsMTEuOS00Ni42LDM3LjQtNDkuMSw5MS4xYy0wLjcsNy4xLTcuMSw4MS41LDMxLjQsMTI0LjlDMTg2LjcsMjQ5LjQsMjEwLjQsMjU5LjcsMjM5LjcsMjYwLjJ6ICAgICBNMTY0LjYsMTA3LjNjMC0wLjMsMC4xLTAuNiwwLjEtMC44YzMuMy03MS43LDU0LjItNzkuNCw3Ni03OS40aDAuNGMwLjIsMCwwLjUsMCwwLjgsMGMyNywwLjYsNzIuOSwxMS42LDc2LDc5LjQgICAgYzAsMC4zLDAsMC42LDAuMSwwLjhjMC4xLDAuNyw3LjEsNjguNy0yNC43LDEwNC41Yy0xMi42LDE0LjItMjkuNCwyMS4yLTUxLjUsMjEuNGMtMC4yLDAtMC4zLDAtMC41LDBsMCwwYy0wLjIsMC0wLjMsMC0wLjUsMCAgICBjLTIyLTAuMi0zOC45LTcuMi01MS40LTIxLjRDMTU3LjcsMTc2LjIsMTY0LjUsMTA3LjksMTY0LjYsMTA3LjN6IiBmaWxsPSIjMDAwMDAwIi8+CgkJPHBhdGggZD0iTTQ0Ni44LDM4My42YzAtMC4xLDAtMC4yLDAtMC4zYzAtMC44LTAuMS0xLjYtMC4xLTIuNWMtMC42LTE5LjgtMS45LTY2LjEtNDUuMy04MC45Yy0wLjMtMC4xLTAuNy0wLjItMS0wLjMgICAgYy00NS4xLTExLjUtODIuNi0zNy41LTgzLTM3LjhjLTYuMS00LjMtMTQuNS0yLjgtMTguOCwzLjNjLTQuMyw2LjEtMi44LDE0LjUsMy4zLDE4LjhjMS43LDEuMiw0MS41LDI4LjksOTEuMyw0MS43ICAgIGMyMy4zLDguMywyNS45LDMzLjIsMjYuNiw1NmMwLDAuOSwwLDEuNywwLjEsMi41YzAuMSw5LTAuNSwyMi45LTIuMSwzMC45Yy0xNi4yLDkuMi03OS43LDQxLTE3Ni4zLDQxICAgIGMtOTYuMiwwLTE2MC4xLTMxLjktMTc2LjQtNDEuMWMtMS42LTgtMi4zLTIxLjktMi4xLTMwLjljMC0wLjgsMC4xLTEuNiwwLjEtMi41YzAuNy0yMi44LDMuMy00Ny43LDI2LjYtNTYgICAgYzQ5LjgtMTIuOCw4OS42LTQwLjYsOTEuMy00MS43YzYuMS00LjMsNy42LTEyLjcsMy4zLTE4LjhjLTQuMy02LjEtMTIuNy03LjYtMTguOC0zLjNjLTAuNCwwLjMtMzcuNywyNi4zLTgzLDM3LjggICAgYy0wLjQsMC4xLTAuNywwLjItMSwwLjNjLTQzLjQsMTQuOS00NC43LDYxLjItNDUuMyw4MC45YzAsMC45LDAsMS43LTAuMSwyLjVjMCwwLjEsMCwwLjIsMCwwLjNjLTAuMSw1LjItMC4yLDMxLjksNS4xLDQ1LjMgICAgYzEsMi42LDIuOCw0LjgsNS4yLDYuM2MzLDIsNzQuOSw0Ny44LDE5NS4yLDQ3LjhzMTkyLjItNDUuOSwxOTUuMi00Ny44YzIuMy0xLjUsNC4yLTMuNyw1LjItNi4zICAgIEM0NDcsNDE1LjUsNDQ2LjksMzg4LjgsNDQ2LjgsMzgzLjZ6IiBmaWxsPSIjMDAwMDAwIi8+Cgk8L2c+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==";
        }

        // Dispose the existing account form content.
        this.accountComposite.data.accountForm.find().dispose();

        // Add the logo.
        this.accountComposite.data.logoIV = new tabris.ImageView({
            centerX: 0,
            centerY: -180,
            height: 160
        });
        this.accountComposite.data.logoIV.set({
            image: _i("resources/images/log-dealmakefull.png")
        });
        this.accountComposite.data.logoIV.appendTo(this.accountComposite.data.accountForm);

        // Add the email/phone box.
        this.accountComposite.data.loginWithTI = new tabris.TextInput({
            centerX: 0,
            centerY: -64,
            width: 192,
            height: 32
        });
        this.accountComposite.data.loginWithTI.set({
            message: "Email/Phone",
            text: this.accountComposite.data.savedAccountData.email
        });
        this.accountComposite.data.loginWithTI.appendTo(this.accountComposite.data.accountForm);

        // Add the password box.
        this.accountComposite.data.passwordTI = new tabris.TextInput({
            centerX: 0,
            centerY: -24,
            width: 192,
            height: 32
        });
        this.accountComposite.data.passwordTI.set({
            message: "Password",
            type: "password",
            text: this.accountComposite.data.savedAccountData.password
        });
        this.accountComposite.data.passwordTI.appendTo(this.accountComposite.data.accountForm);

        // Add the sign in button.
        this.accountComposite.data.signInB = new tabris.Button({
            centerX: 0,
            centerY: 16,
            width: 192,
            height: 32
        });
        this.accountComposite.data.signInB.set({
            text: "Sign In"
        });

        // Handle presses of the sign in button.
        this.accountComposite.data.signInB.on("select", function () {
            if (!that.accountComposite.data.isSomethingAnimating && !that.accountComposite.data.isSomethingLoading && that.accountComposite.data.passwordTI.text != "" && that.accountComposite.data.loginWithTI.get.text != "") {

                // Something is loading.
                that.accountComposite.data.isSomethingLoading = true;

                // Send the login.
                that.apiCall("login", "POST", {
                    loginWith: that.accountComposite.data.loginWithTI.get("text"),
                    password: that.accountComposite.data.passwordTI.get("text")
                }).then(function (resData, status) {
                    if (status == 200) {

                        // If the login was successful, set the token, user, and VC.
                        that.token = resData.token;
                        that.user = resData.user;
                        that.isVC = resData.isVC;

                        if (!resData.emailVerified || !resData.phoneVerified) {

                            // If the user has not been verified, fade to that page.
                            that.accountComposite.data.isSomethingAnimating = true;
                            that.accountComposite.data.accountForm.animate({
                                opacity: 0
                            }, {
                                delay: 0,
                                duration: 500,
                                easing: "linear",
                                repeat: 0,
                                reverse: false
                            }).then(function () {
                                that.buildVerification();

                                that.accountComposite.data.accountForm.animate({
                                    opacity: 1
                                }, {
                                    delay: 0,
                                    duration: 500,
                                    easing: "linear",
                                    repeat: 0,
                                    reverse: false
                                }).then(function () {
                                    that.accountComposite.data.isSomethingAnimating = false;
                                });
                            });
                        } else {

                            // If the user has been verified, enter the app.
                            that.enterApp();
                        }
                    } else {
                        that.accountComposite.data.statusTV.set({
                            text: "Error: '" + resData.message + "'",
                            textColor: "#FF0000"
                        });
                    }
                    that.accountComposite.data.isSomethingLoading = false;
                });

                that.accountComposite.data.statusTV.set({
                    text: "Signing in...",
                    textColor: "#000000"
                });
            }
        });
        this.accountComposite.data.signInB.appendTo(this.accountComposite.data.accountForm);

        // Add the status textview.
        this.accountComposite.data.statusTV = new tabris.TextView({
            centerX: 0,
            centerY: 56,
            width: 192,
            height: 16
        });
        this.accountComposite.data.statusTV.set({
            text: "",
            font: Math.floor(16 / 1.2) + "px",
            alignment: "center"
        });
        this.accountComposite.data.statusTV.appendTo(this.accountComposite.data.accountForm);

        // Add the create account buttton.
        this.accountComposite.data.createAccountB = new tabris.Button({
            centerX: 0,
            centerY: 160,
            width: 192,
            height: 32
        });
        this.accountComposite.data.createAccountB.set({
            text: "Create Account"
        });
        this.accountComposite.data.createAccountB.on("select", function () {
            if (!that.accountComposite.data.isSomethingAnimating && !that.accountComposite.data.isSomethingLoading) {
                that.accountComposite.data.isSomethingAnimating = true;
                that.accountComposite.data.accountForm.animate({
                    opacity: 0
                }, {
                    delay: 0,
                    duration: 500,
                    easing: "linear",
                    repeat: 0,
                    reverse: false
                }).then(function () {

                    that.accountComposite.data.savedAccountData.password = that.accountComposite.data.passwordTI.text;

                    that.buildCreateAccount(0);

                    that.accountComposite.data.accountForm.animate({
                        opacity: 1
                    }, {
                        delay: 0,
                        duration: 500,
                        easing: "linear",
                        repeat: 0,
                        reverse: false
                    }).then(function () {
                        that.accountComposite.data.isSomethingAnimating = false;
                    });
                });
            }
        });
        this.accountComposite.data.createAccountB.appendTo(this.accountComposite.data.accountForm);

    };

    this.buildCreateAccount = function (stage) {
        var that = this;

        // Dispose the existing account form content.
        this.accountComposite.data.accountForm.find().dispose();

        switch (stage) {
            case 0:

                // Add the name box.
                this.accountComposite.data.nameTI = new tabris.TextInput({
                    centerX: 0,
                    centerY: -120,
                    width: 192,
                    height: 32
                });
                this.accountComposite.data.nameTI.set({
                    message: "Name",
                    text: that.accountComposite.data.savedAccountData.name
                });
                this.accountComposite.data.nameTI.appendTo(this.accountComposite.data.accountForm);

                // Add the email box.
                this.accountComposite.data.emailTI = new tabris.TextInput({
                    centerX: 0,
                    centerY: -80,
                    width: 192,
                    height: 32
                });
                this.accountComposite.data.emailTI.set({
                    message: "Email",
                    keyboard: "email",
                    text: this.accountComposite.data.savedAccountData.email
                });
                this.accountComposite.data.emailTI.appendTo(this.accountComposite.data.accountForm);

                // Add the phone box.
                this.accountComposite.data.phoneTI = new tabris.TextInput({
                    centerX: 0,
                    centerY: -40,
                    width: 192,
                    height: 32
                });
                this.accountComposite.data.phoneTI.set({
                    message: "Phone",
                    keyboard: "phone",
                    text: this.accountComposite.data.savedAccountData.phone
                });
                this.accountComposite.data.phoneTI.appendTo(this.accountComposite.data.accountForm);

                // Add the password box.
                this.accountComposite.data.passwordTI = new tabris.TextInput({
                    centerX: 0,
                    centerY: 0,
                    width: 192,
                    height: 32
                });
                this.accountComposite.data.passwordTI.set({
                    message: "Password",
                    type: "password",
                    text: this.accountComposite.data.savedAccountData.password
                });
                this.accountComposite.data.passwordTI.appendTo(this.accountComposite.data.accountForm);

                // Add the VC selector.
                this.accountComposite.data.eTB = new tabris.ToggleButton({
                    centerX: 0,
                    centerY: 40,
                    width: 192,
                    height: 32
                });
                this.accountComposite.data.vcTB = new tabris.ToggleButton({
                    centerX: 0,
                    centerY: 80,
                    width: 192,
                    height: 32
                });
                this.accountComposite.data.eTB.set({
                    text: "Entrepreneur",
                    checked: !this.accountComposite.data.savedAccountData.isVC
                });
                this.accountComposite.data.vcTB.set({
                    text: "Venture Capitalist",
                    checked: this.accountComposite.data.savedAccountData.isVC
                });
                this.accountComposite.data.eTB.on("select", function () {
                    that.accountComposite.data.vcTB.set({
                        checked: false
                    });
                });
                this.accountComposite.data.vcTB.on("select", function () {
                    that.accountComposite.data.eTB.set({
                        checked: false
                    });
                });
                this.accountComposite.data.eTB.appendTo(this.accountComposite.data.accountForm);
                this.accountComposite.data.vcTB.appendTo(this.accountComposite.data.accountForm);

                // Add the next buttton.
                this.accountComposite.data.nextB = new tabris.Button({
                    centerX: 0,
                    centerY: 120,
                    width: 192,
                    height: 32
                });
                this.accountComposite.data.nextB.set({
                    text: "Next"
                });
                this.accountComposite.data.nextB.on("select", function () {
                    if (!that.accountComposite.data.isSomethingAnimating && !that.accountComposite.data.isSomethingLoading && that.accountComposite.data.emailTI.text != "" && that.accountComposite.data.phoneTI.text != "" && that.accountComposite.data.nameTI.text != "") {

                        that.accountComposite.data.savedAccountData.name = that.accountComposite.data.nameTI.text;
                        that.accountComposite.data.savedAccountData.email = that.accountComposite.data.emailTI.text;
                        that.accountComposite.data.savedAccountData.phone = that.accountComposite.data.phoneTI.text;
                        that.accountComposite.data.savedAccountData.password = that.accountComposite.data.passwordTI.text;
                        that.accountComposite.data.savedAccountData.isVC = !that.accountComposite.data.eTB.checked;

                        that.accountComposite.data.isSomethingAnimating = true;
                        that.accountComposite.data.accountForm.animate({
                            opacity: 0
                        }, {
                            delay: 0,
                            duration: 500,
                            easing: "linear",
                            repeat: 0,
                            reverse: false
                        }).then(function () {
                            that.buildCreateAccount(1);

                            that.accountComposite.data.accountForm.animate({
                                opacity: 1
                            }, {
                                delay: 0,
                                duration: 500,
                                easing: "linear",
                                repeat: 0,
                                reverse: false
                            }).then(function () {
                                that.accountComposite.data.isSomethingAnimating = false;
                            });
                        });
                    }
                });
                this.accountComposite.data.nextB.appendTo(this.accountComposite.data.accountForm);

                // Add the status textview.
                this.accountComposite.data.statusTV = new tabris.TextView({
                    centerX: 0,
                    centerY: 150,
                    width: 192,
                    height: 16
                });
                this.accountComposite.data.statusTV.set({
                    text: "",
                    font: Math.floor(16 / 1.2) + "px",
                    alignment: "center"
                });
                this.accountComposite.data.statusTV.appendTo(this.accountComposite.data.accountForm);

                // Add the back buttton.
                this.accountComposite.data.backB = new tabris.Button({
                    centerX: 0,
                    centerY: 192,
                    width: 192,
                    height: 32
                });
                this.accountComposite.data.backB.set({
                    text: "Back"
                });
                this.accountComposite.data.backB.on("select", function () {
                    if (!that.accountComposite.data.isSomethingAnimating && !that.accountComposite.data.isSomethingLoading) {
                        that.accountComposite.data.isSomethingAnimating = true;
                        that.accountComposite.data.accountForm.animate({
                            opacity: 0
                        }, {
                            delay: 0,
                            duration: 500,
                            easing: "linear",
                            repeat: 0,
                            reverse: false
                        }).then(function () {

                            that.accountComposite.data.savedAccountData.name = that.accountComposite.data.nameTI.text;
                            that.accountComposite.data.savedAccountData.email = that.accountComposite.data.emailTI.text;
                            that.accountComposite.data.savedAccountData.phone = that.accountComposite.data.phoneTI.text;
                            that.accountComposite.data.savedAccountData.password = that.accountComposite.data.passwordTI.text;
                            that.accountComposite.data.savedAccountData.isVC = !that.accountComposite.data.eTB.checked;
                            that.buildSignIn();

                            that.accountComposite.data.accountForm.animate({
                                opacity: 1
                            }, {
                                delay: 0,
                                duration: 500,
                                easing: "linear",
                                repeat: 0,
                                reverse: false
                            }).then(function () {
                                that.accountComposite.data.isSomethingAnimating = false;
                            });
                        });
                    }
                });
                this.accountComposite.data.backB.appendTo(this.accountComposite.data.accountForm);
                break;

            case 1:
                // Add the profile label.
                this.accountComposite.data.profileTV = new tabris.TextView({
                    centerX: 0,
                    centerY: -96,
                    width: 192,
                    height: 32
                });
                this.accountComposite.data.profileTV.set({
                    text: "Profile:",
                    font: Math.floor(24 / 1.2) + "px"
                });
                this.accountComposite.data.profileTV.appendTo(this.accountComposite.data.accountForm);

                // Add the profile imageview.
                this.accountComposite.data.profileIV = new tabris.ImageView({
                    centerX: 0,
                    centerY: 0,
                    width: 160,
                    height: 160
                });
                this.accountComposite.data.profileIV.set({
                    image: this.accountComposite.data.savedAccountData.profile
                });
                this.accountComposite.data.profileIV.appendTo(this.accountComposite.data.accountForm);

                // Add the choose button.
                this.accountComposite.data.chooseB = new tabris.Button({
                    centerX: 0,
                    centerY: 96,
                    width: 192,
                    height: 32
                });
                this.accountComposite.data.chooseB.set({
                    text: "Choose Photo"
                });
                this.accountComposite.data.chooseB.on("select", function () {
                    if (!that.accountComposite.data.isSomethingAnimating && !that.accountComposite.data.isSomethingLoading) {
                        navigator.camera.getPicture(function (img) {
                            that.accountComposite.data.savedAccountData.profile = img;
                            that.accountComposite.data.profileIV.set({
                                image: that.accountComposite.data.savedAccountData.profile
                            });
                        }, function (message) {
                            that.handError(new Error(message));
                        }, {
                            quality: 50,
                            targetWidth: 64,
                            targetHeight: 64,
                            sourceType: navigator.Camera.PictureSourceType.PHOTOLIBRARY,
                            destinationType: navigator.Camera.DestinationType.DATA_URL
                        });
                    }
                });
                this.accountComposite.data.chooseB.appendTo(this.accountComposite.data.accountForm);

                // Add the back button.
                this.accountComposite.data.backB = new tabris.Button({
                    centerX: 0,
                    centerY: 192,
                    width: 192,
                    height: 32
                });
                this.accountComposite.data.backB.set({
                    text: "Back"
                });
                this.accountComposite.data.backB.on("select", function () {
                    if (!that.accountComposite.data.isSomethingAnimating && !that.accountComposite.data.isSomethingLoading) {
                        that.accountComposite.data.isSomethingAnimating = true;
                        that.accountComposite.data.accountForm.animate({
                            opacity: 0
                        }, {
                            delay: 0,
                            duration: 500,
                            easing: "linear",
                            repeat: 0,
                            reverse: false
                        }).then(function () {

                            that.buildCreateAccount(0);

                            that.accountComposite.data.accountForm.animate({
                                opacity: 1
                            }, {
                                delay: 0,
                                duration: 500,
                                easing: "linear",
                                repeat: 0,
                                reverse: false
                            }).then(function () {
                                that.accountComposite.data.isSomethingAnimating = false;
                            });
                        });
                    }
                });
                this.accountComposite.data.backB.appendTo(this.accountComposite.data.accountForm);

                // Add the next button.
                this.accountComposite.data.nextB = new tabris.Button({
                    centerX: 0,
                    centerY: 120,
                    width: 192,
                    height: 32
                });
                this.accountComposite.data.nextB.set({
                    text: "Next"
                });
                this.accountComposite.data.nextB.on("select", function () {
                    if (!that.accountComposite.data.isSomethingAnimating && !that.accountComposite.data.isSomethingLoading) {
                        if (that.accountComposite.data.savedAccountData.isVC) {

                            that.accountComposite.data.isSomethingLoading = true;

                            // Get the longitude and latitude.
                            navigator.geolocation.getCurrentPosition(function (geo) {

                                // Reverse geocode.
                                var xhr = new XMLHttpRequest();
                                xhr.addEventListener("readystatechange", function () {
                                    if (this.readyState === 4) {
                                        var resData = JSON.parse(this.responseText);

                                        that.apiCall("users", "POST", {
                                            email: that.accountComposite.data.savedAccountData.email,
                                            phone: that.accountComposite.data.savedAccountData.phone,
                                            name: that.accountComposite.data.savedAccountData.name,
                                            password: that.accountComposite.data.savedAccountData.password,
                                            isVC: that.accountComposite.data.savedAccountData.isVC,
                                            latitude: geo.coords.latitude,
                                            longitude: geo.coords.longitude,
                                            place: resData.formatted_address
                                        }).then(function (resData, status) {
                                            if (status == 200) {
                                                that.token = resData.login.json.token;
                                                that.user = resData.login.json.user;
                                                that.isVC = resData.isVC;
                                                that.accountComposite.data.isSomethingAnimating = true;
                                                that.accountComposite.data.accountForm.animate({
                                                    opacity: 0
                                                }, {
                                                    delay: 0,
                                                    duration: 500,
                                                    easing: "linear",
                                                    repeat: 0,
                                                    reverse: false
                                                }).then(function () {
                                                    that.buildVerification();

                                                    that.accountComposite.data.accountForm.animate({
                                                        opacity: 1
                                                    }, {
                                                        delay: 0,
                                                        duration: 500,
                                                        easing: "linear",
                                                        repeat: 0,
                                                        reverse: false
                                                    }).then(function () {
                                                        that.accountComposite.data.isSomethingAnimating = false;
                                                    });
                                                });
                                            } else {
                                                that.accountComposite.data.statusTV.set({
                                                    text: "Error: '" + resData.message + "'",
                                                    textColor: "#FF0000"
                                                });
                                            }
                                            that.accountComposite.data.isSomethingLoading = false;
                                        });

                                        that.accountComposite.data.statusTV.set({
                                            text: "Creating account...",
                                            textColor: "#000000"
                                        });
                                    }
                                });
                                xhr.open("GET", "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + geo.coords.latitude + "," + geo.coords.longitude + "&result_type=sublocality&key=AIzaSyD_RXoSJoSeG4tnr7jf6fYLxCfnJvzW1_8");
                                xhr.send();
                            });


                        } else {
                            that.accountComposite.data.isSomethingAnimating = true;
                            that.accountComposite.data.accountForm.animate({
                                opacity: 0
                            }, {
                                delay: 0,
                                duration: 500,
                                easing: "linear",
                                repeat: 0,
                                reverse: false
                            }).then(function () {
                                that.buildCreateAccount(2);

                                that.accountComposite.data.accountForm.animate({
                                    opacity: 1
                                }, {
                                    delay: 0,
                                    duration: 500,
                                    easing: "linear",
                                    repeat: 0,
                                    reverse: false
                                }).then(function () {
                                    that.accountComposite.data.isSomethingAnimating = false;
                                });
                            });
                        }
                    }
                });
                this.accountComposite.data.nextB.appendTo(this.accountComposite.data.accountForm);

                break;

            case 2:
                // Add the tag label.
                this.accountComposite.data.tagTV = new tabris.TextView({
                    centerX: 0,
                    centerY: -140,
                    width: 192,
                    height: 32
                });
                this.accountComposite.data.tagTV.set({
                    text: "Card Subtitle:",
                    font: Math.floor(24 / 1.2) + "px"
                });
                this.accountComposite.data.tagTV.appendTo(this.accountComposite.data.accountForm);

                // Add the tag box.
                this.accountComposite.data.tagTI = new tabris.TextInput({
                    centerX: 0,
                    centerY: -80,
                    width: 192,
                    height: 72
                });
                this.accountComposite.data.tagTI.set({
                    message: "A sentence describing you as a VC.",
                    type: "multiline",
                    text: this.accountComposite.data.savedAccountData.tag
                });
                this.accountComposite.data.tagTI.appendTo(this.accountComposite.data.accountForm);

                // Add the back label.
                this.accountComposite.data.backTV = new tabris.TextView({
                    centerX: 0,
                    centerY: -20,
                    width: 192,
                    height: 32
                });
                this.accountComposite.data.backTV.set({
                    text: "Card Back:",
                    font: Math.floor(24 / 1.2) + "px"
                });
                this.accountComposite.data.backTV.appendTo(this.accountComposite.data.accountForm);

                // Add the back box.
                this.accountComposite.data.backTI = new tabris.TextInput({
                    centerX: 0,
                    centerY: 60,
                    width: 192,
                    height: 72
                });
                this.accountComposite.data.backTI.set({
                    message: "The back of your VC card.",
                    type: "multiline",
                    text: this.accountComposite.data.savedAccountData.back
                });
                this.accountComposite.data.backTI.appendTo(this.accountComposite.data.accountForm);

                // Add the next buttton.
                this.accountComposite.data.nextB = new tabris.Button({
                    centerX: 0,
                    centerY: 140,
                    width: 192,
                    height: 32
                });
                this.accountComposite.data.nextB.set({
                    text: "Next"
                });
                this.accountComposite.data.nextB.on("select", function () {
                    if (!that.accountComposite.data.isSomethingAnimating && !that.accountComposite.data.isSomethingLoading && that.accountComposite.data.tagTI.text != "" && that.accountComposite.data.backTI.text != "") {

                        that.accountComposite.data.isSomethingLoading = true;

                        // Get the longitude and latitude.
                        navigator.geolocation.getCurrentPosition(function (geo) {

                            // Reverse geocode.
                            var xhr = new XMLHttpRequest();
                            xhr.addEventListener("readystatechange", function () {
                                if (this.readyState === 4) {
                                    var resData = JSON.parse(this.responseText);

                                    that.apiCall("users", "POST", {
                                        email: that.accountComposite.data.savedAccountData.email,
                                        phone: that.accountComposite.data.savedAccountData.phone,
                                        name: that.accountComposite.data.savedAccountData.name,
                                        password: that.accountComposite.data.savedAccountData.password,
                                        isVC: that.accountComposite.data.savedAccountData.isVC,
                                        tag: that.accountComposite.data.tagTI,
                                        back: that.accountComposite.data.backTI,
                                        latitude: geo.coords.latitude,
                                        longitude: geo.coords.longitude,
                                        place: resData.formatted_address
                                    }).then(function (resData, status) {
                                        if (status == 200) {
                                            that.token = resData.login.json.token;
                                            that.user = resData.login.json.user;
                                            that.isVC = resData.isVC;
                                            that.accountComposite.data.isSomethingAnimating = true;
                                            that.accountComposite.data.accountForm.animate({
                                                opacity: 0
                                            }, {
                                                delay: 0,
                                                duration: 500,
                                                easing: "linear",
                                                repeat: 0,
                                                reverse: false
                                            }).then(function () {
                                                that.buildVerification();

                                                that.accountComposite.data.accountForm.animate({
                                                    opacity: 1
                                                }, {
                                                    delay: 0,
                                                    duration: 500,
                                                    easing: "linear",
                                                    repeat: 0,
                                                    reverse: false
                                                }).then(function () {
                                                    that.accountComposite.data.isSomethingAnimating = false;
                                                });
                                            });
                                        } else {
                                            that.accountComposite.data.statusTV.set({
                                                text: "Error: '" + resData.message + "'",
                                                textColor: "#FF0000"
                                            });
                                        }
                                        that.accountComposite.data.isSomethingLoading = false;
                                    });

                                    that.accountComposite.data.statusTV.set({
                                        text: "Creating account...",
                                        textColor: "#000000"
                                    });
                                }
                            });
                            xhr.open("GET", "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + geo.coords.latitude + "," + geo.coords.longitude + "&result_type=sublocality&key=AIzaSyD_RXoSJoSeG4tnr7jf6fYLxCfnJvzW1_8");
                            xhr.send();
                        });
                    }
                });
                this.accountComposite.data.nextB.appendTo(this.accountComposite.data.accountForm);

                // Add the status textview.
                this.accountComposite.data.statusTV = new tabris.TextView({
                    centerX: 0,
                    centerY: 170,
                    width: 192,
                    height: 16
                });
                this.accountComposite.data.statusTV.set({
                    text: "",
                    font: Math.floor(16 / 1.2) + "px",
                    alignment: "center"
                });
                this.accountComposite.data.statusTV.appendTo(this.accountComposite.data.accountForm);

                // Add the back buttton.
                this.accountComposite.data.backB = new tabris.Button({
                    centerX: 0,
                    centerY: 212,
                    width: 192,
                    height: 32
                });
                this.accountComposite.data.backB.set({
                    text: "Back"
                });
                this.accountComposite.data.backB.on("select", function () {
                    if (!that.accountComposite.data.isSomethingAnimating && !that.accountComposite.data.isSomethingLoading) {
                        that.accountComposite.data.isSomethingAnimating = true;
                        that.accountComposite.data.accountForm.animate({
                            opacity: 0
                        }, {
                            delay: 0,
                            duration: 500,
                            easing: "linear",
                            repeat: 0,
                            reverse: false
                        }).then(function () {

                            that.accountComposite.data.savedAccountData.tag = that.accountComposite.data.tagTI.text;
                            that.accountComposite.data.savedAccountData.back = that.accountComposite.data.backTI.text;
                            that.buildCreateAccount(1);

                            that.accountComposite.data.accountForm.animate({
                                opacity: 1
                            }, {
                                delay: 0,
                                duration: 500,
                                easing: "linear",
                                repeat: 0,
                                reverse: false
                            }).then(function () {
                                that.accountComposite.data.isSomethingAnimating = false;
                            });
                        });
                    }
                });
                this.accountComposite.data.backB.appendTo(this.accountComposite.data.accountForm);
                break;
        }
    };

    this.buildVerification = function () {
        var that = this;

        // Dispose the existing account form content.
        this.accountComposite.data.accountForm.find().dispose();

        // Refreshing the status.
        var refreshStatus = function () {

            this.apiCall("users/" + that.user + "/verification/status?token=" + that.token, "GET").then(function (resData, status) {
                if (status == 200) {
                    if (resData.emailVerified && resData.phoneVerified) {
                        clearInterval(that.accountComposite.data.checkVerificationInterval);
                        that.enterApp();
                    } else {
                        if (!resData.emailVerified) {
                            that.accountComposite.data.emailStatusTV.set({
                                text: "\u2717",
                                textColor: "#FF0000"
                            });
                        } else {
                            that.accountComposite.data.emailStatusTV.set({
                                text: "\u2713",
                                textColor: "#00FF00"
                            });
                        }
                        if (!resData.phoneVerified) {
                            that.accountComposite.data.phoneStatusTV.set({
                                text: "\u2717",
                                textColor: "#FF0000"
                            });
                        } else {
                            that.accountComposite.data.phoneStatusTV.set({
                                text: "\u2713",
                                textColor: "#00FF00"
                            });
                        }
                    }
                }
            });

        };

        // Refresh the status on an interval.
        refreshStatus();
        this.accountComposite.data.checkVerificationInterval = setInterval(refreshStatus, 1000 * 15);

        // Email verified label.
        this.accountComposite.data.emailVerifiedTV = new tabris.TextView({
            centerX: -32,
            centerY: -80,
            width: 128,
            height: 32
        });
        this.accountComposite.data.emailVerifiedTV.set({
            font: Math.floor(22 / 1.3) + "px",
            text: "Email Verified:"
        });
        this.accountComposite.data.emailVerifiedTV.appendTo(this.accountComposite.data.accountForm);

        // Email verified status.
        this.accountComposite.data.emailStatusTV = new tabris.TextView({
            centerX: 80,
            centerY: -80,
            width: 32,
            height: 32
        });
        this.accountComposite.data.emailStatusTV.set({
            font: Math.floor(32 / 1.2) + "px",
            text: "?",
            textColor: "#000000"
        });
        this.accountComposite.data.emailStatusTV.appendTo(this.accountComposite.data.accountForm);

        // Email resend button.
        this.accountComposite.data.emailResendB = new tabris.Button({
            centerX: 0,
            centerY: -40,
            width: 192,
            height: 32
        });
        this.accountComposite.data.emailResendB.set({
            text: "Resend Email"
        });
        this.accountComposite.data.emailResendB.on("select", function () {
            if (!that.accountComposite.data.isSomethingLoading) {
                // Replace the button with a status textview.
                that.accountComposite.data.emailResendB.dispose();
                that.accountComposite.data.emailResendTV = new tabris.TextView({
                    centerX: 0,
                    centerY: -40,
                    width: 192,
                    height: 32
                });
                that.accountComposite.data.emailResendTV.set({
                    font: Math.floor(24 / 1.3) + "px",
                    text: "Resending..."
                });
                that.accountComposite.data.emailResendTV.appendTo(that.accountComposite.data.accountForm);

                // Ask the server to resend the email.
                that.accountComposite.data.isSomethingLoading = true;
                this.apiCall("/api/:version/users/" + that.user + "/verification/email/resend?token=" + that.token, "POST").then(function (resData, status) {
                    that.accountComposite.data.emailResendTV.set({
                        text: resData.message
                    });
                    that.accountComposite.data.isSomethingLoading = false;
                });
            }
        });
        this.accountComposite.data.emailResendB.appendTo(this.accountComposite.data.accountForm);

        // Phone verified label.
        this.accountComposite.data.phoneVerifiedTV = new tabris.TextView({
            centerX: -32,
            centerY: 40,
            width: 128,
            height: 32
        });
        this.accountComposite.data.phoneVerifiedTV.set({
            font: Math.floor(22 / 1.3) + "px",
            text: "Phone Verified:"
        });
        this.accountComposite.data.phoneVerifiedTV.appendTo(this.accountComposite.data.accountForm);

        // Phone verified status.
        this.accountComposite.data.phoneStatusTV = new tabris.TextView({
            centerX: 80,
            centerY: 40,
            width: 32,
            height: 32
        });
        this.accountComposite.data.phoneStatusTV.set({
            font: Math.floor(32 / 1.2) + "px",
            text: "?",
            textColor: "#000000"
        });
        this.accountComposite.data.phoneStatusTV.appendTo(this.accountComposite.data.accountForm);

        // Phone resend button.
        this.accountComposite.data.phoneResendB = new tabris.Button({
            centerX: 0,
            centerY: 80,
            width: 192,
            height: 32
        });
        this.accountComposite.data.phoneResendB.set({
            text: "Resend Text"
        });
        this.accountComposite.data.phoneResendB.on("select", function () {
            if (!that.accountComposite.data.isSomethingLoading) {
                // Replace the button with a status textview.
                that.accountComposite.data.phoneResendB.dispose();
                that.accountComposite.data.phoneResendTV = new tabris.TextView({
                    centerX: 0,
                    centerY: -40,
                    width: 192,
                    height: 32
                });
                that.accountComposite.data.phoneResendTV.set({
                    font: Math.floor(24 / 1.3) + "px",
                    text: "Resending..."
                });
                that.accountComposite.data.phoneResendTV.appendTo(that.accountComposite.data.accountForm);

                // Ask the server to resend the text.
                that.accountComposite.data.isSomethingLoading = true;
                this.apiCall("users/" + that.user + "/verification/phone/resend?token=" + that.token, "POST").then(function (resData, status) {
                    that.accountComposite.data.phoneResendTV.set({
                        text: resData.message
                    });
                    that.accountComposite.data.isSomethingLoading = false;
                });
            }
        });
        this.accountComposite.data.phoneResendB.appendTo(this.accountComposite.data.accountForm);
    };

    this.enterApp = function () {

        this.apiCall("users/" + that.user + "/email?token=" + that.token, "GET").then(function (resData) {
            navigator.OneSignal.startInit("d1497c5f-3ef7-457c-b9cf-707070f3dbbf").handleNotificationOpened(notificationOpenedCallback).endInit();
            navigator.OneSignal.syncHashedEmail(resData.email);


            // The app has been entered.
            that.appEntered = true;

            // Dispose of the account composite.
            that.accountComposite.dispose();

            // Setup the map for the various tabs.
            that.tabs = {};

            // The previous selection.
            that.lastTabSelected = null;

            // Create the tab folder.
            that.tabFolder = new tabris.TabFolder({
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                paging: false
            }).appendTo(tabris.ui.contentView);

            // Import the code for the tabs
            that.TabBrowse = require("./tabs/tab-browse.js");
            that.TabMessages = require("./tabs/tab-messages.js");
            that.TabNotifications = require("./tabs/tab-notifications.js");
            that.TabSettings = require("./tabs/tab-settings.js");

            // Import the code for the pages
            that.PageBrowse = require("./pages/page-browse.js");
            that.PageMessages = require("./pages/page-messages.js");
            that.PageNotifications = require("./pages/page-notifications.js");
            that.PageSettings = require("./pages/page-settings.js");
            that.PageChat = require("./pages/page-chat.js");
            that.PageWeb = require("./pages/page-webview.js");
            that.PageImage = require("./pages/page-imageview.js");
            that.PageVentures = require("./pages/page-ventures.js");
            that.PageToS = require("./pages/page-tos.js");
            that.PageCredits = require("./pages/page-credits.js");
            that.PageAbout = require("./pages/page-about.js");
            that.PageAccount = require("./pages/page-account.js");

            // Create tab objects, add them to tabs, and initiate thier UIs.
            var tab;
            tab = new that.TabBrowse();
            that.tabs[tab.properties.TAB_ID] = tab;
            tab.initiateUI(that);
            tab.load(); // Load the browse tab.
            that.lastTabSelected = tab.properties.TAB_ID; // Make the browse tab the tab selected.
            tab = new that.TabMessages();
            that.tabs[tab.properties.TAB_ID] = tab;
            tab.initiateUI(that);
            tab = new that.TabNotifications();
            that.tabs[tab.properties.TAB_ID] = tab;
            tab.initiateUI(that);
            tab = new that.TabSettings();
            that.tabs[tab.properties.TAB_ID] = tab;
            tab.initiateUI(that);

            // Load/unload tabs when the selected tab is changed.
            that.tabFolder.on("selectionChanged", function (e) {
                that.tabs[e.value.data.myTab.properties.TAB_ID].load();
                if (that.lastTabSelected != null) {
                    that.tabs[that.lastTabSelected].unload();
                }
                that.lastTabSelected = e.value.data.myTab.properties.TAB_ID;
            });
        });
    };


    // How API calls are made throughout the app.
    this.apiCall = function (url, type, data) {
        var that = this;

        return new Promise(function (resolve, reject) {

            var startAppEntered = that.appEntered;
            if (that.appEntered) {
                var startPageCID = this.tabs[this.lastTabSelected].navigationView.pages()[this.tabs[this.lastTabSelected].navigationView.pages().length - 1].cid;
            }

            var xhr = new XMLHttpRequest();
            xhr.withCredentials = true;
            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    var resData = JSON.parse(this.responseText);

                    // Make sure the page is the same one as when it was called.
                    if ((!startAppEntered && !that.appEntered) || (startAppEntered && that.tabs[that.lastTabSelected].navigationView.pages()[that.tabs[that.lastTabSelected].navigationView.pages().length - 1].cid == startPageCID)) {
                        resolve(resData, this.status);
                    }
                }
            });
            xhr.open(type, "/api/v1/" + url);
            xhr.setRequestHeader("cache-control", "no-cache");
            if (data) {
                xhr.setRequestHeader("content-type", "application/json");
                xhr.send(JSON.stringify(data));
            } else {
                xhr.send();
            }
        });
    };

    // How errors are handled throughout the app.
    this.handError = function (err) {
        var that = this;

        return new Promise(function (resolve, reject) {
            if (err) {
                var errorDialog = new tabris.AlertDialog({
                    title: "Error",
                    message: err.message,
                    buttons: {
                        ok: "Send Report",
                        neutral: "Don't Report"
                    }
                });
                errorDialog.on({
                    closeOk: function () {
                        that.apiCall("error", "POST", {
                            stack: err.stack,
                            message: err.message
                        });
                    }
                });
                errorDialog.open();
                reject(err);
            } else {
                resolve();
            }
        });
    };

    this.init();
};

global.app = new App();

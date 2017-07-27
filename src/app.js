_i = require("./i.js");

// The app object.
var App = function () {

    // This is that.
    var that = this;

    this.init = function () {
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
            image: _i("resources/images/bac-business.png"),
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
        }

        // Dispose the existing account form content.
        this.accountComposite.data.accountForm.find().dispose();

        // Add the logo.
        this.accountComposite.data.logoIV = new tabris.ImageView({
            centerX: 0,
            centerY: -200,
            width: 102,
            height: 102
        });
        this.accountComposite.data.logoIV.set({
            image: _i("resources/images/log-dealmake.png")
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
        this.accountComposite.data.signInB.on("select", function () {
            if (!that.accountComposite.data.isSomethingAnimating && !that.accountComposite.data.isSomethingLoading && that.accountComposite.data.passwordTI.text != "" && that.accountComposite.data.loginWithTI.get.text != "") {

                //Send in the login.
                that.accountComposite.data.isSomethingLoading = true;
                var xhr = new XMLHttpRequest();
                xhr.withCredentials = true;
                xhr.addEventListener("readystatechange", function () {
                    if (this.readyState === 4) {
                        var resData = JSON.parse(this.responseText);
                        if (this.status == 200) {
                            that.token = resData.token;
                            that.user = resData.user;
                            that.isVC = resData.isVC;
                            if (!resData.emailVerified || !resData.phoneVerified) {
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
                                that.enterApp();
                            }
                        } else {
                            that.accountComposite.data.statusTV.set({
                                text: "Error: '" + resData.message + "'",
                                textColor: "#FF0000"
                            });
                        }
                        that.accountComposite.data.isSomethingLoading = false;
                    }
                });
                xhr.open("POST", "http://deal-make.com/api/v1/login");
                xhr.setRequestHeader("content-type", "application/json");
                xhr.setRequestHeader("cache-control", "no-cache");
                xhr.send(JSON.stringify({
                    loginWith: that.accountComposite.data.loginWithTI.get("text"),
                    password: that.accountComposite.data.passwordTI.get("text")
                }));

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
                        if (that.accountComposite.data.eTB.checked) {

                            //Send in the account details.
                            that.accountComposite.data.isSomethingLoading = true;
                            var xhr = new XMLHttpRequest();
                            xhr.withCredentials = true;
                            xhr.addEventListener("readystatechange", function () {
                                if (this.readyState === 4) {
                                    var resData = JSON.parse(this.responseText);
                                    if (this.status == 200) {
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
                                }
                            });
                            xhr.open("POST", "http://deal-make.com/api/v1/users");
                            xhr.setRequestHeader("content-type", "application/json");
                            xhr.setRequestHeader("cache-control", "no-cache");
                            xhr.send(JSON.stringify({
                                email: that.accountComposite.data.emailTI.text,
                                phone: that.accountComposite.data.phoneTI.text,
                                name: that.accountComposite.data.nameTI.text,
                                password: that.accountComposite.data.passwordTI.text,
                                isVC: !that.accountComposite.data.eTB.checked,
                                latitude: 35.227085,
                                longitude: -80.843124,
                                place: "Charlotte, NC"
                            }));

                            that.accountComposite.data.statusTV.set({
                                text: "Creating account...",
                                textColor: "#000000"
                            });


                        } else {
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

                        //Send in the account details.
                        that.accountComposite.data.isSomethingLoading = true;
                        var xhr = new XMLHttpRequest();
                        xhr.withCredentials = true;
                        xhr.addEventListener("readystatechange", function () {
                            if (this.readyState === 4) {
                                var resData = JSON.parse(this.responseText);
                                if (this.status == 200) {
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
                            }
                        });
                        xhr.open("POST", "http://deal-make.com/api/v1/users");
                        xhr.setRequestHeader("content-type", "application/json");
                        xhr.setRequestHeader("cache-control", "no-cache");
                        xhr.send(JSON.stringify({
                            email: that.accountComposite.data.savedAccountData.email,
                            phone: that.accountComposite.data.savedAccountData.phone,
                            name: that.accountComposite.data.savedAccountData.name,
                            password: that.accountComposite.data.savedAccountData.password,
                            isVC: that.accountComposite.data.savedAccountData.isVC,
                            tag: that.accountComposite.data.tagTI.text,
                            back: that.accountComposite.data.backTI.text,
                            latitude: 35.227085,
                            longitude: -80.843124,
                            place: "Charlotte, NC"
                        }));

                        that.accountComposite.data.statusTV.set({
                            text: "Creating account...",
                            textColor: "#000000"
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
                break;
        }
    };

    this.buildVerification = function () {
        var that = this;

        // Dispose the existing account form content.
        this.accountComposite.data.accountForm.find().dispose();

        // Refreshing the status.
        var refreshStatus = function () {

            var xhr = new XMLHttpRequest();
            xhr.withCredentials = true;
            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    var resData = JSON.parse(this.responseText);
                    if (this.status == 200) {
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
                }
            });
            xhr.open("GET", "http://deal-make.com/api/v1/users/" + that.user + "/verification/status?token=" + that.token);
            xhr.setRequestHeader("content-type", "application/json");
            xhr.setRequestHeader("cache-control", "no-cache");
            xhr.send();

        }
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

                that.accountComposite.data.isSomethingLoading = true;
                var xhr = new XMLHttpRequest();
                xhr.withCredentials = true;
                xhr.addEventListener("readystatechange", function () {
                    if (this.readyState === 4) {
                        var resData = JSON.parse(this.responseText);
                        that.accountComposite.data.emailResendTV.set({
                            text: resData.message
                        });
                        that.accountComposite.data.isSomethingLoading = false;
                    }
                });
                xhr.open("POST", "/api/:version/users/" + that.user + "/verification/email/resend?token=" + that.token);
                xhr.setRequestHeader("content-type", "application/json");
                xhr.setRequestHeader("cache-control", "no-cache");
                xhr.send();
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

                that.accountComposite.data.isSomethingLoading = true;
                var xhr = new XMLHttpRequest();
                xhr.withCredentials = true;
                xhr.addEventListener("readystatechange", function () {
                    if (this.readyState === 4) {
                        var resData = JSON.parse(this.responseText);
                        that.accountComposite.data.phoneResendTV.set({
                            text: resData.message
                        });
                        that.accountComposite.data.isSomethingLoading = false;
                    }
                });
                xhr.open("POST", "/api/:version/users/" + that.user + "/verification/phone/resend?token=" + that.token);
                xhr.setRequestHeader("content-type", "application/json");
                xhr.setRequestHeader("cache-control", "no-cache");
                xhr.send();
            }
        });
        this.accountComposite.data.phoneResendB.appendTo(this.accountComposite.data.accountForm);
    };

    this.enterApp = function () {

        // Dispose of the account composite.
        this.accountComposite.dispose();

        // Setup the map for the various tabs.
        this.tabs = {};

        // The previous selection.
        this.lastTabSelected = null;

        // Create the tab folder.
        this.tabFolder = new tabris.TabFolder({
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            paging: false
        }).appendTo(tabris.ui.contentView);

        // Import the code for the tabs
        //this.TabLogin = require("./tabs/tab-login.js");
        this.TabBrowse = require("./tabs/tab-browse.js");
        this.TabMessages = require("./tabs/tab-messages.js");
        this.TabNotifications = require("./tabs/tab-notifications.js");
        this.TabSettings = require("./tabs/tab-settings.js");

        // Import the code for the pages
        this.PageBrowse = require("./pages/page-browse.js");
        this.PageMessages = require("./pages/page-messages.js");
        this.PageNotifications = require("./pages/page-notifications.js");
        this.PageSettings = require("./pages/page-settings.js");
        this.PageChat = require("./pages/page-chat.js");
        this.PageWeb = require("./pages/page-webview.js");
        this.PageImage = require("./pages/page-imageview.js");
        this.PageVentures = require("./pages/page-ventures.js");
        this.PageToS = require("./pages/page-tos.js");
        this.PageCredits = require("./pages/page-credits.js");
        this.PageAbout = require("./pages/page-about.js");
        this.PageAccount = require("./pages/page-account.js");

        // Create tab objects, add them to tabs, and initiate thier UIs.
        var tab;
        tab = new this.TabBrowse();
        this.tabs[tab.properties.TAB_ID] = tab;
        tab.initiateUI(this);
        tab.load(); // Load the browse tab.
        this.lastTabSelected = tab.properties.TAB_ID; // Make the browse tab the tab selected.
        tab = new this.TabMessages();
        this.tabs[tab.properties.TAB_ID] = tab;
        tab.initiateUI(this);
        tab = new this.TabNotifications();
        this.tabs[tab.properties.TAB_ID] = tab;
        tab.initiateUI(this);
        tab = new this.TabSettings();
        this.tabs[tab.properties.TAB_ID] = tab;
        tab.initiateUI(this);

        // Load/unload tabs when the selected tab is changed.
        this.tabFolder.on("selectionChanged", function (e) {
            that.tabs[e.value.data.myTab.properties.TAB_ID].load();
            if (that.lastTabSelected != null) {
                that.tabs[that.lastTabSelected].unload();
            }
            that.lastTabSelected = e.value.data.myTab.properties.TAB_ID;
        });
    };

    this.init();
};

global.app = new App();

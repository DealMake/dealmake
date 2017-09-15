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
            this.accountComposite.data.savedAccountData.profile = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfhCA0UJzA05Xj+AAAEtElEQVRo3t2Zb0xVdRjHPxdIbwGZRiAOcCKUkxVYa41hK+FF0zW31sT1R1tFWxjZG9cLtly1VXNZy/VnrK3WepHZnJvvaiHmcmIwDWrDQiFFBk0JUCHDC/fbi37czj2ce+/v0jm+6Pm9OHf3fJ/n+Z7f73ee3/M8JyQxD+nic04wxBAZlLKCUjZQR2g+ppSm/KHdulN4jHK9o/F0zSlNAt+q0NP57CjSkTQJhNJZgnfZwb/wFZRQzDT99DMS+zeT92gKZgkOKGSeM6xn1BV376TqlWHuZuhgEEvwk7KNg80a8USc1gaDyFa3/wRmjTcpmhAT0ZMGtd5vAj8bw5W6lhQ3pVVCKKQefwlsMQQ6UiLbDPI5P9+CKXKJAFX8aLGtV3MKuIkrZFigbTCcJgLAVqv36jEA/uQ3K7QVgR5zfcDKZJ1LywcCp8y13MrkSpeWbwSWkmtlsoBsv2dgGIB86+i6zKHlC4HLAETtw7tDyxcC/7ietiYwnQZhKwKLAJixJjDj0Po/EZiwJjDpN4ECAC5Y7ut+Ljm0fCFQba6dViY7XVo+EFibFoEOAELU+EdgqQmv6czAahb7RwDuB+A7LqZEDtLu0PCNwDqTF3ycEtliwtA6f7Piq7pNCOXp96S4Qd0ihJZpyjIjspyBMNsAGKEh6RnwNOMAvMgCv+uCMRWbbO9xXUqA2GQQpbocRGl2JFZ6lOr4nLtHtdzczVJ7UKXZ27xsfmVRSyVVVDJDN910czh2Vuxhe3DV8UexWfAemfok2OpYaktQnCN0j74PujyXpGl9poe0IM71Qj2svUmKNl/2wBD7ENvJMglXF+cZJEQRxawhx+RCLUTZRKHfe2BKu5QjhHYmxe0UQrnarYh/SxDVQd0em+yGpNiGGK5CX/tBYFp7dZdjrUt0Nin+rEoc6DX6UtPzJ9Cj11XmMBfWK5pM+USTao7boKV6Tb+kS+CMXlWF6xV7RP3WO7tX613alXpTA3YEBrVFmXHKGdrs6gjZSIcedQWtLD2lwVQEOl1tuDw1qlfzlV/VqFvj7BWqMxmBCRXFoAV6Xq0pt1BqiegbPasljk7iRGICzQa0SJ9qRn5KRC262VhvTkSgTwvNs59XEDKgfBO2+7wzov1MAbCLIoKQYt4ymeV+71C80YTRqIKSqAnnG71n4BgAZfNrultJiDKHJ1daPm4azmUEKeUmtR33IsB1IFDm8uYgMObqcQUjK13eHASisXUKUkIubw4Cs4XEaKAERl3eHARy50xOEDJrPWcugeXmz+sxA2FKvAJRtUk7mhKc3P9VhvSSwiY78DwLtsVOrBu0VW2+RsQf1GicI/SEN4FhVxZUouakyZSdnNMbuiPO7iqdS3QcR/S+ObGcydQL+iJOxU6GdUA7VB370jabZexxffSZU5hc4ys+5Pic7VNEDTVUkU8eiz0bK2KMES7QTTvHPD5X3EcT9XP6BgkqoxN8wD6uJtjLmSwhzwwYMWM0YS81TD1N3OsdmhKXZn9xlEO0cjKNPrmb6N3UUctabkwcG1PXhmMc5hCt9KbhuoI6annQol2bRnF6kTP00UcfA1xhkkkmmQCyySaHbHIpoZwyyim37BMD/A2VQkNuFOY5HQAAAABJRU5ErkJggg==";
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

        // Add the remember me button.
        this.accountComposite.data.rememberMeTB = new tabris.ToggleButton({
            centerX: 0,
            centerY: 16,
            width: 192,
            height: 24
        });
        this.accountComposite.data.rememberMeTB.set({
            text: "Remember Me",
            checked: false
        });
        this.accountComposite.data.rememberMeTB.appendTo(this.accountComposite.data.accountForm);

        // Add the sign in button.
        this.accountComposite.data.signInB = new tabris.Button({
            centerX: 0,
            centerY: 56,
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
                }).then(function (res) {

                    console.log(res);

                    if (res.status == 200) {

                        // If the login was successful, set the token, user, and VC.
                        that.token = res.data.token;
                        that.user = res.data.user;
                        that.isVC = res.data.isVC;
                        that.completedTutorial = res.data.completedTutorial;
                        that.ventureCount = res.data.ventureCount;

                        if (that.accountComposite.data.rememberMeTB.checked) {

                            // Remember the token
                            tabris.fs.writeFile(tabris.fs.filesDir + "/dmtoken", that.str2ab(that.user + " " + that.token)).catch(function (err) {
                                console.log(err);
                            });

                        } else {

                            // Remove the token file.
                            tabris.fs.removeFile(tabris.fs.filesDir + "/dmtoken");

                        }

                        if (!res.data.emailVerified || !res.data.phoneVerified) {

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

                            if (!that.isVC && that.ventureCount == 0) {
                                new tabris.AlertDialog({
                                    title: "Add a Venture",
                                    message: "You haven't added any ventures. Would you like to add one?",
                                    buttons: {
                                        ok: "Add",
                                        cancel: "Continue",
                                    }
                                }).on({
                                    closeOk: function () {
                                        that.enterApp().then(function () { // Create the venture edit page.
                                            var page = new that.PageEditVenture();
                                            page.initiateUI(that.tabs[that.lastTabSelected]);
                                            page.setTarget(-1);
                                            page.setTitle("New Venture");
                                            page.setInfo({
                                                name: "Venture",
                                                tag: "My venture.",
                                                back: "Some information about the venture.",
                                                genre: 15,
                                                logo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfhCBEACS1dBP6AAAAEi0lEQVRo3sWZa2wUVRTHfwuVbltpXQq0aUKAtlQr2Kg8FKIxJGp9ECVGEh8JqQkmRpQKBkhUgmgIhqiRGL+oBDH0S0lEv2B8JEQxoiLEYmrptmm1ChTaWmrLLotljx96dpzZx+zO7Oz2TDaze8495/+/987ce85dmGSZmpV3Ec+yiDZksui3IAg7Jwu+gSiCEKJycgi0Inq9PRnw9Vw1CISoyD+BFgNeEN7MN/wCxhGEk/yFIFxidn4J7NOeP8xz+m13PuHn8y+C0IaPQs4gCGPMyh+B97XXawB4Xn+9kS/4OVxBENqZAoBfx2CUmfkh8J72+AlDs0E1u/IBX8VlBCFo2kf8nNUxKM89gXe0t00WbbNqc74vVBBCEHoosOiLOIcg/MOM3BLYrT19OsHyglpezyV8OWMIQh/TEmyxMRghkDsCO7WX65NaN6p1R67gA4wgCGfxJ7UX0Y8gXOS6zINmlpIVUM1ytrAUgO18l7TVOFEaAT+1TKOYMOH0oX0pLVXUGVc11xj6C8wnlMKnmF7LrjhMF93GZygdgTITZB3XpgDZarvvbeKtlLZhuk10BmPqUtbzIUc5b0kwkl8htun6n3pEN/F3BpGEYY6zl3ofX3CvTcAofxCkkyBBgvRlmICXU8sC/dTaLk2nfPQn5HMDJshuIhlB2skMCx3rbtELm41B6Wcttzl5hVxJgDs0jROusApgu0Fhb5oZ9kL8HFa0CKtjyq0GhQNZFmvppIgvFenyRO9j0mxQaDW9815LCUcUJcx98cZntNASPk2y1Xgh0zlqvM53J2vQZNQ6h1Os9tlIGcc0+hgrUzV6XNNt4WuKPYUP8JNGHuVOu4aPaMYrfMt0z+DLOalRR1iRrvGDmnQKxyjzBH4Wp4zld1kmDvdo3if87EGGV0m7RhticaZOdzGqTm1ZFlxVnNZIg9zsxHE5F9WxPYvzjzl0aZTz3OTUeQlD6hx0WW4E6NEI57jRTYAGLmiADa4INKn3Ga53O4QLNcR+V9671LvBrpH97jem905XBNr1bruw2xNYGBfKmfyqd9vHL5cETjPuDYEwPa4IROjyhkAHUVcEYpPgmoCPesDtBPxPoMJuNbUjMI8STwjYjoEdgewewbwQuJ+DHKIpZSLbqyuJ431gQj7WBCp5AbuCb4xEtoNHU7T6AUH40R2BEwjC8SSWRXyWUOudSMxzgQ9sO2ErUzQt+ShOP4/9poN60UPrWBoXn+/FThBrnBOoUdfNJt1s9hAxAR7hdmo4YCH0ObeaPFaqdrVzAg+p6wP6u5QdRp40MeSNpik5ZLJEOcgNapmpum3OCbykrnOBQjYyYILoZE3CrC7jK8vE7GMugJ6dtTon0KJZfAFP0WcK/Sfr4g4pzQP+vallhHep1FqwwzmBXxCEAX4zhRzkxbQ10yr1nLgu8buOiMNaayrhuNdslNcozcjXx2MEE17TW5wRqLM4R9jj8D+hAtZZJk5Y64xAo+F41XicnEohzaajr1edOVfrFHziLqE2pISXGUaIZl4VxWQpr7AkK/CYBHjSzUqYJ/kPXxhmngf75WIAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTctMDgtMTdUMDA6MDk6NDUrMDI6MDDsMI0gAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE3LTA4LTE3VDAwOjA5OjQ1KzAyOjAwnW01nAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAASUVORK5CYII="
                                            });
                                            that.tabs[that.lastTabSelected].navigationView.append(page.page);
                                        });

                                        console.log("Value of that.appEntered:");
                                        console.log(that.appEntered);

                                    },
                                    closeCancel: function () {
                                        that.enterApp();
                                    }
                                }).open();
                            } else {
                                // If the user has been verified, enter the app.
                                that.enterApp();
                            }
                        }
                    } else {
                        that.accountComposite.data.statusTV.set({
                            text: "Error: '" + res.data.message + "'",
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
            centerY: 88,
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
                    height: 18
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
                if (!that.accountComposite.data.savedAccountData.isVC) {
                    // Add the status textview.
                    this.accountComposite.data.statusTV = new tabris.TextView({
                        centerX: 0,
                        centerY: 180,
                        width: 192,
                        height: 18
                    });
                    this.accountComposite.data.statusTV.set({
                        text: "",
                        font: Math.floor(16 / 1.2) + "px",
                        alignment: "center"
                    });
                    this.accountComposite.data.statusTV.appendTo(this.accountComposite.data.accountForm);
                }

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
                            that.accountComposite.data.savedAccountData.profile = "data:image/jpg;base64," + img;
                            that.accountComposite.data.profileIV.set({
                                image: that.accountComposite.data.savedAccountData.profile
                            });
                        }, function (message) {
                            that.handleError(new Error(message));
                        }, {
                            quality: 50,
                            targetWidth: 64,
                            targetHeight: 64,
                            sourceType: 0,
                            destinationType: 0
                        });
                    }
                });
                this.accountComposite.data.chooseB.appendTo(this.accountComposite.data.accountForm);

                // Add the back button.
                this.accountComposite.data.backB = new tabris.Button({
                    centerX: 0,
                    centerY: 208,
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
                    centerY: 132,
                    width: 192,
                    height: 32
                });
                this.accountComposite.data.nextB.set({
                    text: "Next"
                });
                this.accountComposite.data.nextB.on("select", function () {
                    if (!that.accountComposite.data.isSomethingAnimating && !that.accountComposite.data.isSomethingLoading) {
                        if (!that.accountComposite.data.savedAccountData.isVC) {

                            that.accountComposite.data.isSomethingLoading = true;

                            // Get the longitude and latitude.
                            navigator.geolocation.getCurrentPosition(function (geo) {

                                // Reverse geocode.
                                var xhr = new XMLHttpRequest();
                                xhr.addEventListener("readystatechange", function () {
                                    if (this.readyState === 4) {
                                        var resData = JSON.parse(this.responseText);

                                        console.log("About to perform the post");

                                        that.apiCall("users", "POST", {
                                            email: that.accountComposite.data.savedAccountData.email,
                                            phone: that.accountComposite.data.savedAccountData.phone,
                                            name: that.accountComposite.data.savedAccountData.name,
                                            password: that.accountComposite.data.savedAccountData.password,
                                            isVC: that.accountComposite.data.savedAccountData.isVC,
                                            latitude: geo.coords.latitude,
                                            longitude: geo.coords.longitude,
                                            profile: that.accountComposite.data.savedAccountData.profile,
                                            place: resData.results[0].formatted_address
                                        }).then(function (res) {
                                            console.log("Result of the attempted account creation:");
                                            console.log(res);

                                            if (res.status == 200) {
                                                console.log("status of 200 on account creation");

                                                that.token = res.data.login.token;
                                                that.user = res.data.login.user;
                                                that.isVC = res.data.login.isVC;
                                                that.completedTutorial = res.data.login.completedTutorial;
                                                that.ventureCount = res.data.login.ventureCount;

                                                console.log("about to animate something");

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
                                                    text: "Error: '" + res.data.message + "'",
                                                    textColor: "#FF0000"
                                                });
                                            }
                                            that.accountComposite.data.isSomethingLoading = false;
                                        });

                                        console.log("Performed the post");

                                        that.accountComposite.data.statusTV.set({
                                            text: "Creating account...",
                                            textColor: "#000000"
                                        });
                                    }
                                });
                                xhr.open("GET", "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + geo.coords.latitude + "," + geo.coords.longitude + "&result_type=political&key=AIzaSyD_RXoSJoSeG4tnr7jf6fYLxCfnJvzW1_8");
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

                                    console.log("About to perform the post");

                                    that.apiCall("users", "POST", {
                                        email: that.accountComposite.data.savedAccountData.email,
                                        phone: that.accountComposite.data.savedAccountData.phone,
                                        name: that.accountComposite.data.savedAccountData.name,
                                        password: that.accountComposite.data.savedAccountData.password,
                                        isVC: that.accountComposite.data.savedAccountData.isVC,
                                        tag: that.accountComposite.data.tagTI.text,
                                        back: that.accountComposite.data.backTI.text,
                                        latitude: geo.coords.latitude,
                                        longitude: geo.coords.longitude,
                                        profile: that.accountComposite.data.savedAccountData.profile,
                                        place: resData.results[0].formatted_address
                                    }).then(function (res) {
                                        console.log("Result of the attempted account creation:");
                                        console.log(res);

                                        if (res.status == 200) {
                                            console.log("status of 200 on account creation");

                                            that.token = res.data.login.token;
                                            that.user = res.data.login.user;
                                            that.isVC = res.data.login.isVC;
                                            that.completedTutorial = res.data.login.completedTutorial;
                                            that.ventureCount = null;

                                            console.log("about to animate something");

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

                                                console.log("about to build verification");
                                                that.buildVerification();
                                                console.log("verification built");

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
                                                text: "Error: '" + res.data.message + "'",
                                                textColor: "#FF0000"
                                            });
                                        }
                                        that.accountComposite.data.isSomethingLoading = false;
                                    });

                                    console.log("Performed the post");

                                    that.accountComposite.data.statusTV.set({
                                        text: "Creating account...",
                                        textColor: "#000000"
                                    });
                                }
                            });
                            xhr.open("GET", "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + geo.coords.latitude + "," + geo.coords.longitude + "&result_type=political&key=AIzaSyD_RXoSJoSeG4tnr7jf6fYLxCfnJvzW1_8");
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

            console.log("Refresh status called. About to call API.");

            that.apiCall("users/" + that.user + "/verification/status?token=" + that.token, "GET").then(function (res) {
                console.log("API call successfull. res is");
                console.log(res);

                if (res.status == 200) {
                    if (res.data.emailVerified && res.data.phoneVerified) {
                        clearInterval(that.accountComposite.data.checkVerificationInterval);

                        console.log("Interval cleared.");
                        if (!that.isVC && that.ventureCount == 0) {
                            console.log("Creating alert");

                            new tabris.AlertDialog({
                                title: "Add a Venture",
                                message: "You haven't added any ventures. Would you like to add one?",
                                buttons: {
                                    ok: "Add",
                                    cancel: "Continue",
                                }
                            }).on({
                                closeOk: function () {
                                    that.enterApp().then(function () { // Create the venture edit page.
                                        var page = new that.PageEditVenture();
                                        page.initiateUI(that.tabs[that.lastTabSelected]);
                                        page.setTarget(-1);
                                        page.setTitle("New Venture");
                                        page.setInfo({
                                            name: "Venture",
                                            tag: "My venture.",
                                            back: "Some information about the venture.",
                                            genre: 15,
                                            logo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfhCBEACS1dBP6AAAAEi0lEQVRo3sWZa2wUVRTHfwuVbltpXQq0aUKAtlQr2Kg8FKIxJGp9ECVGEh8JqQkmRpQKBkhUgmgIhqiRGL+oBDH0S0lEv2B8JEQxoiLEYmrptmm1ChTaWmrLLotljx96dpzZx+zO7Oz2TDaze8495/+/987ce85dmGSZmpV3Ec+yiDZksui3IAg7Jwu+gSiCEKJycgi0Inq9PRnw9Vw1CISoyD+BFgNeEN7MN/wCxhGEk/yFIFxidn4J7NOeP8xz+m13PuHn8y+C0IaPQs4gCGPMyh+B97XXawB4Xn+9kS/4OVxBENqZAoBfx2CUmfkh8J72+AlDs0E1u/IBX8VlBCFo2kf8nNUxKM89gXe0t00WbbNqc74vVBBCEHoosOiLOIcg/MOM3BLYrT19OsHyglpezyV8OWMIQh/TEmyxMRghkDsCO7WX65NaN6p1R67gA4wgCGfxJ7UX0Y8gXOS6zINmlpIVUM1ytrAUgO18l7TVOFEaAT+1TKOYMOH0oX0pLVXUGVc11xj6C8wnlMKnmF7LrjhMF93GZygdgTITZB3XpgDZarvvbeKtlLZhuk10BmPqUtbzIUc5b0kwkl8htun6n3pEN/F3BpGEYY6zl3ofX3CvTcAofxCkkyBBgvRlmICXU8sC/dTaLk2nfPQn5HMDJshuIhlB2skMCx3rbtELm41B6Wcttzl5hVxJgDs0jROusApgu0Fhb5oZ9kL8HFa0CKtjyq0GhQNZFmvppIgvFenyRO9j0mxQaDW9815LCUcUJcx98cZntNASPk2y1Xgh0zlqvM53J2vQZNQ6h1Os9tlIGcc0+hgrUzV6XNNt4WuKPYUP8JNGHuVOu4aPaMYrfMt0z+DLOalRR1iRrvGDmnQKxyjzBH4Wp4zld1kmDvdo3if87EGGV0m7RhticaZOdzGqTm1ZFlxVnNZIg9zsxHE5F9WxPYvzjzl0aZTz3OTUeQlD6hx0WW4E6NEI57jRTYAGLmiADa4INKn3Ga53O4QLNcR+V9671LvBrpH97jem905XBNr1bruw2xNYGBfKmfyqd9vHL5cETjPuDYEwPa4IROjyhkAHUVcEYpPgmoCPesDtBPxPoMJuNbUjMI8STwjYjoEdgewewbwQuJ+DHKIpZSLbqyuJ431gQj7WBCp5AbuCb4xEtoNHU7T6AUH40R2BEwjC8SSWRXyWUOudSMxzgQ9sO2ErUzQt+ShOP4/9poN60UPrWBoXn+/FThBrnBOoUdfNJt1s9hAxAR7hdmo4YCH0ObeaPFaqdrVzAg+p6wP6u5QdRp40MeSNpik5ZLJEOcgNapmpum3OCbykrnOBQjYyYILoZE3CrC7jK8vE7GMugJ6dtTon0KJZfAFP0WcK/Sfr4g4pzQP+vallhHep1FqwwzmBXxCEAX4zhRzkxbQ10yr1nLgu8buOiMNaayrhuNdslNcozcjXx2MEE17TW5wRqLM4R9jj8D+hAtZZJk5Y64xAo+F41XicnEohzaajr1edOVfrFHziLqE2pISXGUaIZl4VxWQpr7AkK/CYBHjSzUqYJ/kPXxhmngf75WIAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTctMDgtMTdUMDA6MDk6NDUrMDI6MDDsMI0gAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE3LTA4LTE3VDAwOjA5OjQ1KzAyOjAwnW01nAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAASUVORK5CYII="
                                        });
                                        that.tabs[that.lastTabSelected].navigationView.append(page.page);
                                    });

                                    console.log("Value of that.appEntered:");
                                    console.log(that.appEntered);
                                },
                                closeCancel: function () {
                                    that.enterApp();
                                }
                            }).open();
                        } else {
                            // If the user has been verified, enter the app.
                            that.enterApp();
                        }
                    } else {
                        if (!res.data.emailVerified) {
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
                        if (!res.data.phoneVerified) {
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

            console.log("Reached the end of the function.");

        };

        console.log("declared the refresh function");

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

        console.log("about to declare the resenders");

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
                that.apiCall("users/" + that.user + "/verification/email/resend?token=" + that.token, "POST").then(function (res) {
                    that.accountComposite.data.emailResendTV.set({
                        text: res.data.message
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
                    centerY: 80,
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
                that.apiCall("users/" + that.user + "/verification/phone/resend?token=" + that.token, "POST").then(function (res) {
                    that.accountComposite.data.phoneResendTV.set({
                        text: res.data.message
                    });
                    that.accountComposite.data.isSomethingLoading = false;
                });
            }
        });
        this.accountComposite.data.phoneResendB.appendTo(this.accountComposite.data.accountForm);

        console.log("finished verification building");
    };

    this.enterApp = function () {

        var that = this;

        return new Promise(function (resolve) {
            that.apiCall("users/" + that.user + "/email?token=" + that.token, "GET").then(function (res) {

                // Initialize one signal.
                /*
                navigator.OneSignal.promptForPushNotificationsWithUserResponse(function (accepted) {
                    if (accepted) {
                        navigator.OneSignal.startInit("d1497c5f-3ef7-457c-b9cf-707070f3dbbf").handleNotificationOpened(notificationOpenedCallback).endInit();
                        navigator.OneSignal.syncHashedEmail(res.data.email);
                    }
                });
                */

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
                that.PageEditVenture = require("./pages/page-editventure.js");
                that.PageEditVC = require("./pages/page-editvc.js");

                // Create tab objects, add them to tabs, and initiate thier UIs.
                var tab;
                tab = new that.TabBrowse();
                that.lastTabSelected = tab.properties.TAB_ID; // Make the browse tab the tab selected.
                that.tabs[tab.properties.TAB_ID] = tab;
                tab.initiateUI(that);
                tab.load(); // Load the browse tab.
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

                resolve();
            });
        });
    };


    // How API calls are made throughout the app
    this.apiCall = function (url, type, data) {
        var that = this;

        console.log("Going to call: " + url);

        return new Promise(function (resolve, reject) {
            var startAppEntered = that.appEntered;
            if (that.appEntered) {
                console.log("Debug1:");
                console.log(that.tabs);
                console.log("Debug2:");
                console.log(that.lastTabSelected);
                console.log("Debug3:");
                console.log(that.tabs[that.lastTabSelected]);
                console.log("Debug4:");
                console.log(that.tabs[that.lastTabSelected].navigationView);
                console.log("Debug5:");
                console.log(that.tabs[that.lastTabSelected].navigationView.pages());
                console.log("Debug6:");
                console.log(that.tabs[that.lastTabSelected].navigationView.pages()[that.tabs[that.lastTabSelected].navigationView.pages().length - 1].cid);
                var startPageCID = that.tabs[that.lastTabSelected].navigationView.pages()[that.tabs[that.lastTabSelected].navigationView.pages().length - 1].cid;
            }

            console.log("C1");

            var xhr = new XMLHttpRequest();
            xhr.withCredentials = true;
            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    console.log("RAW: " + this.responseText);
                    var resData = JSON.parse(this.responseText);

                    // Make sure the page is the same one as when it was called.
                    console.log("App entered, then VS now:", startAppEntered, that.appEntered);
                    if (that.appEntered) {
                        console.log("Current page cId:", startPageCID, that.tabs[that.lastTabSelected].navigationView.pages()[that.tabs[that.lastTabSelected].navigationView.pages().length - 1].cid);
                    }
                    // if ((!startAppEntered && !that.appEntered) || (startAppEntered && that.tabs[that.lastTabSelected].navigationView.pages()[that.tabs[that.lastTabSelected].navigationView.pages().length - 1].cid == startPageCID)) {
                    resolve({
                        data: resData,
                        status: this.status
                    });
                    // }
                }
            });
            xhr.open(type, "https://deal-make.com/api/v1/" + url);
            xhr.setRequestHeader("cache-control", "no-cache");
            if (data && type == "POST") {
                xhr.setRequestHeader("content-type", "application/json");
                xhr.send(JSON.stringify(data));
            } else {
                xhr.send();
            }

            console.log("C2");
        });
    };

    // How errors are handled throughout the app.
    this.handleError = function (err) {
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

    // https://github.com/Herobone/food-app/blob/master/src/app.js (although I'm pretty sure I recognize this from stackoverflow somewhere)
    this.ab2str = function (buf) {
        return String.fromCharCode.apply(null, new Uint8Array(buf));
    };

    // https://github.com/Herobone/food-app/blob/master/src/app.js (although I'm pretty sure I recognize this from stackoverflow somewhere)
    this.str2ab = function (str) {
        var buf = new ArrayBuffer(str.length); // 2 bytes for each char
        var bufView = new Uint8Array(buf);
        for (var i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return buf;
    };

    // Initiate some app things.
    this.init();

    // Try and read the token file.
    tabris.fs.readFile(tabris.fs.filesDir + "/dmtoken").then(function (data) {

        // Parse the data.
        var parts = that.ab2str(data).split(" ");

        // Login.
        that.accountComposite.data.isSomethingLoading = true;
        that.apiCall("tokenlogin", "POST", {
            user: parts[0],
            token: parts[1]
        }).then(function (res) {
            if (res.status == 200) {
                
                // Something isnt loading.
                that.accountComposite.data.isSomethingLoading = false;

                // If the login was successful, set the token, user, and VC.
                that.token = res.data.token;
                that.user = res.data.user;
                that.isVC = res.data.isVC;
                that.completedTutorial = res.data.completedTutorial;
                that.ventureCount = res.data.ventureCount;

                // Remember the token
                tabris.fs.writeFile(tabris.fs.filesDir + "/dmtoken", that.str2ab(that.user + " " + that.token));

                if (!res.data.emailVerified || !res.data.phoneVerified) {

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

                    if (!that.isVC && that.ventureCount == 0) {
                        new tabris.AlertDialog({
                            title: "Add a Venture",
                            message: "You haven't added any ventures. Would you like to add one?",
                            buttons: {
                                ok: "Add",
                                cancel: "Continue",
                            }
                        }).on({
                            closeOk: function () {
                                that.enterApp().then(function () { // Create the venture edit page.
                                    var page = new that.PageEditVenture();
                                    page.initiateUI(that.tabs[that.lastTabSelected]);
                                    page.setTarget(-1);
                                    page.setTitle("New Venture");
                                    page.setInfo({
                                        name: "Venture",
                                        tag: "My venture.",
                                        back: "Some information about the venture.",
                                        genre: 15,
                                        logo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfhCBEACS1dBP6AAAAEi0lEQVRo3sWZa2wUVRTHfwuVbltpXQq0aUKAtlQr2Kg8FKIxJGp9ECVGEh8JqQkmRpQKBkhUgmgIhqiRGL+oBDH0S0lEv2B8JEQxoiLEYmrptmm1ChTaWmrLLotljx96dpzZx+zO7Oz2TDaze8495/+/987ce85dmGSZmpV3Ec+yiDZksui3IAg7Jwu+gSiCEKJycgi0Inq9PRnw9Vw1CISoyD+BFgNeEN7MN/wCxhGEk/yFIFxidn4J7NOeP8xz+m13PuHn8y+C0IaPQs4gCGPMyh+B97XXawB4Xn+9kS/4OVxBENqZAoBfx2CUmfkh8J72+AlDs0E1u/IBX8VlBCFo2kf8nNUxKM89gXe0t00WbbNqc74vVBBCEHoosOiLOIcg/MOM3BLYrT19OsHyglpezyV8OWMIQh/TEmyxMRghkDsCO7WX65NaN6p1R67gA4wgCGfxJ7UX0Y8gXOS6zINmlpIVUM1ytrAUgO18l7TVOFEaAT+1TKOYMOH0oX0pLVXUGVc11xj6C8wnlMKnmF7LrjhMF93GZygdgTITZB3XpgDZarvvbeKtlLZhuk10BmPqUtbzIUc5b0kwkl8htun6n3pEN/F3BpGEYY6zl3ofX3CvTcAofxCkkyBBgvRlmICXU8sC/dTaLk2nfPQn5HMDJshuIhlB2skMCx3rbtELm41B6Wcttzl5hVxJgDs0jROusApgu0Fhb5oZ9kL8HFa0CKtjyq0GhQNZFmvppIgvFenyRO9j0mxQaDW9815LCUcUJcx98cZntNASPk2y1Xgh0zlqvM53J2vQZNQ6h1Os9tlIGcc0+hgrUzV6XNNt4WuKPYUP8JNGHuVOu4aPaMYrfMt0z+DLOalRR1iRrvGDmnQKxyjzBH4Wp4zld1kmDvdo3if87EGGV0m7RhticaZOdzGqTm1ZFlxVnNZIg9zsxHE5F9WxPYvzjzl0aZTz3OTUeQlD6hx0WW4E6NEI57jRTYAGLmiADa4INKn3Ga53O4QLNcR+V9671LvBrpH97jem905XBNr1bruw2xNYGBfKmfyqd9vHL5cETjPuDYEwPa4IROjyhkAHUVcEYpPgmoCPesDtBPxPoMJuNbUjMI8STwjYjoEdgewewbwQuJ+DHKIpZSLbqyuJ431gQj7WBCp5AbuCb4xEtoNHU7T6AUH40R2BEwjC8SSWRXyWUOudSMxzgQ9sO2ErUzQt+ShOP4/9poN60UPrWBoXn+/FThBrnBOoUdfNJt1s9hAxAR7hdmo4YCH0ObeaPFaqdrVzAg+p6wP6u5QdRp40MeSNpik5ZLJEOcgNapmpum3OCbykrnOBQjYyYILoZE3CrC7jK8vE7GMugJ6dtTon0KJZfAFP0WcK/Sfr4g4pzQP+vallhHep1FqwwzmBXxCEAX4zhRzkxbQ10yr1nLgu8buOiMNaayrhuNdslNcozcjXx2MEE17TW5wRqLM4R9jj8D+hAtZZJk5Y64xAo+F41XicnEohzaajr1edOVfrFHziLqE2pISXGUaIZl4VxWQpr7AkK/CYBHjSzUqYJ/kPXxhmngf75WIAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTctMDgtMTdUMDA6MDk6NDUrMDI6MDDsMI0gAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE3LTA4LTE3VDAwOjA5OjQ1KzAyOjAwnW01nAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAASUVORK5CYII="
                                    });
                                    that.tabs[that.lastTabSelected].navigationView.append(page.page);
                                });

                                console.log("Value of that.appEntered:");
                                console.log(that.appEntered);

                            },
                            closeCancel: function () {
                                that.enterApp();
                            }
                        }).open();
                    } else {
                        // If the user has been verified, enter the app.
                        that.enterApp();
                    }
                }
            } else {

                // Remove the bad token file.
                tabris.fs.removeFile(tabris.fs.filesDir + "/dmtoken");

                // Build the sign in.
                that.buildSignIn();
            }
        });

    }).catch(function (err) {

        // If there was an error, the file probably doesn't exist.
        that.buildSignIn();
        
        console.log(tabris.fs.filesDir);

    });
};

global.app = new App();

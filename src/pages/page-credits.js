module.exports = function () {

    // That is this.
    var that = this;

    // Properties are used for reference.
    this.properties = {
        PAGE_NAME: "Credits",
        PAGE_ID: "credits",
        PAGE_BACKGROUND: "#FFFFFF",
        TEXT_PADDING: 16
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

        // The scrollview and texiew for the tos.
        this.page.data.scrollView = new tabris.ScrollView({
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
        });
        this.page.data.textView = new tabris.TextView({
            top: that.properties.TEXT_PADDING,
            bottom: that.properties.TEXT_PADDING,
            left: that.properties.TEXT_PADDING,
            right: that.properties.TEXT_PADDING
        });
        this.page.data.textView.set({
            text: "<i>DealMake LLC</i>\n\n\n" +
                "<b>Founder:</b>\n" +
                "Michael Reiney\n\n" +
                "<b>Founder & Counsel:</b>\n" +
                "Margaret Reiney\n\n" +
                "<b>Developer:</b>\n" +
                "David Fine\n\n\n" +
                "Icons from 'Multimedia Collection' designed by Gregor Cresnar from Flaticon.",
            textColor: that.properties.TEXT_COLOR,
            font: that.properties.TEXT_SIZE + "px",
            markupEnabled: true
        });
        this.page.data.scrollView.append(this.page.data.textView);
        this.page.append(this.page.data.scrollView);
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



};

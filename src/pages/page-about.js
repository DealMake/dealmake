module.exports = function () {

    // That is this.
    var that = this;

    // Properties are used for reference.
    this.properties = {
        PAGE_NAME: "About",
        PAGE_ID: "about",
        PAGE_BACKGROUND: "#FFFFFF"
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
            text: "<b>About DealMake</b>\n\n" +
                "DealMake provides a connection platform for creative ventures. When a creator posts a venture on DealMake, they’re inviting other people to form a contract with them. If a match is created between an entrepreneur and a venture capitalist, they are free to do business. Both parties must match with one another for a conversation to begin. To refine your search, we allow entrepreneurs to post their idea or product by the industry in which it belongs to. Same goes for Venture Capitalists – if you are looking to invest in the next great mobile app, we will let you do just that.\n\n" +
                "Anybody is welcome to showcase his or her ideas and interests to DealMake. Whether you are creating the next great mobile application or building your own line of hammers and nails, we invite you to share your ideas on DealMake. You never know who might be looking to make a deal!",
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

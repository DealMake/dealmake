module.exports = function () {

    // That is this.
    var that = this;

    // Properties are used for reference.
    this.properties = {
        PAGE_NAME: "Webpage",
        PAGE_ID: "webview"
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
            title: this.properties.PAGE_NAME
        }).appendTo(this.tab.navigationView);

        // Setup a data object.
        this.page.data = {};

        // Set up a reference to this.
        this.page.data.myPage = this;

        // Create and append the webview.
        this.page.data.webView = new tabris.WebView({
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        });
        this.page.append(this.page.data.webView);
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

    this.setTarget = function (url) {
        this.page.data.webView.set({
            url: url
        });
    };

};

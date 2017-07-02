// The app object.
var App = function () {
    
    // This is that.
    var that = this;
    
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

    // Create tab objects, add them to tabs, and initiate thier UIs.
    var tab;
    /*
    tab = new this.TabLogin();
    this.tabs[tab.properties.TAB_ID] = tab;
    tab.initiateUI(this);
    tab.load(); // Load the login tab.
    this.lastTabSelected = tab.properties.TAB_ID; // Make the login tab the tab selected.
    */
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

global.app = new App();

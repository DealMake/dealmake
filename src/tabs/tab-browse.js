module.exports = function () {
    // That is this.
    var that = this;

    // Properties are used for reference.
    this.properties = {
        TAB_NAME: "Let's Deal",
        TAB_ICON: _i("resources/images/tab-browse.png"),
        TAB_ICON_SELECTED: _i("resources/images/tab-browse.png"),
        TOOLBAR_SHOW: true,
        TABFOLDER_SHOW: true,
        TABFOLDER_INCLUDE: true,
        TAB_ID: "browse",
        HOME_ICON: _i("resources/images/act-home.png")
    };

    // The tab itself.
    this.tab = null;

    // Add the tab to the tab folder
    this.initiateUI = function (app) {

        // The app object.
        this.app = app;

        // Create the tab.
        this.tab = new tabris.Tab({
            title: this.properties.TAB_NAME,
            image: {
                src: this.properties.TAB_ICON,
                scale: 2
            },
            selectedImage: {
                src: this.properties.TAB_ICON_SELECTED,
                scale: 2
            }
        });

        // Reference to this.
        this.tab.data.myTab = this;

        // If the tab is to be included in the tab folder, include it.
        if (this.properties.TABFOLDER_INCLUDE) {
            this.tab.appendTo(this.app.tabFolder);
        }

        // Add a navigation view to the tab.
        this.navigationView = new tabris.NavigationView({
            top: 0,
            left: 0,
            bottom: 0,
            right: 0
        }).set({
            toolbarVisible: this.properties.TOOLBAR_SHOW
        }).appendTo(this.tab);

        // Create a home action.
        this.homeAction = new tabris.Action({
            title: "Home",
            image: {
                src: this.properties.HOME_ICON,
                scale: 3
            }
        });
        this.homeAction.on("select", function () {
            that.returnHome();
        });
        this.homeAction.appendTo(this.navigationView);

        // Create a browse page and append it to the navigation view.
        var page = new this.app.PageBrowse();
        page.initiateUI(this);
        this.navigationView.append(page.page);
    };

    // Called when the tab is switched to.
    this.load = function () {

        // Show or hide the tab folder.
        if (this.properties.TABFOLDER_SHOW && this.app.tabFolder.tabBarLocation == "hidden") {
            this.app.tabFolder.set({
                tabBarLocation: "auto"
            });
        } else if (!this.properties.TABFOLDER_SHOW && this.app.tabFolder.tabBarLocation == "auto") {
            this.app.tabFolder.set({
                tabBarLocation: "hidden"
            });
        }

        // Load the top page.
        this.navigationView.pages()[this.navigationView.pages().length - 1].data.myPage.load();
    };

    // Called when the tab is switched away from.
    this.unload = function () {

        // Unload the top page.
        this.navigationView.pages()[this.navigationView.pages().length - 1].data.myPage.unload();
    };

    // Called when the navigationview returns home.
    this.returnHome = function () {

        // Dispsose every page except for the bottom one.
        while (this.navigationView.pages().length > 1) {
            this.navigationView.pages()[this.navigationView.pages().length - 1].dispose();
        }
        this.navigationView.pages()[0].data.myPage.homeState();
    };

};

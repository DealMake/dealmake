module.exports = function () {
    // That is this.
    var that = this;

    // Properties are used for reference.
    this.properties = {
        PAGE_NAME: "Let's Deal",
        PAGE_ID: "browse",
        BACKGROUND_COLOR: "##FFFFFF",
        CARD_COLOR: "#E0E0E0",
        CARD_WIDTH: 240,
        CARD_HEIGHT: 240,
        FRONT_INNER_MARGIN: 12,
        FRONT_IMAGE_SIZE: 64,
        FRONT_TITLE_HEIGHT: 24,
        FRONT_NAME_HEIGHT: 22,
        FRONT_PLACE_HEIGHT: 20,
        FRONT_TAG_SIZE: 14,
        FRONT_TOP_TEXT_PADDING: 8,
        FRONT_TAG_PADDING: 12,
        FRONT_IMAGE_PADDING: 16,
        FRONT_TITLE_COLOR: "#000000",
        FRONT_NAME_COLOR: "#000000",
        FRONT_PLACE_COLOR: "#000000",
        FRONT_TAG_COLOR: "#000000",
        FRONT_OVERLAY_MULT: 0.5,
        RETURN_TO_MIDDLE_TIME: 0.5,
        FLIP_TIME: 0.5,
        DRAG_ROTATION_DIV: 500,
        BACK_MARGIN_VERTICAL: 16,
        BACK_MARGIN_HORIZONTAL: 12,
        CARD_CORNER_RADIUS: 8,
        FRONT_CHECK_COLOR: "#00FF00",
        FRONT_X_COLOR: "#FF0000",
        BACK_TEXT_SIZE: 14,
        USED_CARD_FADE_TIME: 1,
        ALL_DONE_COLOR: "#404040",
        ALL_DONE_TEXT: "That's it for now.",
        LOADING_MORE_TEXT: "Loading more cards...",
        ALL_DONE_SIZE: 24,
        VERDICT_DISTANCE: 120,
        VERDICT_SPEED: 1000,
        THROW_VELOCITY_MULT: 0.5
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

        // Reference to this.
        this.page.data.myPage = this;

        console.log("GH1");

        // Background.
        this.page.data.browseBackground = new tabris.ImageView({
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        });
        this.page.data.browseBackground.set({
            image: _i("resources/images/bac-browse.png"),
            scaleMode: "fill"
        });
        this.page.data.browseBackground.appendTo(this.page);

        // Logo.
        this.page.data.bwLogo = new tabris.ImageView({
            centerY: -160,
            centerX: 0,
            width: 102,
            height: 102
        });
        this.page.data.bwLogo.set({
            image: _i("resources/images/log-dealmakebw.png")
        });
        this.page.data.bwLogo.appendTo(this.page);

        console.log("GH2");

        // Card data.
        this.page.data.discardedCards = [];
        this.page.data.topCard = null;
        this.page.data.nextCard = null;
        this.page.data.queuedCards = [];

        // Card loading info.
        this.page.data.lastCardLoaded = -1;
        this.page.data.moreCards = true;
        this.page.data.loadingCards = true;
        this.page.data.nextCardText = null;
        this.page.data.topCardText = null;


        // Fill the queued cards with dummy data.
        this.page.data.topCard.composite = this.createCardComposite();
        this.page.data.topCard.composite.data.type = "next";
        this.buildFront({
            id: 1,
            type: "vc",
            profileImage: "data:image/jpeg;base64,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",
            profileName: "John Smith",
            tag: "A VC that will help your ideas grow!",
            back: "<b>Lorem ipsum</b><br/>Dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim.<br/><br/>" +
                "<b>Aliquam lorem</b><br/>Ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh.<br/><br/>" +
                "<b>Donec sodales</b><br/>Sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a libero. Fusce vulputate eleifend sapien. Vestibulum purus quam, scelerisque ut, mollis sed, nonummy id, metus. Nullam accumsan lorem in dui. Cras ultricies mi eu turpis hendrerit fringilla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; In ac dui quis mi consectetuer lacinia. Nam pretium turpis et arcu. Duis arcu tortor, suscipit eget, imperdiet nec, imperdiet iaculis, ipsum. Sed aliquam ultrices mauris. Integer ante arcu, accumsan a, consectetuer eget, posuere ut, mauris.<br/><br/>" +
                "<b>Praesent adipiscing</b><br/>Phasellus ullamcorper ipsum rutrum nunc. Nunc nonummy metus. Vestibulum volutpat pretium libero. Cras id dui. Aenean ut eros et nisl sagittis vestibulum. Nullam nulla eros, ultricies sit amet, nonummy id, imperdiet feugiat, pede. Sed lectus. Donec mollis hendrerit risus. Phasellus nec sem in justo pellentesque facilisis. Etiam imperdiet imperdiet orci. Nunc nec neque. Phasellus leo dolor, tempus non, auctor et, hendrerit quis, nisi. Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada. Praesent congue erat at massa. Sed cursus turpis vitae tortor.<br/><br/>" +
                "<b>Donec posuere</b><br/>Vulputate arcu. Phasellus accumsan cursus velit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed aliquam, nisi quis porttitor congue, elit erat euismod orci, ac placerat dolor lectus quis orci. Phasellus consectetuer vestibulum elit. Aenean tellus metus, bibendum sed, posuere ac, mattis non, nunc. Vestibulum fringilla pede sit amet augue. In turpis. Pellentesque posuere. Praesent turpis. Aenean posuere, tortor sed cursus feugiat, nunc augue blandit nunc, eu sollicitudin urna dolor sagittis lacus. Donec elit libero, sodales nec, volutpat a, suscipit non, turpis. Nullam sagittis.<br/><br/>",
            place: "Charlotte, NC",
            composite: null
        });
        this.page.data.topCard.composite.appendTo(this.page.topCardComposite);

        /*, {
            id: 2,
            type: "e",
            profileImage: "data:image/png;base64,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",
            profileName: "Dummy",
            tag: "A dumb business based on a dumb pun. A smart investment though!",
            title: "Dummy's Dummies",
            back: "<b>Lorem ipsum</b><br/>Dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim.<br/><br/>" +
                "<b>Aliquam lorem</b><br/>Ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh.<br/><br/>" +
                "<b>Donec sodales</b><br/>Sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a libero. Fusce vulputate eleifend sapien. Vestibulum purus quam, scelerisque ut, mollis sed, nonummy id, metus. Nullam accumsan lorem in dui. Cras ultricies mi eu turpis hendrerit fringilla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; In ac dui quis mi consectetuer lacinia. Nam pretium turpis et arcu. Duis arcu tortor, suscipit eget, imperdiet nec, imperdiet iaculis, ipsum. Sed aliquam ultrices mauris. Integer ante arcu, accumsan a, consectetuer eget, posuere ut, mauris.<br/><br/>" +
                "<b>Praesent adipiscing</b><br/>Phasellus ullamcorper ipsum rutrum nunc. Nunc nonummy metus. Vestibulum volutpat pretium libero. Cras id dui. Aenean ut eros et nisl sagittis vestibulum. Nullam nulla eros, ultricies sit amet, nonummy id, imperdiet feugiat, pede. Sed lectus. Donec mollis hendrerit risus. Phasellus nec sem in justo pellentesque facilisis. Etiam imperdiet imperdiet orci. Nunc nec neque. Phasellus leo dolor, tempus non, auctor et, hendrerit quis, nisi. Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada. Praesent congue erat at massa. Sed cursus turpis vitae tortor.<br/><br/>" +
                "<b>Donec posuere</b><br/>Vulputate arcu. Phasellus accumsan cursus velit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed aliquam, nisi quis porttitor congue, elit erat euismod orci, ac placerat dolor lectus quis orci. Phasellus consectetuer vestibulum elit. Aenean tellus metus, bibendum sed, posuere ac, mattis non, nunc. Vestibulum fringilla pede sit amet augue. In turpis. Pellentesque posuere. Praesent turpis. Aenean posuere, tortor sed cursus feugiat, nunc augue blandit nunc, eu sollicitudin urna dolor sagittis lacus. Donec elit libero, sodales nec, volutpat a, suscipit non, turpis. Nullam sagittis.<br/><br/>",
            logo: "data:image/png;base64,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",
            place: "Charlotte, NC",
            composite: null
        }, {
            id: 3,
            type: "e",
            profileImage: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABGdBTUEAANjr9RwUqgAAACBjSFJNAACHCwAAjBYAAPxVAACE5AAAeX0AAO/qAAA9LgAAIBYq3yLhAAACA2lDQ1BJQ0MgUHJvZmlsZQAAOMut001rE0EYB/D/JvQFfEFE8VRYQUoPqYRGoRepbdpK+hKXNKVW0LKZ3SbbZjfL7CRtxU8hgh6qCF48ePIkFNGjIGKLIPkcKkUQXZ/ZcTYHKSL4wLC/GWbm2XlmF8ju22HYzADwA8Er16bMG6s3zYEusjiBsxjBBZtF4aRlLeDIOPwEQz4/jsq98G9xklNCwMiRz9SVr0rXlKvSWyIU5IY0a9gO+S45x6uVIvmZ3Keu/FK6pvxWusPqcm2XnA8cLwAyg+Rxx40YWeZacyLmk5+Qu77fov2z2+QRFnJam5Xjo7Iu6pV3zgMT72j+bm9sZQh4PkCv9603NvyA+leAvfu9sa/3kloZ5x5H64WxZMg4tgb03YrjL+NA/wfg56U4/v4ijn88pNyHwOsD1uad3/UyjPfA3/rqzKoPHAito6zqkkQeePqGzkOco+cjasNbwOk9wKJa0XVkCgXdVA2T6PMWbYb/HH6zrfc8Re24J0rye5D3t7/OZyvaQa18XduNZpbSOd5sSTsUVrr2TqO6or1hz1npPs3ygrbjTs9o83ZlWXuzNZ/mdYPlNFfUWUrnO/b0fC9XsawND4uwwdQ3JqOfzrW7KvXq8+0/zi/c7eSOiq1wh3v1hjAn6Q9zzWLLD9vC5TmzFLCLOXMsn78MAL8AgkGhEVfEpAAAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAYdEVYdFNvZnR3YXJlAFF1aWNrVGltZSA3LjYuNCtolyQAAAAHdElNRQfaDBcMChiX1p52AAAAEnRFWHRDb21tZW50AEFwcGxlTWFyawokq7OcAAAsa0lEQVR4Xn17B1gVZ/713ArSe7eCxt672MFGR+lVEBGlN6UoRaU3EXssqIhYsPdYYmJsMSYaNWpM3WSzm2K6Ro3nO+9ciGR3v7/Pc5537nC5zjm/8yvvnUEKiVuLiIRNmLtoi4zohI2InrcO4TH1CI+tR2TMGkQRkQs2IGbRZsRlbkNy/h5klhxAfsUBLKs5iOXVB1BTdRhra49hU91pbKw8jtqCPSjOeB25iWuQuYhI2oiMpNeRnrodaWlNSM3ah5ScQ1hUdREVJ3/EsUfAx89f4Ale4NmLF/jH05c4+tFLlO27gwVLcpGamYK0jCQkLFqE8LnRmD17DmZMnwx390lwmzIG0yaMxpRRwzB+6ABiIFyHiHUA1/7ysVjHDdZBd9xPhhS+4HVEJ25DHC9sXsp2xCRtQawQhCLMjVuHKCKSIkXOX4dY/mxe6jYk5exC9opW5JZRhKpWrKg9hMqaI1iz6iQ2rDqF9dXHUV+8HyVZW5BH8mnx67Fo/gYkxW/CwoRtSEjajqSUFqSmtSIp+zDiy99C5fHHOPrgJR6R+JOXf+Jn/InL3wDrT/8T8XlFJJ+CpNSFiE+Yj/CoMATM8YOP90xMEwKQvNu44Zg4fNDfiOtWHdrJ66AjP3YQBQiaW4/QeSLCGxGVsIErCc9rQGTUKkRGr6La9YigG8Tx3Ph1mJe8FQszGcWle7B45T7klLSgsGw/yqoPob7mGNbXncKGqhOoLjyMgvQDyE3Zhrrl5WhqKMee19dg76aN2FjdjJXL92NpwQESO4W5mW8iuvI+Ks4CZz8Hvn75Ej9RgJvfA1sv/AsL8wqQmpGMlNRFdMB8zJs/F1ERoZgz2xueHu6YOn4MJo7ojwnD2qP/96h3jH47+TED++oEmDIjA+4e2ZjpnYuZPnlELmZ4LMEMz8WY6bUEs7zz4eGzFJ6+y+A9uxD+4dUInrca4QkNiE1bj/jMdUjK2oDsvK0oyt2FwsV7sDTzKJrX1eHaQV/8cscOT28Z4dl7jvj9Ayv8ccsaL+4YAh+ZAHcs8fyuNX68ORAfnfXG8WN1aLr2LS5+B9z7Dbj8KbD5/HdYsLiA0U+UHbAwaQFdMA9xcdEICfaH5ww3TB07Aq5D2yP+iqx4/Xfi/UlaR1y39oU0cXIAJkyajfGTuE4OhOvEAGIOxk7k8aQgrsEYNzEErpNDeZ7rlChM9VoId58ETPdfBI/gDPiEZMEvOB8z/fNRXVqIb64PJulO+OO2Pf54rzOJ2+CPR3549mFPvLhnjz/vO+OPB13w/NPJ+PPj6fjzI1O8eGBN1kb486YZvnt/Jm7f2oeWKz9hadMXCE3NQ3ziPMQnxWMBMX9BLFM0AoEBvvCaNhWTRgzuEG1BWkf2v8nrbD+2LfpjBvaBFB0ZjMiIIESGhyAiLAhhoYEICwlASFAQggMD+Z8EtGE2LeeH2X4BLEBBmB0UAd85YfAPDIWfbxA8vMLw1gE3PLuphxc3LfDkAzOKYIffP7TDs0fhePZ4O54/cCac8PJBD/z5oC/+fDgOf3zqjRcfOVIEG7y460RHOOLlhwZ4/tFAvscV104FIzMlGmHzU7GABTA+mULQAVEx4XIKeLhNwuTRQ5n/g5kCgzBBpIBwAh0xbgjJDiZZCjB6YO9XGKDDKEIqWpaDomVLZBQuJfKyUSCQm4X8JekycrNTkZOVgiWsxEsyk5GdnoSs9ARkpC1Aasp8JCal4ZO3h+K3Gxr8RvK/37TEU0b92S0bPKcAL+5a4E/a/uU9c1rfArjviBePXsPTR1Px/MVL/PECeP7lXDx70BkvHzJF7ltQALriQyumCc9RtDM7PJHMFMjIyEMG///k5ATExUZibmgwQuZ4IczXA8G+0xHkMx2BXu6Y4+kG/1lTZPjOmAgfwtPdlRgHj6mu8JjsihmTRkOqr6nA6toKrKotlyFeC6yq4evqctRVlXItk9eaipWoqVyB6spi1FasQG3ZcpSuKMVn54fh10tq/PyuBQUwxJP3TegAE1reBM/vmJCIGf68a0YhTCmCJVPAipanKPes8ezjYXjx3TY8ffw2nn0WyKh3pQh0wUM7vOT7nt+zwMs7TI/PpuPxh7FYVx6J/PzlKF6WjfxcBicrGYvTF2IJa0NWShzdMg+ZTBeBjIUxSF0QjdT4aKTERyF5fiSS4iKwMDYC8TFhWDA3BFJtTRkE2gWoa8OqWnGOxGsrdT+XwfM1FKSmRH5dVlWDN/aH4ts3JXx/2Rg/XzXH77cG4bcPbPH0fUP88YExXUAhbhmz8JlRDCGCBS1vpXMDCb4UQjywx/NHw/HikxF4+agP/nzUA2BN+POhjSzCi3tm+OP+YICd4emDkTi2xQvLS8pRWV6MCtacqtJ8VJbkoWplHipX5KJieS7Ki3NRynVl8RKUFC7GSgomsGJpFpGN5XlZRCYFYGTrSOZvYMRlMXhcw+NXAhDV4v0rea6cPb8Yn75hSgH08a+39fHjlU745bolfrlhjN/eM5RFeEJHtAvxR5sjnt81ogjGeMlO8PKBDQuhvRzxFx93JnkXXfQpjIyHVnSMSCEjPGUaPbvtgufvG+Bc0zSUldbxWkuxuno56iuLeFwso7YNdVXCqUWorSqic4tQXVHIlYLxXFVFMV8XQarhBwj8TyEEYRki8it1qF7J/6QEFZV1OLtrAr46a4Mvzxnh64tqPL5igu9vTcTP14QQejJ+f89AxpObBqwL+nh+24AkDOgI4q4JyVkyyt2YDhSC+Y+HrB9fhePJvwrx7GFvvLzroEsVIRyd9OwWP0+464YKJxuno6y8jtfOgPC6RHr+hSqmKFFdsVxGTeUrVNE51bIAxW0CVDHKQoQOQohVvK6rKpHzX3yYsH6dgDjP99zdb4pPzzjh8zP6+PcFJX687IKfHuUwHTrRDUoKocFPVzX49V19FkghBKP4vikdYUYRjGQxXjC///zICU9+WIMnnwWTsAWefh6L5/9IpFtEZ7Dkeyz4fj08o5Oe3DSSBfj5hhK/XZXQsj6WwajlNYrAvEK7EOK6/y8hpBoSbMdfInRADQlXM/JCpBohTm0pqmqqsHNNFG7ttcLDI5b4+JgCX5xW4utzSnx5UR/fv6nC92+r8cM7agqhwk/XFPj5uoaOoDNuMDXYJZ7cGYWn993x+12SFOQ+dsPThzPwx+P9+PWrRTxnij9vs5N8aMzUsaM4AWyrQgA9udv8cp1F96oS/7xogA2VBagmSREs4YT/FKJdhP8lxN8EkFGpE6JdEJl8rbDYK0HKq+twdP0QvL/XGrf3aXH/oITPTgoRSPiGF746L+HfbynwHfH920o8phACP13R4tdr+vjphhl+vWGFn//djF9/eohnN0SU2fuZ53987Ifn993wxyeBeHp3NKNux5xnV/kyEU9u9cSTG/r8XTVdxf/rsh5+ekfC+weGsyBWMj15zSId/j9u6OgKQV4IIVVXrmRb0+E/xZAJ80MF2gVYXVlOESpxeqMtru/sjGu7lPhwv5IuUOKTkxI+PS3hH28o8I+zjA6F+NfFNjEu0RUU4Yd3mBb3gxjlrSyUffH03gz89uEQ/PoBbX6TkX7yOZ7e7oMnX23G719VcpJkSrCQ/iYsz5rykxDwms5ZPxDfs/3+8E437GrI4oZMtG7Rof4uRMfjv4uw4v8WoF2Ev6GyEmvqcnFqrTUubu2Md7Yr8H6LEh8dkPDxUQpwot0NKnx5RsJX5yR8fV6Bb95UymJ8/5Y+3SDhhxvO+OXDyfjuzlj8/mAeCW9geljS7iOYGovw6z13CqTmOQPa3Qg/XlXg8WWNnFaPKeL3FPTbSwqKq8Q3F9R4f193VFawK5C8XKsohMD/EkKgXQipigPN30UQ9qf12wRpJy6f4yqwoTYJx+udcG5DN1zcrMGNHRI+3CsxFfTw8JCEL0j8kxMKfHZCic9PsS6cUfwlhBDhO170D2/rSPzMWvH7uyPx871w/Hp7En541wq/PgrDLzeHci1mnncicSW+Yyp9K0OQVvFzhKDCZSp8Qcd9RvE31+XJKdouQkchOgrySow2AdohSFexBghUdxDhlRDiuJoOCMKR2n44tcYFZ9ZLeLMpBm+ePoeLp9/CzcuXsK3ImReph0d0w6dMDSHCF0yNL9+gCGfpBiEEHfHNRUFGg2/piO9v9OQkOYp57YRf3huEXz+twI+XHEhcjW+ZQv/isPXPCwpZxK/PqeQU+4r4knVHpN2jIxKOb56Musp6uVC3E24Xol2Mji4QQkhV5WwHJF8pRCDR6jYh/iJPMWoqdUVRoLq6Gg2lATjW4IVj9c44uDUMe1sO441jrTh7tBVvnTkOraTFnHHO+OFqF3x8RIFHjI5Ii8/oii9Osz68oSIJDaOnliP4z/MUg4J8+5YBW6g9RelKUZzx3bXu+Dc7yj/Pd+L71fhSED6jpsOU+OyUAp+z83wiRD6uwv3DEq7u6MEgiVG+48T6Kvodj9tFkApyOR4W5KGkpAgV5ToRKoUAFSQryLcTb0+N6ho0FPng0LoEHGgYgkPNLWhtacHxw3tw7uQhFBbkQKvVQFIZImyaE364oC93iY95gY+O8oLZMkVqfHlag3+cEdCSlIgm0+SsToyvL2hpbyt8/aYhvn5DD19dcKF7LGXSIrUeHiX4OQL3GfmPDonzPfHBLmOsr1mmG+spQD1HeQGdGK/wSgwKEBMZgsT4WO7sElGQvxhlFEJE/W8uaBOgmrNANWeA1UXeOL4lF3vXxaCFAuzfswP7mhtx6fxxBPh6w9raBra2dpAkE+xrsMfHBxW418pCSSEe8oIfHlGyWOoTeiSlT1doCRFdkSp0iIgy1y957nPa+9M3uuPRKQsWWRUe8HfvHxJFV4G7JH6Xn32buHPYEreaNWiqS0JtbRWJ6wToSFx3Thy/coI0fMhATJkwlhfuiQWxUchbnIGylYUk2y5CuwBi5RBUXYl6CnBi4yK0bCzF7t1N2LdrB1q2b8bFN46gl4szunTpAienLrCytcGYwU747LQebu/lRe5T4m4rI8aLf3BYn+nRie3TjFHuSRu3dxDaWxTQtvWT48RJS0a6kyzgPXabO/tV8mfd2ifJeJ+vb+zWw7u7NGhZ5c0aUCeTX13H3S3doHNCRxGEMDoXSKZGxrAyN0P3bg6Y6DoKMRHB3Punopxb3co2JwgBatkyhAhVLIL1y/2xt3wC9u5oRMtuomkr9u7cgtNH90ApSejevbuMbt2coda3wdXmruwSJvigRYNbLQoea+gIQchAJvbJMXO5VgiIfJZThRCriPrDI8xxRl2Id3e/ghOoCh/sUeJmi4pQ4sYeLd5tNsS1JgMcrB+JVXUNJK8TYHUdawJFEK8Fed15nTPEa0mj1UJPTw96+iqYmhtj3OjhiIkOw1KmQyX3/7ILRGFsc0RVFR2wPBjNxYPQyKi3Nu/E7l1bsL+lEVvWVdP2kuwAl5690K17T1jbOaMqq4u8b7jBCL3fxLlBDE97tfiw1YARNSQ5PTpCRQFImOsnR/VkMR4cFlBTKB35D/eqcVsmrsR7uxX8PCXebZJwvdmA0bfClSZjHFvdnQKswepVlWhYVUEI8johdI7Q1YV2V0gKhQJKpZJQQaFQwoxucJvmhuSkBXJhlFski6PoEjoBytFQEovtRSPg3GswNm1YgyOtu3Boz3buw/OgoAB2zH9nZxd06+ECewcXhM9xxketJniPEbqxgxe+XcIHzSqO0fq4e8CAKUEBDjG/OUM8PCxEYOFkmtw7oKRTtDLpW7uVeH+3imDESfzGLgXJ63BlpyGuN9ni6q7OOL3KnkTrKEDVXwLo1so2IXQQAggnyAK0Q0nwBPr274+42GgUF+aTPEkTcptkGlRVVKCuZBG2FQxH5+598dqwQYhfGIPzJ/cjNSkGWpUalmbmTKluFMEZDk7dMWVcF9w7ZIx3t+sTCry3U8KNnSTUok8rUwSmw8ND+gTtfkiNBweZInKeC/K0eRMjvkODaxTvaqOEa9uVuCrQqMSVRjWnUQP+zBrXmnvg7GpbrJGjzmItu+B/Q+eIilcCqFQq2QlCgP4DByIuJgpFbI9V5WyLpYK4gNhAMH9KMrG/YhQcbPuhV+9+sO/cFf1694ePz0w5BYw6GcLRwREuLi5w7NIVrkN60sZmvGAtrpOAmBxv7lLjJgvXrb0GFECfDtEQtDtxbz/Tg/l9a7dafu+1rYzyZiXe2azGpddVuLRFgUubFXiH69ubVHhrqx7e2WqOS41dcW6NDQUoRUM923WdIPq/BWiHpFarZeIajYb9WwtLCzNMnToJiUyBFewGFWW0P6FzAsWoYCeoKETT8n6YOX4MLGx60Ob2MDCyQEkxHVNSAFsLS+ipVUwB/qxbD4wd2ZOzgDGublPLEbzeSOvuELmspgB6rA90ASN9b78ad/awre1RM0XUTBlGfKuEtzYpcGG9AufXKkhQgTdkSDi7luB6foM+LmwwxYWNVjjd4ICNq1ZgdX0tRRAkRSr8N/F2SIK0gL6BCsYm+hjYtydC5vggNztDjnxZyXKUc62gAOUiFcpWooKFcNOyflg2fxIsrPrC3tEaBsamKGfNOLxnCyfCfcjNTKEDusLMwg7TJ3ZnnncicdqYtr3BNBApIAT4gALcZkG8w8L2IXP8VjNTROR2owpXGeF3NlCAdQq8RbJvNihwolqBo5VqHK1Q4WiVCseJixuMcHG9AQWywLEqe6yv0wkgUkCkgnBCg7z+N2QB9PX1YWBgAGuLThg9yAXRwZ7ISU1E4eJMLFuSgWWcDQqWZMoo4uS4LDcf67JHobl0FhzsB8Daxh6dDIy5R1iJlsZ1Mo7u2Ya3zxxBQV4eFs8bKBe8a9vVuE5Lv8si+N5OUQtY1HZp5a7wbrMSt5v1KARzf6cG7zXq4/o2A5I0w+p0QyQHmiPZzwKn6zQ4UKTAgWIFDhbp4UiZCTxG2yIjwhk5obZYlWaPyhU5KC0qIJahrGgpnbkUK4ry/0IJz5XxZ+U8lvQogIZpoGUK2FoaYtyw11i1ZyEhIgALI4MwP9ifmI0FoXMQH8o1LADzQ0OQHzca+4qHYNqo4TCzdkAnPSNs21SPlm1riXXYt309DrZswxsnzuDKAQ9a3oDkVXhXJk4HUAixinS4Tpvf4c8bFpti/CBTdLU3hFZtxHqiJfQIjtbysRaLI6xwokxCa5GEoyVaWBma8ry+/DNzOwcYmtgjJW4urz8CCyLCsSAyTEY8MT8iVD5OiAzHwrnRSIuNgGRhbQ1rewdYs5D1GdgLHjOnIC4qADGBAQiZMQFeQ1+D97A+8BnRV4bvcBa7YQPgN8IFTTl9sGLuMArQBxr9Tmh+vR67tzRgT+N67N2+Dod2NeLEwVYWKEdG3wSXd9ABjL4gf4Od4PJWpsQ2PZTFWKGLlQl62RjDY5QRfEYZwH+MAULG6yHWTR8pXkaojOiEyhhDjOhuhuZlNjhXo0KidxdG3RAb0mxQG2+N1Ym9mJoTMcylF8b164cx/fsS/TCaGNm3rw79+vL1ALgN7g/f0YMgeQaHwTc8Cr6RkQibNx8LkpORQ5unJMQhYtoEzOpmi5kC3W0xq6stPLtaw6urFaY4WGB5uAtaVw7EgO69IDEFWijATkIIsKexAa1NzTi5Kw2XG424U7Nky9KTa8C7bXXg8mYtikLssTTSAM0ZBlgdp0FpUCcU+GlQ4K/G8gANKoLUKA9SodBPi5XhGuzL1+DcKi3eXq/GvpXmWJ82EsvDnFAaaY/6rBFYusAV5io9dDY2hpOxERyNDWFvZAQbpriAVSc92BoYwZlD3xh7uie/ogpFNXUoqqxBUUUtVlTXYmV5DfJyMhHjPQNeve3h080Knt2t4NWd5Htw7WGNmRTDv78NduYOQNHcgVBorEi+Dts3VmPX66vQzFTYw1H51GpzvLXNAe/ssMFluuAKLX9lm2hpKlxYo8LJchUaU5UoCdEi30+NxbMUWOypQMFsJSoCeX62Gst8tSikIFURGjRna3BlE0fq3Z1Qk2CBhrRBqIy2R/l8WzQscEC0O+sR08GS0605d6XmTG0zrqZaNUyY6iacU0w1anQ26oQRVsaQVm/ZhjXbtmPN5u2oWrsRFfVrZAFy8nIRM9sHnoO6w7unIzxec6QYTvB5rTPhBO/enTHD2QkxUwfhYOlQjH3NGlWlBdixvg47N9WiiZ95aJU7LjZIuNjoRPKOhDltzz4uyK9V4XSVEkdXKLF7sR7WzNenCCqsCFBieaACVaEaJEzTR2moPipD1aiJUmPjQiUOFepS6O5eM6yg/YOndsUiX9p/oSV25VnDd0J32JhbwsnaEp1trOTV0cYSDtYWcLCy4moNJ1tL9O1si/G9ukKq2rgZAtUbN6KkbhVdUIHcZYVIz0xD5Bw/zB4/nHk/AP4jB2H2qMHwZ97MJuaMGSbDc9hgpAWNR3NBD6zJj8GW9fVo3MQasMoPJ2okvEG8yf58YZMV3nrdBG9vVOLiOp6vVeBkhQKHl0s4sEzC/qVabM9UY2uqHnakaRE7zYSFrROG0nEH8pTYkqjA/nwtzlSzYHLz87DVFJvSHfkeM8R62mLvMkscLLGEr7srJo0dC7dxrpg6nnB1hdvE8XCfTEzSYdpk1ja3yQia5QapoKwShUyDgrJy5BWuQGZOLtLSMpGcnIK5wUEI9JiOgGlTETjdHSEzpyNk1jQZoR4zEOYxC6FeM+A3wxPL46Zgb6EFWlYMxL4yCxyvlHC8WoljJHm2wRSnGjQcWtQ4t5pDTA37eTn7+UoFDrGlHWJFP8TjY+ztB5ezvy9XY2moJckZI2KGOU6uYKpUKHGqkj2fw9BdDkof7e+ElqW28JtEgZbZ40ilGbbkdkV0SDTiwyNlzI9oQ1QE5s/lOSJubgQWRkcR0UieFw0pI3cZMnKXIjN/GVIzs5GUmopFSUlYEL8QMWERHIrYDfxnI2z2HLbHAEQEBiIiKBCRQUGcF0IpUghiQkIQFhCBqvTpvHgTHC4zIBl9nKg1pggaHqtxrFqPQwz7ejmHGEG8WInWZUrsy2NPX0YxShQ4Va3GGTrjDH/nzdUaDj/cPL2uxeVNSlzayElwFWeIbRrc5+j84LAWx8psWRCNcKzSEnuLDVCTNQ1JC9OQmZiIDCIrKRlZiUnITk1BVmoyFnNdQn5L0rim6yAlJmcgkRFfmJaKhIWJiI9fgJiYGMQSkaHhiBSESTwyMAhRQcEkHYK5ISROxISGITY8nIjAPK7zQiPQVNAfB8spACNyvNYUh8pUjK4SR0r0sL+IhAskmfSeHCVaFivRnKVmYVOgdakax0vVOFunxgW65AJrx5vE+fq24zVKvMWx94MmbpUPGeDzk1o56ofLzXBghQVez7REMQllJqYhm+4VWJySKmOJQGqafJyTmk4BuKanIjcjDdK8eXGIi5uPWLbAuZFzER0ehghGNDwsFOEkHRlAAdoQ/ZcAIYgNC5MFmEeLxXLgSIiYizn+FGmmHU6s4rBSbc/iqMeLY47T5gcLNWjNU2HPEha9bCWa0tXYkapBY7IK29OU2EUh9jHXj1CsUxx1zzB9zrDXv1HLglmvoRBKXNuswfscoR8c0OLrc1ruB8woqCl25xpiVfoAZCal66IuyMsC6CBHnQLkpLVBkCdyhADBwYEICQlCSFAAggJmI9DfB7P9vBAw2w+htL4grou+sLyOvCAuRz+MUefEFRcpcioGs6a5w3WwI87U23NGt5Ajf5ARFzhAu+/PVclR35muQGOKCttIfmuyEpuJRoqxi0Vwby5TopDFkcIdL2VaVFII5v7b3Avc3qWHDzg2iy3z92+bcodogJZcU3YHLUryIpFOATpGfwlJLk5P1kU8LV0mnkOX5Gboop/LQi95+3jA19cT3t4z4cmC5zVrOjxY5Lw9ZyHIz7eDAK/sHxMainkkHyesTwHmU4CEqLmI4TqorxPONXRj3tvgECv8YbatVgog8n3vEgV2Z0loylBiuxAgSUCD1xdpsDVJH9tT9dGUqcLeHBW7AoVjcTxWosTZGiWJa3Bvn+gAuq/KHr9jiUeHjLAl3RL1Gb2QyzTOSk4leeZ6m/WzhQOY7zki+gLpAnwti5CGPCHATJKdReKeHjMxc4Y7ZkybgmncDnvPnIE5Pj5y4fu7A9oEEDlPxIkqS+KJ82LR97V+CA/2Zu53547NAgcZxcNi41KoYo4LASS0MN93pSuxI4VRF/ZPUXNVy0JsTdFge4aacwFbHgU4wkJ5nC66wu3wg4Nq+dvlh+IW3GE1vr1oIt9HWLtIi/pcL6TKkW8XQOcA2f7CCSSvSwGdA/5yAR0heXh4QsasmZg1YwZmuE+F+5SJ8JgxHXO8OwrwKv919g+THaATIFIWYPjgYTA1N8XR6v5MAXNZAEGilVVeFL59ovBRgGY6oCldRSeosINibE9hSqSqWQv0WQv0WCBVOFCg4O9yu0sHPDigwWfiG2NC3GT54oQZvrlgIt9XaMy2xsrcBUhPZvFj/utSQLe2O0GuAVz/EkC4ok0Iydd/DvznBMFndgB8fPwxy9MD09zcKcpMzPbx/ksAAbkIEsIBQgCdC5gCFCE+irurhAR0duyFDdldcKrWkjWAArDyH8iXsIdR3cPi10I0Z1KELDohk8UvU8OaIIQQ57T8uUbuEK1LKQLT5/ImNaOuwqPDuvsB9/ZqcHOHBhfWaXGYM8bOitFYvDAVGUmpTIHEDgK0pYIQgi1wSdorLCaEGNlCgMCwaARGxCAgMgZzgiLh6+cHz1mz4OXtiQB/v1cCsBb8vRDqRBCFMD4qCgtYBNMWJKCXyyAUxHbhwGOBw+z3cg2gAHtF9SdpGbIAgjydkKEh2ApJXogh1mYWwz05ahxZocDePDXqo5Soj+ZegOPxCl8NVgZZYGWYOSoiDLGmOBxpi0iyve+39/42IWQR5BkgqU0AURd0IixmGkg+AaGYHRoFf9paPPToK5zg7cfC6I0gf395BogIECJ0FEBXB4QA8Yx+IItlwGwvuA4dCFuHHojxtcXZ1ZY4LoogU+AA83nvEpVMvjlTwq4MglHflc7Kz1U4QKA5i68pyO7FGnYDJX9X4t6fm54IfSycpELsOCXmjpaQH9kHdQvssGZRJ5TmLkTaQtH/k9gGF9IFi9pEEO1wEQshXUHIIqQkyfbPphhZFCBLOGDU+CkYN4nty3063GZ4wG36THh5+cDf0wuhvn66CbCtE+hcENwmAFOA0U+YNw+ODnYwNVAhOHo+TK0d4T7KkcOLOY5RAHnUZQc4wG2saIMiFYQQTez9O7kLFNhB8mIuaFms5XaXGx7+zolyJQchFS6/rsR5rge4V6iP0nCnqERWsAM2Z9uhcdkAtr5kpHOAaxcgM5EicJLVCcA1SYjAtV0EQZ7IbINkbecEW8cu6NytB1z69MOgoSPhOm6cvHnwZyEM8vdGWCDngaA5iAwOoAN0dUA8oRkTFkwHRKBrrxEwNjGE10w39O/dA1bm3PSssZEFEDXgMNvZQW54RCq0iimQs8ButrtdzPumNEY+Q8vXnBJzKFiBklHnjpGj7wdNatzezf6/m1vgjVpOiBrODGoUhxpja05vbC71RwpH9vRFCTL5DEFedsAivn6FDNaGdAqQ0UZaRL99lcR3gUaGRjAxNoWtjT26ufRGXwoxirs8t7Gj4cmNUBCHo6hQ2p+ERf5HBzENQjkNhodgQVQ4RkwKgdbQDH6edNLwfnitZx/sKuCGSBagbbPD4UaQE+nQyijvY46LtNizWMVj9v1cDkv8mdgen1slvjJj62P1//K0FvcPcPg5qMQ7FGErB6b1Cw2wbdkQlC+dhzRR/FLpABIUkRXIbsvvxbS4DB5ns+UtYd/PyeRAlJWB3OxM5BGSnZ0DbGzsYO/gBGeS7z9wKAYPHYaRw4dj9PCRmDZlEucBD8SQqLhXEBcbhVjuqOK4s5ofG43E+THwmO4LcytHWFiaIyp8NlzHjETYVEucK2MhK+JegMQPsa0dElMhnSCIHuDs35ovrM2KT2ccZJoc5HtOcD9wfrWE01VqtkSxZ+DK1KiZq0UuC2DKNBUKgiyxKvE1lOalIy9nCZbmZGJZbpbuGec2FOYvQdHSJSheKp6FzkFxQS6WF+bJaP9ydGXxUkjOzr3QvbszevbqjQEDBmP0yDGYyjlgyuSpcB3rynUy/NkN4uNY5Wmz1GQdxHGGyCtOVNmLU2BPEbV6amhUSkxwHYpp01yxMckYp0u5xSXxI8Xc7i7Xjcat+Rx0OPcfWMohiQIIcQ5SpMOFusJ3qFhsjJS4+roh9wGGeJ1Rr4nVQ0WYGuWsAxtSJDQuH4HSFcUok1Eo39EWX8sLVJQUy6gsJcRNXkLc3qsW9zo7QDwGIPXt2xs9e74GF5c+6NuvLyaMGwGvacz/mdMoxBS4uc/EnNnMtcQFyMlOx9LcxcjPyZbXomW5SGY/nc2tsL2dI6yszGFhZsx9vASNWgtLY0usW2iISw0abm5UOM09/QkONmIu2J/DwShXuECXFgc5LAmIY9EZNsTrYe08TompHIhWauXvAU9XKrCVdWNzVg9sKItDbXUVasWd66pSGbqHu8WdX67icV/5SREd6mvFXWJxO6yybdXdL5R69OiGHj1c0KVLZzh1tsPIoQ5wc+0Oj6kjMWrUKEya7I6AObORSgGW5dFShfkyltM+JcsLEME9wIQpU2FiagwLCzOYmRnBwZZCmHaCpFFSDAOsCDfG1dVqnKqQcLKMrY15LorhXg48+9judCLQHSI9eNzCaXD9AhXKQ9VY5qVGlqj8nmrk+2tQOb8HymJd0FCagLqaKpITRAmZ8N+hezagHTrS7Wh/LfXo3hk9undD186O6NLZFoP7WGBMf0tMHNETfVgMRzMNhAApiQnIz89CUeFSLC1ciRXF5chkQYlkSxw/Zih69ujCYmrIYmoGc2MD2Jrrw9HCmMfie30tFnka4916LU6VKVgcGVXaXXYBC6EYkfdTCJESIj32il0jB6At7BClwWpkz1Ihb7YJauOcSd4ZVXHGWL9KRF4XafnR3f8QoP21IC//GUAbOorQJoAjunXrjO5du6BrFztWcDv07WmJHl2t4eDQmQVxBPz9fJBMByzJLmDkV6B5UyxObBiKVdn2cLJ3RGxUEKZPGQ2Xbo4wJXlDQwOYcTU10sJQXwmDTuLGhh7cBhvicoUBTpcwz4Xd8zgccSgS+wMxKQohZDHytbI7tnF/UDNXhbJwFZYFqNj+OPmldENVYlfU1FZ2IK9Lgfbj/xThLyH+SoVXgkhduziie7euRBemgQPTwJ7EreWKbm1jg0EDB8PTcw7mL0rH/h2BOLHWHgnuEobYSRhoKWGwiy0c+DuTXYcg2M8dbhOHcQ4whlqtgp6eBlqNFmqtChqu4g6OnYkBWnMNcY61YD+3x2Jf0JTGlRujlmwKQuxZLDqAFpuStWiI16Iumk4IU2B5iAZrkqxQnx+KqprKttwXTmiHjrwsRJsA7dCJ0BFCkDJIDpziHB3tZYhjW1sbWJK8Dck7OnZGn0GjkJQwC1caHZA6S8JYBwnDu6gwyFGFPrYSellLzH0TWFtZw46/18+5K8YPH4IBvV3kgchQnwKwM6iUkgxJEnXBEHlBpji7UoODFGA7q7rYHout8Q6xPU4heW6P1yVKWB0v0QUKlEVLWBVrgvpFvbC2qhIV4jE38fxSB7Q7QH78vwNxnShi1T0gpTsnHEAB+vfvi8GDB2LokDbweNjQQRg3ejTGjJ6IvOQJ+OJoV0x3keDaXYkx3VQY5qDCa+YSxo8cxH2DL/RZ7AwN9TlImcHe0Y7HejA3YrQtTGVRHGwsYGtpCktzI9jQHXYUzKmzE/p2McH2dCPsT5ewfZEC6+ez+M1XYHWshPo40fs1KI9UcuOjh5Joc7ZCG2wsiURlVQWqxaOuHaIvBGhPg/anW185QBzrngrr+ISYEERyd5uCGdPdOcZOgzfhNcMdvtwKe3nNwvwQbzx74EryKoxyVJC4BgNofRdav3dXC6TnFsGdewhzMwPoaTgDqJnv+ho42lrBydEGxkadoKfV0P4qaPkzPUKtVkCrVcLKyASjRwyAz4zJKE0eg7UxWjQmKFAZpsXKAA3yfbXI8lIgw9MQRcHmqJ1ngvUrvFBVsYpglOWokyhX8SSb7hkmnusggC5FBHSPxeqeDhXkdX/8IY4lf39fBLLKB872kxHE174+QRTBE4/OD8KTDzrD1ckQ/Wwk9LNXUwAVHKwNuFcYg9y8pZjOmcHezgzG7AByzpOkcISJkR6doIGhgR70eV7DmqBWa6BUijvRarg429NxfRHs7Yo+dkp0seB2N9YcJ8tNmQadsC5Ows40Dk0co083WODIpploXBWNtdXs/xVL5ecZxbMLK8qqUVpahvL2BzsJ8UjvKxe0C9ABFED+ww/xmJyHlydmeXlg1qxZmDljBsZOnskpbiLuHpmAn+744IcrGnx91Q2vmXRCP17oAOa9c4/ucJ8yFlGBHkiIC8b40UM4BJnCgGQ7Mef1tIIkoy67QiWfk8+Lc+IenZkhena2hLOtHpwMJXS2UKG3vQS/EVqcX2uAa8fcoPv3Pf548h6e/nwOvz1uxe+Pj+LJv5vx8yfFePxxMT6/noIPD0/CmV0eaFqbxYmPtaG8SieE7AhOexSgvUbU8LX8uB8FEH8HISBN5Kg7iWPvpImTMHDoRMwLH4sfrrvgX5fM8MMdP3xzTsKPb2vxUWs/OGnpAhsNrDjsDBzUDyEzB8HfYzy3nnPpmIno19MZJgaG0G8nq6Hd6QZ9jsh6hFYWQ4Nhg3qidw92H6aSs5UG9mb66GymYGFVYlehNd5cx6ivV+DcZgkXiQcHJXxyRPfk6FdvWeHr64Px/d0I/PZJCp5+U4Yfr3TD40sqfHbWHs3rF6KkpIYpoasRMjoKIM5TgCqusgDjOelNnuiGkeMnYkv1SOC++LMWCb9c18jP9X93sQseXx6NJ4/C8V5LXwy0UsHRTMNom6BvXxcM6dsNA19zQHigG8LnuGPm1DHo5dIZxsbMf40+1G2W17lBIaeG63CO3RycJg/vil4itRy06GWrgbOlAlULbXGmQY0La0l+k4Q3iWu7JPlh6E/E94GnJHzZhn8yOP+6IOHf4i9U3hTXqsaPlyScapyDErpBnvlJWvdnMu1/KMXjKkK4oGol/h/qZ1xwKOdevQAAAABJRU5ErkJggg==",
            profileName: "Dummy",
            tag: "A dumb business based on a dumb pun. A smart investment though!",
            title: "Dummy's Dummies",
            back: "<b>Lorem ipsum</b><br/>Dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim.<br/><br/>" +
                "<b>Aliquam lorem</b><br/>Ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh.<br/><br/>" +
                "<b>Donec sodales</b><br/>Sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a libero. Fusce vulputate eleifend sapien. Vestibulum purus quam, scelerisque ut, mollis sed, nonummy id, metus. Nullam accumsan lorem in dui. Cras ultricies mi eu turpis hendrerit fringilla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; In ac dui quis mi consectetuer lacinia. Nam pretium turpis et arcu. Duis arcu tortor, suscipit eget, imperdiet nec, imperdiet iaculis, ipsum. Sed aliquam ultrices mauris. Integer ante arcu, accumsan a, consectetuer eget, posuere ut, mauris.<br/><br/>" +
                "<b>Praesent adipiscing</b><br/>Phasellus ullamcorper ipsum rutrum nunc. Nunc nonummy metus. Vestibulum volutpat pretium libero. Cras id dui. Aenean ut eros et nisl sagittis vestibulum. Nullam nulla eros, ultricies sit amet, nonummy id, imperdiet feugiat, pede. Sed lectus. Donec mollis hendrerit risus. Phasellus nec sem in justo pellentesque facilisis. Etiam imperdiet imperdiet orci. Nunc nec neque. Phasellus leo dolor, tempus non, auctor et, hendrerit quis, nisi. Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada. Praesent congue erat at massa. Sed cursus turpis vitae tortor.<br/><br/>" +
                "<b>Donec posuere</b><br/>Vulputate arcu. Phasellus accumsan cursus velit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed aliquam, nisi quis porttitor congue, elit erat euismod orci, ac placerat dolor lectus quis orci. Phasellus consectetuer vestibulum elit. Aenean tellus metus, bibendum sed, posuere ac, mattis non, nunc. Vestibulum fringilla pede sit amet augue. In turpis. Pellentesque posuere. Praesent turpis. Aenean posuere, tortor sed cursus feugiat, nunc augue blandit nunc, eu sollicitudin urna dolor sagittis lacus. Donec elit libero, sodales nec, volutpat a, suscipit non, turpis. Nullam sagittis.<br/><br/>",
            logo: "data:image/png;base64,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",
            place: "Charlotte, NC",
            composite: null
        }, {
            id: 4,
            type: "e",
            profileImage: "data:image/png;base64,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",
            profileName: "Dummy",
            tag: "A dumb business based on a dumb pun. A smart investment though!",
            title: "Dummy's Dummies",
            back: "<b>Lorem ipsum</b><br/>Dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim.<br/><br/>" +
                "<b>Aliquam lorem</b><br/>Ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh.<br/><br/>" +
                "<b>Donec sodales</b><br/>Sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a libero. Fusce vulputate eleifend sapien. Vestibulum purus quam, scelerisque ut, mollis sed, nonummy id, metus. Nullam accumsan lorem in dui. Cras ultricies mi eu turpis hendrerit fringilla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; In ac dui quis mi consectetuer lacinia. Nam pretium turpis et arcu. Duis arcu tortor, suscipit eget, imperdiet nec, imperdiet iaculis, ipsum. Sed aliquam ultrices mauris. Integer ante arcu, accumsan a, consectetuer eget, posuere ut, mauris.<br/><br/>" +
                "<b>Praesent adipiscing</b><br/>Phasellus ullamcorper ipsum rutrum nunc. Nunc nonummy metus. Vestibulum volutpat pretium libero. Cras id dui. Aenean ut eros et nisl sagittis vestibulum. Nullam nulla eros, ultricies sit amet, nonummy id, imperdiet feugiat, pede. Sed lectus. Donec mollis hendrerit risus. Phasellus nec sem in justo pellentesque facilisis. Etiam imperdiet imperdiet orci. Nunc nec neque. Phasellus leo dolor, tempus non, auctor et, hendrerit quis, nisi. Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada. Praesent congue erat at massa. Sed cursus turpis vitae tortor.<br/><br/>" +
                "<b>Donec posuere</b><br/>Vulputate arcu. Phasellus accumsan cursus velit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed aliquam, nisi quis porttitor congue, elit erat euismod orci, ac placerat dolor lectus quis orci. Phasellus consectetuer vestibulum elit. Aenean tellus metus, bibendum sed, posuere ac, mattis non, nunc. Vestibulum fringilla pede sit amet augue. In turpis. Pellentesque posuere. Praesent turpis. Aenean posuere, tortor sed cursus feugiat, nunc augue blandit nunc, eu sollicitudin urna dolor sagittis lacus. Donec elit libero, sodales nec, volutpat a, suscipit non, turpis. Nullam sagittis.<br/><br/>",
            logo: "data:image/png;base64,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",
            place: "Charlotte, NC",
            composite: null
        }, {
            id: 5,
            type: "e",
            profileImage: "data:image/png;base64,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",
            profileName: "Dummy",
            tag: "A dumb business based on a dumb pun. A smart investment though!",
            title: "Dummy's Dummies",
            back: "<b>Lorem ipsum</b><br/>Dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim.<br/><br/>" +
                "<b>Aliquam lorem</b><br/>Ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh.<br/><br/>" +
                "<b>Donec sodales</b><br/>Sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a libero. Fusce vulputate eleifend sapien. Vestibulum purus quam, scelerisque ut, mollis sed, nonummy id, metus. Nullam accumsan lorem in dui. Cras ultricies mi eu turpis hendrerit fringilla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; In ac dui quis mi consectetuer lacinia. Nam pretium turpis et arcu. Duis arcu tortor, suscipit eget, imperdiet nec, imperdiet iaculis, ipsum. Sed aliquam ultrices mauris. Integer ante arcu, accumsan a, consectetuer eget, posuere ut, mauris.<br/><br/>" +
                "<b>Praesent adipiscing</b><br/>Phasellus ullamcorper ipsum rutrum nunc. Nunc nonummy metus. Vestibulum volutpat pretium libero. Cras id dui. Aenean ut eros et nisl sagittis vestibulum. Nullam nulla eros, ultricies sit amet, nonummy id, imperdiet feugiat, pede. Sed lectus. Donec mollis hendrerit risus. Phasellus nec sem in justo pellentesque facilisis. Etiam imperdiet imperdiet orci. Nunc nec neque. Phasellus leo dolor, tempus non, auctor et, hendrerit quis, nisi. Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada. Praesent congue erat at massa. Sed cursus turpis vitae tortor.<br/><br/>" +
                "<b>Donec posuere</b><br/>Vulputate arcu. Phasellus accumsan cursus velit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed aliquam, nisi quis porttitor congue, elit erat euismod orci, ac placerat dolor lectus quis orci. Phasellus consectetuer vestibulum elit. Aenean tellus metus, bibendum sed, posuere ac, mattis non, nunc. Vestibulum fringilla pede sit amet augue. In turpis. Pellentesque posuere. Praesent turpis. Aenean posuere, tortor sed cursus feugiat, nunc augue blandit nunc, eu sollicitudin urna dolor sagittis lacus. Donec elit libero, sodales nec, volutpat a, suscipit non, turpis. Nullam sagittis.<br/><br/>",
            logo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABGdBTUEAANjr9RwUqgAAACBjSFJNAACHCwAAjBYAAPxVAACE5AAAeX0AAO/qAAA9LgAAIBYq3yLhAAACA2lDQ1BJQ0MgUHJvZmlsZQAAOMut001rE0EYB/D/JvQFfEFE8VRYQUoPqYRGoRepbdpK+hKXNKVW0LKZ3SbbZjfL7CRtxU8hgh6qCF48ePIkFNGjIGKLIPkcKkUQXZ/ZcTYHKSL4wLC/GWbm2XlmF8ju22HYzADwA8Er16bMG6s3zYEusjiBsxjBBZtF4aRlLeDIOPwEQz4/jsq98G9xklNCwMiRz9SVr0rXlKvSWyIU5IY0a9gO+S45x6uVIvmZ3Keu/FK6pvxWusPqcm2XnA8cLwAyg+Rxx40YWeZacyLmk5+Qu77fov2z2+QRFnJam5Xjo7Iu6pV3zgMT72j+bm9sZQh4PkCv9603NvyA+leAvfu9sa/3kloZ5x5H64WxZMg4tgb03YrjL+NA/wfg56U4/v4ijn88pNyHwOsD1uad3/UyjPfA3/rqzKoPHAito6zqkkQeePqGzkOco+cjasNbwOk9wKJa0XVkCgXdVA2T6PMWbYb/HH6zrfc8Re24J0rye5D3t7/OZyvaQa18XduNZpbSOd5sSTsUVrr2TqO6or1hz1npPs3ygrbjTs9o83ZlWXuzNZ/mdYPlNFfUWUrnO/b0fC9XsawND4uwwdQ3JqOfzrW7KvXq8+0/zi/c7eSOiq1wh3v1hjAn6Q9zzWLLD9vC5TmzFLCLOXMsn78MAL8AgkGhEVfEpAAAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAYdEVYdFNvZnR3YXJlAFF1aWNrVGltZSA3LjYuNCtolyQAAAAHdElNRQfaDBcMChiX1p52AAAAEnRFWHRDb21tZW50AEFwcGxlTWFyawokq7OcAAAglUlEQVR4XpV7CZhdVZ3n725vf6/WUEkqJFWVjSSAIB9LBJrFIAygtoozODR2t370yAwIo92C0z0SPzewGXVoPpxWW21cGtBuHRQYbLCVgLKIHxDClrWyVFUqqe3V29+7787vd+59SSX1isZ/curee+455/735dz7rA9dd0/guh5c24EgaDaAuo9Gsw5YgB04OiCIuXAdF07SQTKRQizlIeHyvmvBCwKkOS7hOPAsD0G9gWKhgNlCHpVqFbWAC9jsh43AiSGwHARunM1Do6cLK04+FRtWd2Dtch/9XNPxgfGGjRf2AC+//Cr2/O4HSDSKsIImKpUmZktFlPMFPmMCfjNA4FdhNwI0qnXU6zU+zEJAnCwirqMhhE83p7o60k+0HCLkOGSAR+JclwTxyHOPCKtZjpDmjGYTls2FyZ/Ab8Dmg9nFpn4bvu6RiU2L/TaJIDNc9vMSfsNBuRqgRk5UqiSi4cOv+bAqPuzxaex8cSteeX0ar+22MVIN18rFA/R0WujMdfP5cbNOw/f5PAqGzbZ8xOMJQxpIfJM4+WwhXfoTEhgSL4LNwUCLeB2cdads2iypB4agulmo2agbKQZNPpBc5wksIi3O2dQC4sdzm+dchXNtDnHY6QYWHPZbvK5UgVIlDp8X/YsncNJABYMrHAwuATqTSSqER0bblFoSxZKD8RIXTfciFbeQ6QA1CZitWTg8UcLormfhNMpkAnEkLjYRkV76xC/gdZ2Sb1RLEZGh9OdKXXgfhZD4Jum1eMO6+LJPBkZaJCwcyUkNUkCWmwGWGx0tEmzDTWYRS8SoMRbitAHXCRAj0clYjGZAtfZdSiKF9St3YOWSX2Hd6qfh+QWqaAcaTpUMIvJOyWgIfJoA5xarSzA2OYBdlYsxteganDjUi0VJYHoceGXPBJ77f38HrzohtLk2W0NCaqAwm8fsdJ7mMINqhQyKiA8ZQWFRKCI0hJApYliLOQLrgos+yDlNXlJyRC6cQE7zWpxuUqrmn8SuezSZeDrNxTlDDIkl4EobSHyF5rfpTBfXbPopOuOvc71O+hMyRIRnzoVVfplzClwrRcKpxt5K2H6MKvw0zYem6JfRrLiYsjZi1P4oXildgpd3zmDnc3+PbOMgsQ39UZPaWW/UUJyZRZltdmoCDTIklPZcIlvQIj4kOhpoxll/9uGrqf3sCGjr7AjPZQ66lspFk8gS2XvQlOejkbsxIw0xIqA91yj5Wz9yEGcPbCHr0qjTLiwrYfyBm9wEdL8L1qHPch0yA3SESBCJLjTcHjjV54keza6p/gBOcwq+u4pr5/D87mV44OEERsudyHocQ2ZyKE2sQgZQ+mwlOtsmtdYQKJwNwdKEsIn4Js3lCEQkmTuf/cynNSvs0EFERheyMYEh3CwG/NV9D5k+wRc/uIljmowYaXziP/0afcmtZE6Wj6O50EEYXyFHaNdoUVUeY0ZCsJIkMIMGlsFZ8a9EmONHP4Kg/Bi1qWKQDQL6nAb9BMcGXoDHnzkNP3t+OTyni7jlqQENlItFNMo1al6RJkbT4IrCMSBOEpzwFpj1ePTpREVr0JQ285oe3brrK18OhFNENhENVUeSMP+lJkZdAlz7tX8w9+bCNz72UXzo3B+jN/YimvEcbZshiapKmnjOg+ildtFKzJo2fUpAzgR0jpbv0A0sh915I/0DJT5zF5zaM5zDUENy5GDFYKdJ1U+/HdOFZbjvoToOzK5GzJ5FTb6A5iDvb9XJAFuEEulI2GKE5hs69M8IUYIV8Xy+2le/cruhXPZuJpm/wj88o0JyEsMVz//kK98yfcdD8wc7YMeyDJt0isnlHD8GJ6CtKyKYdeUvuA7P1CcTsiVhaokYESCOptNvxtqcF9BMbH+WIZW6JGmKEfYAYmueR3X7Rjz+ZB9+P3Ye846qIZKxxBCmUNnSVDUjaBFJ36UoJ9B9Q13k66yv3vmlwDi4ucB7JuZzsMaJhjdjQAucHx+g1FMcXCNDKTlJnfNtmQEXoSIYs1Cc1PrsZUfC5A8mxDGJsizG/GaBE5XQaCx9kaRIp0cPwJC7hJozgi3bzsOzey9HIlamiBSyyaiIDpEmMAwRAREehkkcIsfOu0bIts5lLy0OGWBfyCkSxXODaEuv3gT8q/pRi59sEiXlE3XlElxHtmeSFJ9EKecwOqikRs+hJvgMn7RhK6iQwCnUUptQ7fg4I8UJdHiMEjQB6aDji5IRMsLCuSc9jtOWPsKkKsk8SMmTy/Vs0wLjwNk4R/qhPkOFTJPsotoZikSo7piOFtFHVIXH8JoqKu7OZdCbweUHlEmTPsqL6levM7ky80mHyRGYEtPbG0TFFKa8AZ1Rre821Lx3MgHjcxpxuPXDsGqTJEBqLn/AI2/5YgKBVzj/pEcx2LEV9SBlpK2432pSA41vXetcTaDr0K+JLaY39PIGIkZELDJhzGdIC8Dw91bhg/1MVmiZTFHFBJ/I+8wypQl1ES2J2hvgx85FTYjUD8GZ/Akd2TTqS77J0MgUd+p7JsNsNmt0WAy52fcYm1YMlCZZRExa8Ufr/wkdmOY5caYgIyqOIfz462P6wtMQjtGAaBR7jN1YYvEfAlcPUOJUfeXprAV8SlbXFluVEvUrO1Hr+gia/U+hWcvArv6GEeBJYOL7iBdeh5++FHVniNxn0tUoUXP7iMlickRERrbc9JBySzh71UNcm75DDJpDoGAu0WrG0bJPoGvbEB01A7x35JxgwmLI+raw88u7orP5YH1oJRkxRKmTYK7ZoB3UWFMgcymw+G/h7P8c3JEbUY8vpy3TGZIRzf6vsVA6wJB6KZodHzDS9uknmuP30Ar2MuEy7sNoV5PhshG4WN53GP3pcWqTco/5khbRxxN+pM/0LABihNyF/i0EQmTf/1qYCQKHjNC4htJVxv7mxP2ojX0ezVgfCs08rNgZcHq/RM1gerzzKiB2Mfz8fQgOfpqldIVJD/NEzq8p2VHs57WYYOoCMbW2H+sX/9j4DslL0CLwKBOOJbzVbzSgBeG5VtCAo/2C4y6PQEO5fq2J0a/uiHrag3fNEBG2KLEKj+R7mdKceQKxqWeB/Euo57eg9t4uFC6bQvGdj6J6yW4EHZ+hkxTjSnwO50qTaD51Et7wZVJkBJkhrepM7EZ37JASPFmBIThsIcGiKTzO7ScD1CFiWwSbFFLnir9Rv1o0dx5U6eUL9kcw0fFLbPv2d6Le9hC/diV9AQkhUTILEVKhyIq1Z1G/5Olo1FGoXnAvalxf4yVtM491AKv1I0cxRpsi5AeWZH/DBCpjKBQJhgxDbNhaoH6BmBBFgZBryolNemg8CY+aFd4wTGgHxfg1GHf/mAjRg9cO4ZXv3IUl+/dGd+dD/E9pDtQAn6Ygc/Cp1o3qwpZo0Zk26B98htCGkTjTHlJrTIpmoKjCPFp7IuiJDTOpYi6h1Fu0REQfy4yjmqA+e5blZKVYpo3R0ZDLAbM2qVFINI8aywggb9AOrMR7mFqU6ZyYj7sO09QttOEAPaOj0Yj5kPyzQRJCG5YtC3ml/m8CsWv7Ef/wAMdSA4hntaojqB3hsco6wPNWMzU+hKTFVDpCNUzFW8wwhBwhXg5Rp/a+/fswNjaGiUOHUJydZcZZJ0G8Y8Ke2ptDhS2waiiRifG4h20vbkNHRxf6erPo2T8eDmoDDUq/rlzBZG1vLcfIflTOlKWtNIFJpYiXX1HuVK5PkqAKsvYUBUgKIibM1Vz1tVrYTRN4aes2vPLqq9i7ew8Ojo5hlvV1rcbVoxWOzm/PjIChSPuEvqnKfLz48jYkkwlKJIbevgSu7BWL5kPuumWUqJKlBFx7RdT770PP9UOGCcahkvLQP9iolApm89W1hkmWGBpK+6gGHKUl7AtJtLdv342Xtr6C373we7z6+msYHTmAmelpLkyTkCZEhNv0Ce2AaNABNYxKVSpl7Nix02x3eZ6DTDKL516rYcff0lu1AWPTzBIr1cNRz1uDxTcNUnMkffqQlj+hFjUDD3FrjIRpGy8cO1f1Q6LDY6vPLtWqmC2VMTJ2EC9sewWvb9+BgzSHQkEVWUi8qQXItXbgBSppWXaQ4P379hn/IU1wXI/PsNHVmcWW37fXnkU3LGVMt6nKzPTawMQ9O6Oz+bDsE0M0BUqfnFCNgSBpVN+zDvGuKJUZiMhWBAv9gUhSCxnD3gbjiQoWbafnp4vY9voO7B05iJmZGSJG9eZoTWjtrhwPE/kZpBPaF7Rw+DDtkH21as0wTX7EpWa8sNvDobva+wO51wWUi4y0MH7XwhFl4FNMlflEjQv0/sLqhNdkFNCemcEkhJAR4fXx53PygDD8TU/PYGRkDOVSxTjE0KUeXex4uPMb38DPH3sMuVwaI+Oj8BwX9WqVUmmwlCb3bR8jo9rLa68FdXrwpjYK2oAkK1Pce8fCmebgLSux+tYlhuGW5cFhBWVbVXGW/4W31m4R3IoKYdO9I0/WpgV7j54bpghpsoWJxkIsCIoNPPizx3HDzbdh995REw6r1IAamWe4TYRqJb3YUC0+H0JE2jNH6l2rMmGid9v+2TdPt1d+uoPjtMuktcgMbcKICe2XDnGTBshhmRNOcF0XPV0d6FvUjXg6CSfmUTpSZc5oBdfj4PBkmZjWsHv/CM4+4wzc+cXbkGYUODw+Zoqfpt4WyR0suKHC/gWQVOqrHKHKVqHHf+l/LOwTBCf9tWeKI88Ux8TXyHQh0YVAukPCHa+JeMJG/+JFOIFMyCXTiJtdFqXG4ukC0NT2NjG0Qse3ZtUK/PDev8cnb76B9u+jnC8hm5Qv4Zg2INrNxmUbqFOTFe8ZaOAQCe0PPPvfd+K3N+0JB7SBM25PGXwFkr7RANPIiDbNmICYYCOOhGsh5QWIu+Qgo0OR4bCUn+aRBcrUlIbOgwS9vwoibXNlUi7K5SoOTxzCO846Hd/9+t246fqP4rTVWSy6sT+acSxoB0g5RDuw7SQmZzvxwvYUfvSrLvzz410MsfQxJR9P/MXC2jBbKKIwNY3C9CyKdOb5fB7TM9NHWp59BeY7RZ5b8ViM/iPM+7tyMawaWIbBwZWUWpp9TFTkCKlOivNfeOKF8Alz4EP9nXh21wiqfMjX7/4ikl6YhJh3hfEEMrl+nH7d9eHg42D49p304DyhyIb+56qwcw70mJqCkjL6pyNwy7U5XLjhMMhnxJhsbbxnuek/Hv7moo0UPEUvR0AwSkB10H6B+UdGxqmhVveiRYGJ2Wy9XXEM9S/D0hN64NO0y/mDKIwfNIzQLu63R6WPx8LXL+nAnT8vMY3eg3vvvsM4H71AVfyNuSmc96nPRSPnwxufGzYvU3/5RBbX/aIz6j0KNwzuC1+WJl0s6ySnPBsP/JuHT1wbQ1/nBP7lV/3IZibwl08siWYcC1d2xvhXsY0sbNkF+aj3Fhk3QCZB/3fl1dcE8gFM9ZCOJZBNJdCVSaBElZ/c+Tom3njdLKCJ369nzRpz4dfXp3DbtyrYenAU99/1BROBJRkZ7jv/+mtmTDvY88WdLGY8/OKxHjS8Gdz8y6XRnaNwz8ZhSslkCijXmOSkA6wdALoXWYjFmxibyDL3WI0P/mgymnEsvG1mzMzVNnjLzzQD+iqGywwZewJ9nn3a20/H6WqnnIY1a9Zh2YpBZDoWI9PZAS+RgsNBMXpVbUy3g1IxwFUXJmDV4yReu7+s3+m93oz47Z/fxQrORrXi4+zTxrGqu329EKdjVRQoVvWKiU6aQlDClkoFyHV62LtfiXgV395UjGYcCy+SjlKlRuZVGUn0Ck3h2WdEqZD5DeLJnKGvtxe93d1svUhn0pH0yCmbRy+OgHYc6BiLm/7j4ZfP2HjbGhcbhyyMHZoing4u3fx30d358MbndpvMjTihVmYxQyeoKrId7J6O0Um51MomclS+XNYn8XUKpg7XiaM0U8WTL01jz3QDP3xPeyed7syFrSNHoXYi092FbHcHsl05JEi3XWWmVaajq/jkSq2McqWIYjHPZKZs3t3Hcz2wO5gXdPRGSx4L49MWfv1CGjdenUWyuA+Xf/7u6M58eGXzuNkd1tchjaq0RepJycbJjTbw9V9Y+NHTGawabKKTxPd0u0iREYl4jBlngL7Fnbjv8RlUWE8sbo8e1q5dh3Xr1mPDyRvY1mHDhpOwfv0GrFy7HktXrYY9OznJcDGF/CRDHcPGLMNHebZA78/Swo3BIQO87hPgdp0QLXks5JYuxp6ZDuwYGcDV330i6p0Pv7t1mFIvsQWUPGt4qrK2tPSm1nxp0hZcbFjjs7y2sHS5vhzxEee5RVPzgxpy6Qbed6GLK99uI0EGtYOVg0MYGhjA4MAghgYHMTA4gFU08xOXrUDf0mWwC3kSzfy/yNhZLFDyZSLZqBJRprL6fiiZg5thkaHvVtpAPN2Fb738Gv7rIwsXLU9/fI/Z9qpVYiiVHLBq5voyg5AR2uBoB1vu8XHzVUV09AXIdjKqxGQC0bdMng9aLG58XwWxLO27PD9CCTo6OtDZ1c1jJzo7utDT0YNcVydyNINUroMmQMKr5TKdGYkvkfhyxbx3r9NRNBg3PcVzhjbzSUsbuPPJ56Kz9vDkDbuNs2HZj1Khgkqpwcb0lkxQplend6+094E0kRLypTrNsck1iAeDlcdQ6Dg0TfPKsIpCxTVaNZNPRrOOBb2V1gtQh/+U+YW5X5gL2DRxu1Ii4ZL8bAkVMaM4izoZUq1WWKtLRzVe5WYUR/8A2PLf9nENn012z2SrRuWlJoiYujSC3l3I13ndDmpkjtlCZzGh14PxhEc89K6xAfnqZIpjSgEFx6y1OT+MhkC8o+XNixFVqDqEd2gCBaaFbKXZKZTKeapogaGjYD460odIIf1hJvhW4fefKuKZmycZEWhG5GH4fp7pNRdTC3d0yRQVS3yCXqa2gzolbzZCefTcJn2BEjKux6IgHksykanRqWofo44/eYAq1Q5UhotgQ7XOlfWyn390tEvlIvN32n+5gCKJL1Mf9XFjlU2vpI7CW2PAxbkK02CGTX1LRALFN6UgYqT51CZKu81qwkc7Sn5789J3hVJCm0RkGffdWNWYge1wXRZqi3ptFGkCH3iwfTp8xweu4DP4LDbD+YiGljbrytZukF4+SMX08qHOJ9ZZz1M8/E/JHVH91nFhOD8dxymnvp2JBk1Gm6V6guG07E8jpH5CSA8PVVEfWSmktQPzzSFvpbMB1Z3jWKzFWLXq/X+DeOa6m3jvA13R6PlgHm9eprYeP/c50krWBrbFZIMVtO7JVQhrEa2XmeGsFoTcWwhuu+wCpJIJ/OzRX1PSaUo+nCyCzZ4iHxZufqhPUqRT0z4BpWkx42sPHMj/3b0uU98GiyvtPSrVzkg+NFOqxwJwx/spfU4OsRAtc4gxl0qStR4zvTgrPzeZYeKXgq3PT5UF6hPZiAjBQk7wlgs34tMXvYOOzMf5G89CLtWHAwfzxlOLUD1MPoB+y2hZSBQfbAgP+Bh6aX1L0wYanNC1iOso7it1rtFxlj1MHC7itVcrSP55++30O95/Of9G+BpCyS36DR1Fh84kaKFjx0i4SwbE0lmmmBmTCsdiHpESYnNskxM/ce4Z0UUIn7rgbLOgKkUjXa6bTCYxMsFwxWpLlq69RqEiTTCf4mi8mR3+5aW51w5cqvz+PcAjPw3w0L/Y+Nn9Dv75B8DDP8/ilC+0t3tB+I1D+OxQCnqO+gThtdyvnmtXWSCYb3iY/DS1a0Pn4rhxSkabJCJBk7WQmYdPnncm/vL8s/BXf3SWuVaOMJWfwcTsITz37FOYKc1i34Q+YKGKCxHeD3E4iohhhJIfff4mBh1B7lgQIZmsR02I4bU9AV4d9rFzrI6PPdUdjZgPt7//UkO05tKQ2bQbJTcc9oX0GJ0weNh6LTY2MoLxQ4eRJyF6H2A+SGb40TaUQdZMixY9gqyYQw4yI3nqmafxi0cexrJTz6EDrGLfKJloPn8LH6aEw3XtKIkJQ6pBgiou39CefGZx3Q46e6s4/ew6LjnfwdtWObhz//yNkxZ86X3viqTfWpFmbK6lfaE26NjCS77JqdXqm6emVA9Mo6AMsKYPEKgNTN1kAJZHhIm0ecFALRcxnM0TNhKpz+Z3Haozf5hCf3eGic4sduydxn9+Z5zZHstU822c4bceGxEfMi9ElEyhH1i5bX6qXXv3DJOfMP2NJyxc+N2FX6EZ4oWWyVdInPFfauGT9ZGLiYY8b5mcjg6p3dxg1ldj/DdfXRKxht4NymvRNDRBGyZeLMbFI6MQAXyQHiaJ5ptdOLB/F04a6kezVkHgZHH60CySdtkg1XqoYR6vNE8+Q4xVIeTSXwy+ND+c1d87g2yHNmZ9nHjrQNQ7H26/6jI9gGtxfR71Gwf97sHsdepc/kxayGPodB1Dk7nu6Vm02fU8RoIk0hnWzakUo4FeMDgmQ9MPKWJsyTQjBcfZMdotnZPjciFee7xXL8ya12nD+4ZxzsYzTRo9PjqFs1Yzp9BbmyPfGIUSCZlAZhJfR86SmjTwwny73tI5gXVfGETqkYVj/VeuvcqYlhy3mqdGnDziFvaxdOYxTlONqYxWH+nzYgqtHqyVK9fQFHxDXIIhMG0YEaPkVGRUzaBOVk+LerqQSiSMGgmkYeGWOnMIpqnf+879mJg5bD543LjxNCTIyKvWvoiBpSWm1n5o+5RO3bzLC81ASRBXMsfz/mFluPAfAN/42IeNIRkl58kR1Y56zWWrT5oRnbfAmMCSJYs2yw71ZaViczbtIptwkCbnGhxguwkkWYR0d+aYjSV5njShMh6Pm+s8y+bh4Unso/SNJMj9194Yxt7hMTy5LYXTqblDbMYVmMb4W5cDItrmfZ6YEGBFGw14M/jxDRchiC8x5mPUWWZKYZgffxAHc2SfjnPPdQwFp3NqcYW2rzBYqxUYBSZZVx9AubSfSUfoFBssiAz3+FC98w9ViOqU4Dm1ZmpyBocmRlhL5I1Hl49d2tdFRjqYqEzh+nsC/NvTCeRilDrvqpBJJEL1V3iiIzbM/0Pgm4x0dWqoBGrsXP5IF5GjFkPN5ZwmCI/hPeOb+Ieip6Ez/ise88LsBxSn8yjkp8iQAgujsMriNHrS8JVTHUn+zWByZpYlLmN+eQp9NBFtouiFZpnlqUe17s+m0ZX18Tffr+LeR5PoIdPESj3YU3ThanLPYYb41uCbl+qN80G4qROpRa0Kc34obfWb8+hv61rQYorT1ZXdrFAZemiKg86vxkR7Ms8au+Qz/CTRmUsjl8vQMXYZZ7J26W4MpR9DY/q3+MGDe3H2WafzHgspRg9Vl3UjVYvr0AlSg0Tsb15pYteoh/9wqsvURK/k9Xibc8JIM7T1zU3gf2/cjeeHKvRHSTRstq6NnM0Htcg7ShuJk73P7wuvRfnRG9aK5f2BSkt1+gx9Snz0artSbdBmPCxdvBQnLl+FpSuW49Jz9iM1uwUP/mQUT29llFSp2tWH8aqNtSsWo29RLw5PTuKFl97A9Kx+GKVEJNQclb115vOLczbuucFCZ6bMDFIfP5Lt1IDLfrSwE/zept0ok6sNltjdvR3wO96FWjeZrlA9hxgRJ3MwkjYciLoJulQ7CuE4J51Ob1adbjYnqAoNeml95u6S+JgXh5vuwhkne/jTsx/Dw/c9jX96oIB9U3pLoM8QSEClSEdom5+37R3eb3Z8ly/VG5sU/UrNMFOvufXTPJsl8iwjwv1bPCzrTWLdcmaClSYqfoA1r7bXgB9escNUfk2aVCaeYY6xCO6SK1ANamavYy75Il4gvRCBumoRHkpff9TMnfDeySevN2+GornmvpKcREyfnMRx8VkB/su7hnHdzcMo6nscqTbzpELZxwmr34buxYN49JEH4TBqZNIJ5gYJ5KenEOPqcb1LoGkp4ZGjVXVHv28clpvOIWflcetVTaRRQLFq4Yr/e6wW/OMlw8wjOM9nvPZSSFAomZWXYSZ2MhPRGglQYhZCKPRI9aO+kAWCFuEaE44Nzznikk0Xm98NavNTw41aOC70680lGRd3f3YS7778t5guUwWVGzTrVEcmSJluXH7NTdj63G/wu+e2oFSktOlIPYaWro4OJks2Zugka0qt2a9fhGh9WbwklYtlsGrdCjrPXpyzpoKOwvNIx+sYz3tmJ6hct1CljTWDFHLMS3IZH8mBC1CIbeIqJTJRVAhnxRZzamg0lamuBRGhoU5E48UBnoeMoDCyOUoiqxifZvKSZt6dJnU52peNW/5iGH6Zkq8kUGDsrhjWOSjZKZw4tBYJqrRtlRjWVELHTYqpT1om6Af0ClrVpYogVZYiX/JvsgJUUtDZlzbf+CZjddz7wDO4/adNHKp14pRTkzQhF/2Laix+Apx7ZhEbz7Ow6uxzkcz2IOW8LAzMLpZebxX9ONfR94ZETWCKn4hyEmnoNRCeSMDhCN3k/yvefWXYRTtUdTRDVcx4JXztRoaxoS74sw+jYl2Aiy55iqGnaj6XK6UHmdwswdJeZocdWby89XW8umMXCyLWAcoFuE4YckJHo4RDoN8L6HPcRCqOvmyCdUMB1UIVVpyJV9zHumUxfPzPXaRXvANnXv6vnDFJHzOMoD5NE5rmagyj9Vmm3tuNX8hPTWB29EWMFtIYn16PkfwJZn1HP9MjcXq23laHTBGIbOJHLRHxAuuCiy6SIgg7TM4GOGt9HV++aZzh6TC8zotQO/gT+oMYxsZXY9PV29DR6eFgLc6osAIbKKmqncPKwVXYvnsXtr+xH/sOjBkzCUwhJbHIM5uIzz6aFzVi/doBFBklqjMHqEEeSg1mZaiiO23hlut60N93CFVS4Hrh71QW91Ap6Ue8ONdKdsNKLEM8fQo1rxtOagkqe/4P196HmcoJ+O3292H35Cr6n5KeLBpFdwRSfQqaayvayVyc5YOrNzMDRokMuOE/lvGZ615keBunTyABpW1cZDnteQ16V27AJec08OBDh0lgEyOHSIAVwyzL6O073sCJJy7Gkr5u9FIrZPNlfSlGwvQtn+E2D2JInEXIsr4eZpwNLFvayYRrkt5d2Zy2vJo4aTCDRb2sQThWxZ0USXsn5p0tJWk1S0y8xlDXJ/azz6A28Rir2GlDUNypYO3iZ/jcLPblV9BUogyL+HCyTsx6JmM0qSjw/wE46Oep1bHIsQAAAABJRU5ErkJggg==",
            place: "Charlotte, NC",
            composite: null
        });
        */

        console.log("GH3");

        // Create and append the composite that will hold the next card.
        this.page.data.nextCardComposite = new tabris.Composite({
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        });
        this.page.data.nextCardComposite.appendTo(this.page);

        // Create and append the composite that will hold the top card.
        this.page.data.topCardComposite = new tabris.Composite({
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        });
        this.page.data.topCardComposite.appendTo(this.page);

        // Create and append the composite that will hold the discarded cards.
        this.page.data.discardedCardComposite = new tabris.Composite({
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        });
        this.page.data.discardedCardComposite.appendTo(this.page);

        console.log("GH4");

        // Create the topcard and nextcard.
        // this.createNextCard();
        // this.shiftCards();

        // Listen for horizontal panning.
        this.page.data.onPanHorizontal = function (event) {

            // If the topcard is ready for swiping.
            if (that.page.data.topCard != null && !that.page.data.topCard.composite.data.flipped && !that.page.data.topCard.composite.data.flipping && !that.page.data.topCard.composite.data.returningToMiddle) {

                // Depending on the status of the horizontal pan.
                switch (event.state) {

                    // If the panning has changed.
                    case "change":

                        // Update the X transformation and rotation.
                        that.page.data.topCard.composite.set({
                            transform: {
                                translationX: that.page.data.topCard.composite.get("transform").translationX + (event.velocityX * ((Date.now() - that.page.data.panLastCalled) / 1000)),
                                rotation: that.page.data.topCard.composite.get("transform").rotation + ((event.velocityX / that.properties.DRAG_ROTATION_DIV) * ((Date.now() - that.page.data.panLastCalled) / 1000))
                            }
                        });

                        // Update the transparency of the X and check based on the position of the card.
                        if (that.page.data.topCard.composite.get("transform").translationX < 0) {
                            that.page.data.topCard.composite.find("#check").set({
                                opacity: 0
                            });
                            that.page.data.topCard.composite.find("#x").set({
                                opacity: (-that.page.data.topCard.composite.get("transform").translationX / (that.page.get("bounds").width / 2)) * that.properties.FRONT_OVERLAY_MULT
                            });
                        } else if (that.page.data.topCard.composite.get("transform").translationX > 0) {
                            that.page.data.topCard.composite.find("#x").set({
                                opacity: 0
                            });
                            that.page.data.topCard.composite.find("#check").set({
                                opacity: (that.page.data.topCard.composite.get("transform").translationX / (that.page.get("bounds").width / 2)) * that.properties.FRONT_OVERLAY_MULT
                            });
                        }

                        break;

                        // If the drag ends, determine whether a verdict has been reached.
                    case "end":

                        // If the offset is beyond the verdict distance constant, a verdict has been reached.
                        if (Math.abs(that.page.data.topCard.composite.get("transform").translationX) > that.properties.VERDICT_DISTANCE) {
                            that.verdict(Math.sign(that.page.data.topCard.composite.get("transform").translationX) == 1 ? true : false, event.velocityX, event.velocityY);

                            // Also, if the velocity is beyond the verdict speed, a verdict has been reached.
                        } else if (Math.abs(event.velocityX) > that.properties.VERDICT_SPEED) {
                            that.verdict(Math.sign(event.velocityX) == 1 ? true : false, event.velocityX, event.velocityY);

                            // If neither of these conditions are met, cancel the drag.
                        } else {
                            that.cancelDrag();
                        }
                        break;

                        // If the drag was canceled (don't know why this would happen) just cancel the drag.
                    case "cancel":
                        that.cancelDrag();
                        break;
                }
            }

            // Update the last pan called (for deltatime purposes).
            that.page.data.panLastCalled = Date.now();
        };

        // Listen for tap.
        this.page.data.onTap = function (event) {
            if (that.page.data.topCard != null && !that.page.data.topCard.composite.data.flipping && !that.page.data.topCard.composite.data.returningToMiddle) {
                that.flipTopCard();
            }
        };

        console.log("GH6");

        // Add event listeners.
        this.page.on({
            panHorizontal: this.page.data.onPanHorizontal,
            tap: this.page.data.onTap
        });

        // Add an initial activity indicator.
        /*
        this.page.data.initAA = new tabris.ActivityIndicator({
            centerX: 0,
            centerY: 0
        });
        this.page.data.initAA.appendTo(this.page);
        */

        // this.getMoreCards();

        console.log("GH7");
    };

    // Called when the page is switched to.
    this.load = function () {

    };

    // Called when the page is switched away from.
    this.unload = function () {

    };

    // Called when the page is gone home to.
    this.homeState = function () {
        // Nothing for now.
    };

    /*
        <===--- Unique methods ---===>
    */

    this.createNextCard = function () {

        // Update the data objects accordingly.
        this.page.data.nextCard = this.page.data.queuedCards[0];
        this.page.data.queuedCards.shift();

        // Clear the contents of the nextcard composite.
        this.page.data.nextCardComposite.find().dispose();

        // Create a blank card composite and then build the front.
        this.page.data.nextCard.composite = this.createCardComposite();
        this.page.data.nextCard.composite.data.type = "next";
        this.buildFront(this.page.data.nextCard);
        this.page.data.nextCard.composite.appendTo(this.page.data.nextCardComposite);
    };

    this.createCardComposite = function () {

        // Create the composite.
        var comp = new tabris.Composite({
            centerX: 0,
            centerY: 64,
            width: this.properties.CARD_WIDTH,
            height: this.properties.CARD_HEIGHT,
            cornerRadius: this.properties.CARD_CORNER_RADIUS
        });

        // Set its transform (just in case) and background.
        comp.set({
            transform: {
                rotation: 0,
                translationX: 0,
                translationY: 0
            },
            background: this.properties.CARD_COLOR
        });

        // Setup some variables.
        comp.data = {};
        comp.data.type = "none";
        comp.data.flipped = false;
        comp.data.flipping = false;
        comp.data.returningToMiddle = false;

        // Return the composite.
        return comp;
    };

    this.shiftCards = function () {

        // If there is a next card.
        if (this.page.data.nextCard != null) {

            // Update the data objects accordingly.
            this.page.data.topCard = this.page.data.nextCard;
            this.page.data.topCard.composite.data.type = "top";

            // Detatch the new topcard from the nextcard composite.
            this.page.data.topCard.composite.detach();

            // Clear the contents of the topcard composite.
            this.page.data.topCardComposite.find().dispose();

            // Append the topcard to the topcard composite.
            this.page.data.topCard.composite.appendTo(this.page.data.topCardComposite);

            // If there are cards queued.
            if (this.page.data.queuedCards.length > 0) {

                // Create a new next card.
                this.createNextCard();

            } else {



                // Create an all done message and append it to the next card composite.
                this.page.data.nextCardText = new tabris.TextView({
                    centerX: 0,
                    centerY: 64
                });
                this.page.data.nextCardText.set({
                    text: this.properties.ALL_DONE_TEXT,
                    textColor: this.properties.ALL_DONE_COLOR,
                    font: this.properties.ALL_DONE_SIZE + "px"
                });
                this.page.data.nextCardComposite.append(this.page.data.nextCardText);

                // Set nextcard to null.
                this.page.data.nextCard = null;

            }
        } else if (this.page.data.topCard != null) {

            // If the topcard has not been set to null yet and there is no next card, set it to null.
            this.page.data.topCard = null;

            this.page.data.topCardText = this.page.data.nextCardText;
            this.page.data.nextCardText = null;
        }

    };

    this.cancelDrag = function () {

        // Make the X and check completely transparent
        this.page.data.topCard.composite.find("#check").set({
            opacity: 0
        });
        this.page.data.topCard.composite.find("#x").set({
            opacity: 0
        });

        // Set up the animation to return the card to the middle
        this.page.data.topCard.composite.data.returningToMiddle = true;
        var anim = this.page.data.topCard.composite.animate({
            transform: {
                translationX: 0,
                translationY: 0,
                rotation: 0
            }
        }, {
            delay: 0,
            duration: this.properties.RETURN_TO_MIDDLE_TIME * 1000,
            easing: "ease-out",
            repeat: 0,
            reverse: false
        });

        // After the animation, update the returning to middle variable.
        var targetCard = this.page.data.topCard.composite;
        anim.then(function () {
            targetCard.data.returningToMiddle = false;
        });
    };

    this.flipTopCard = function () {
        this.page.data.topCard.composite.data.flipping = true;

        // The first half of the flipping animation.
        var animShrink = this.page.data.topCard.composite.animate({
            transform: {
                scaleX: 0.01
            }
        }, {
            delay: 0,
            duration: (this.properties.FLIP_TIME / 2) * 1000,
            easing: "ease-out",
            repeat: 0,
            reverse: false
        });

        // Once it is complete, clear and construct card faces.
        animShrink.then(function () {

            // Toggle flipped.
            that.page.data.topCard.composite.data.flipped = !that.page.data.topCard.composite.data.flipped;

            if (that.page.data.topCard.composite.data.flipped) {

                // Clear the card.
                that.page.data.topCard.composite.find().dispose();

                // Detatch the discarded composite.
                that.page.data.discardedCardComposite.detach();

                // Construct the back of the card.
                that.buildBack(that.page.data.topCard);

            } else {

                // Clear the card.
                that.page.data.topCard.composite.find().dispose();

                // Attach the discarded composite.
                that.page.data.discardedCardComposite.appendTo(that.page);

                // Construct the front of the card.
                that.buildFront(that.page.data.topCard);
            }

            // The second half of the flipping animation.
            var animGrow = that.page.data.topCard.composite.animate({
                transform: {
                    scaleX: 1
                }
            }, {
                delay: 0,
                duration: (that.properties.FLIP_TIME / 2) * 1000,
                easing: "ease-in",
                repeat: 0,
                reverse: false
            });
            animGrow.then(function () {
                that.page.data.topCard.composite.data.flipping = false;
            });
        });
    };

    this.buildFront = function (card) {

        // Clear the existing contents of the card.
        card.composite.find().dispose();

        // Create the front composite and append it to the card.
        var frontComp = new tabris.Composite({
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        });
        frontComp.appendTo(card.composite);

        // Create the check mark and append it to the front composite.
        var checkMark = new tabris.TextView({
            centerX: 0,
            centerY: 0
        });
        checkMark.set({
            id: "check",
            opacity: 0,
            textColor: this.properties.FRONT_CHECK_COLOR,
            font: Math.floor(this.properties.CARD_WIDTH / 1.2) + "px",
            text: "\u2713"
        });
        checkMark.appendTo(frontComp);

        // Create the X mark and append it to the front composite.
        var xMark = new tabris.TextView({
            centerX: 0,
            centerY: 0
        });
        xMark.set({
            id: "x",
            opacity: 0,
            textColor: this.properties.FRONT_X_COLOR,
            font: Math.floor(this.properties.CARD_WIDTH / 1.2) + "px",
            text: "\u2717"
        });
        xMark.appendTo(frontComp);

        if (card.type == "vc") {

            // Create the profile image and append it to the front composite.
            var profile = new tabris.ImageView({
                left: this.properties.FRONT_INNER_MARGIN,
                top: this.properties.FRONT_INNER_MARGIN,
                width: this.properties.FRONT_IMAGE_SIZE,
                height: this.properties.FRONT_IMAGE_SIZE
            });
            profile.set({
                image: {
                    src: card.profileImage
                },
                cornerRadius: (this.properties.FRONT_IMAGE_SIZE / 2)
            });
            profile.appendTo(frontComp);

            // Create the tag and append it to the front composite.
            var tag = new tabris.TextView({
                left: this.properties.FRONT_INNER_MARGIN,
                top: this.properties.FRONT_INNER_MARGIN + this.properties.FRONT_IMAGE_SIZE + this.properties.FRONT_TAG_PADDING,
                bottom: this.properties.FRONT_INNER_MARGIN + this.properties.FRONT_TITLE_HEIGHT + this.properties.FRONT_TAG_PADDING,
                right: this.properties.FRONT_INNER_MARGIN
            });
            tag.set({
                textColor: this.properties.FRONT_TAG_COLOR,
                alignment: "center",
                font: this.properties.FRONT_TAG_SIZE + "px",
                text: card.tag
            });
            tag.appendTo(frontComp);

        } else {

            var imgSpacing = ((this.properties.CARD_HEIGHT - ((this.properties.FRONT_INNER_MARGIN * 2) + this.properties.FRONT_NAME_HEIGHT + this.properties.FRONT_TAG_PADDING)) - (this.properties.FRONT_IMAGE_SIZE * 2)) / 3;

            // Create the profile image and append it to the front composite.
            var profile = new tabris.ImageView({
                left: this.properties.FRONT_INNER_MARGIN,
                top: this.properties.FRONT_INNER_MARGIN + imgSpacing,
                width: this.properties.FRONT_IMAGE_SIZE,
                height: this.properties.FRONT_IMAGE_SIZE
            });
            profile.set({
                image: {
                    src: card.profileImage
                },
                cornerRadius: (this.properties.FRONT_IMAGE_SIZE / 2)
            });
            profile.appendTo(frontComp);

            // Create the logo image and append it to the front composite.
            var logo = new tabris.ImageView({
                left: this.properties.FRONT_INNER_MARGIN,
                top: this.properties.FRONT_INNER_MARGIN + this.properties.FRONT_IMAGE_SIZE + (imgSpacing * 2),
                width: this.properties.FRONT_IMAGE_SIZE,
                height: this.properties.FRONT_IMAGE_SIZE
            });
            logo.set({
                image: {
                    src: card.logo
                },
                cornerRadius: (this.properties.FRONT_IMAGE_SIZE / 2)
            });
            logo.appendTo(frontComp);

            // Create the tag and append it to the front composite.
            var tag = new tabris.TextView({
                left: this.properties.FRONT_INNER_MARGIN + this.properties.FRONT_IMAGE_SIZE + this.properties.FRONT_TAG_PADDING,
                top: this.properties.FRONT_INNER_MARGIN + this.properties.FRONT_IMAGE_SIZE + this.properties.FRONT_TAG_PADDING,
                bottom: this.properties.FRONT_INNER_MARGIN + this.properties.FRONT_TITLE_HEIGHT + this.properties.FRONT_TAG_PADDING,
                right: this.properties.FRONT_INNER_MARGIN
            });
            tag.set({
                textColor: this.properties.FRONT_TAG_COLOR,
                font: this.properties.FRONT_TAG_SIZE + "px",
                text: card.tag
            });
            tag.appendTo(frontComp);

        }

        // Create the title and append it to the front composite.
        var title = new tabris.TextView({
            centerX: 0,
            bottom: this.properties.FRONT_INNER_MARGIN,
            height: this.properties.FRONT_TITLE_HEIGHT,
            width: this.properties.CARD_WIDTH - (this.properties.FRONT_INNER_MARGIN * 2)
        });
        title.set({
            textColor: this.properties.FRONT_TITLE_COLOR,
            font: Math.floor(this.properties.FRONT_TITLE_HEIGHT / 1.2) + "px",
            maxLines: 1,
            alignment: "center",
            text: card.type == "e" ? card.title || card.name
        });
        title.appendTo(frontComp);

        // Create the profile name and append it to the front composite.
        if (card.type == "e") {
            var name = new tabris.TextView({
                left: this.properties.FRONT_INNER_MARGIN + this.properties.FRONT_IMAGE_SIZE + this.properties.FRONT_IMAGE_PADDING,
                top: this.properties.FRONT_INNER_MARGIN,
                height: this.properties.FRONT_NAME_HEIGHT,
                right: this.properties.FRONT_INNER_MARGIN
            });
            name.set({
                textColor: this.properties.FRONT_NAME_COLOR,
                font: Math.floor(this.properties.FRONT_NAME_HEIGHT / 1.2) + "px",
                maxLines: 1,
                text: card.profileName
            });
            name.appendTo(frontComp);
        }

        // Create the place and append it to the front composite.
        var place = new tabris.TextView({
            left: this.properties.FRONT_INNER_MARGIN + this.properties.FRONT_IMAGE_SIZE + this.properties.FRONT_IMAGE_PADDING,
            top: this.properties.FRONT_INNER_MARGIN + this.properties.FRONT_NAME_HEIGHT + this.properties.FRONT_TOP_TEXT_PADDING,
            height: this.properties.FRONT_PLACE_HEIGHT,
            right: this.properties.FRONT_INNER_MARGIN
        });
        place.set({
            textColor: this.properties.FRONT_PLACE_COLOR,
            font: Math.floor(this.properties.FRONT_PLACE_HEIGHT / 1.2) + "px",
            maxLines: 1,
            text: card.place
        });
        place.appendTo(frontComp);

        // Return the front composite (not needed, because it was already appended).
        return frontComp;
    };

    this.buildBack = function (card) {

        // Clear the existing contents of the card.
        card.composite.find().dispose();

        // Create a scroll view and append a text view.
        var backScroll = new tabris.ScrollView({
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            direction: "vertical"
        });
        backScroll.appendTo(card.composite);
        backScroll.append(new tabris.TextView({
            left: that.properties.BACK_MARGIN_HORIZONTAL,
            right: that.properties.BACK_MARGIN_HORIZONTAL,
            top: that.properties.BACK_MARGIN_VERTICAL,
            bottom: that.properties.BACK_MARGIN_VERTICAL,
            markupEnabled: true,
            font: that.properties.BACK_TEXT_SIZE + "px",
            text: card.back
        }));

        return backScroll;
    };

    this.verdict = function (approved, vx, vy) {

        // Handle approval.
        this.tab.app.apiCall("users/" + this.tab.app.user + "/verdict/" + this.page.data.topCard.id + "?token=" + this.tab.app.token, "POST", {
            approved: approved
        });
        if (this.page.data.moreCards && this.page.data.queuedCards.length < 5) {
            this.page.getMoreCards();
        }

        // Detach the topcard from the parent.
        this.page.data.topCard.composite.detach();

        // Attach the topcard to the discarded cards composite and set the type.
        this.page.data.topCard.composite.appendTo(this.page.data.discardedCardComposite);
        this.page.data.topCard.composite.data.type = "discarded";

        // Fade out animation plus movement due to velocity.
        var anim = this.page.data.topCard.composite.animate({
            transform: {
                translationX: this.page.data.topCard.composite.get("transform").translationX + (this.properties.USED_CARD_FADE_TIME * vx * this.properties.THROW_VELOCITY_MULT),
                translationY: this.page.data.topCard.composite.get("transform").translationY + (this.properties.USED_CARD_FADE_TIME * vy * this.properties.THROW_VELOCITY_MULT),
                rotation: this.page.data.topCard.composite.get("transform").rotation
            },
            opacity: 0
        }, {
            delay: 0,
            duration: this.properties.USED_CARD_FADE_TIME * 1000,
            easing: "ease-out",
            repeat: 0,
            reverse: false
        });
        anim.then(function () {

            // After the animation is done, remove the object from the discsrded cards array and dispose of the composite.
            for (var i = 0, fnd = false; i < that.page.data.discardedCards.length && !fnd; i++) {
                if (that.page.data.discardedCards[i].composite.cid == this.cid) {
                    that.page.data.discardedCards.splice(i, 1);
                    fnd = true;
                }
            }
            this.dispose();

        });

        // Update the data objects to reflect this.
        this.page.data.discardedCards.push(this.page.data.topCard);
        this.page.data.topCard = null;

        // Shift the next card up.
        this.shiftCards();
    };

    this.getMoreCards = function () {
        console.log("GOT MORE CARDS!");
        this.tab.app.apiCall("users/" + this.tab.app.user + "/browse?token=" + this.tab.app.token + "&count=15&last=" + this.page.data.lastCardLoaded, "GET").then(function (res) {
            console.log(res);
            if (res.status == 200) {

                that.page.data.lastCardLoaded = res.data[res.data.length - 1].id;

                for (var i = 0; i < res.data.length; i++) {
                    that.page.data.queuedCards.push(res.data[i]);
                }

                if (res.data.length < 15) {
                    that.page.data.moreCards = false;

                    if (that.page.data.topCardText != null) {
                        that.page.data.topCardText.dispose();
                        that.page.data.topCardText = null;

                        that.createNextCard();
                        that.shiftCards();
                    } else if (that.page.data.nextCardText != null) {
                        that.page.data.topCardText.dispose();
                        that.page.data.topCardText = null;

                        that.createNextCard();
                    }
                }

                // Dispose of the activity indicator.
                if (that.page.data.lastCardLoaded == -1) {
                    that.page.data.initAA.dispose();

                    that.createNextCard();
                    that.shiftCards();
                }
            }
        });
    };

};

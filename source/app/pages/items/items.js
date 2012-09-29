(function () {
    "use strict";

    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var ui = WinJS.UI;

    ui.Pages.define("/pages/items/items.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var listView = element.querySelector(".itemslist").winControl;
            listView.itemDataSource = Data.groupedItemsList.dataSource;
            listView.groupDataSource = Data.groupedItemsList.groups.dataSource;
            listView.itemTemplate = element.querySelector(".itemtemplate");
            listView.oniteminvoked = this._itemInvoked.bind(this);

            this._initializeLayout(listView, Windows.UI.ViewManagement.ApplicationView.value);
            listView.element.focus();

            var pinButton = document.getElementById("cmdPin");
            pinButton.addEventListener("click", pinByElementAsync, false);


            function pinByElementAsync(element, newTileID, newTileShortName, newTileDisplayName) {
                var uriLogo = new Windows.Foundation.Uri("ms-appx:///images/secondary_square.png");
                var uriSmallLogo = new Windows.Foundation.Uri("ms-appx:///images/smallLogoSecondaryTile-sdk.png");
                var uriWideLogo = new Windows.Foundation.Uri("ms-appx:///images/secondary_wide.png");
                var currentTime = new Date();
                var TileActivationArguments = newTileID + " WasPinnedAt=" + currentTime;
                var tile = new Windows.UI.StartScreen.SecondaryTile(newTileID, newTileShortName, newTileDisplayName, TileActivationArguments, Windows.UI.StartScreen.TileOptions.showNameOnLogo, uriLogo, uriWideLogo);
                tile.foregroundText = Windows.UI.StartScreen.ForegroundText.light;
                tile.smallLogo = uriSmallLogo;

                var selectionRect = document.getElementById("cmdPin").getBoundingClientRect();
                

                // Now let's try to pin the tile.
                // We'll make the same fundamental call as we did in pinByElement, but this time we'll return a promise.
                return new WinJS.Promise(function (complete, error, progress) {
                    tile.requestCreateForSelectionAsync({ x: selectionRect.left, y: selectionRect.top, width: selectionRect.width, height: selectionRect.height }, Windows.UI.Popups.Placement.above).done(function (isCreated) {
                        if (isCreated) {
                            complete(true);
                        } else {
                            complete(false);
                        }
                    });
                });
            };

        },

        

        // This function updates the page layout in response to viewState changes.
        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            var listView = element.querySelector(".itemslist").winControl;
            if (lastViewState !== viewState) {
                if (lastViewState === appViewState.snapped || viewState === appViewState.snapped) {
                    var handler = function (e) {
                        listView.removeEventListener("contentanimating", handler, false);
                        e.preventDefault();
                    }
                    listView.addEventListener("contentanimating", handler, false);
                    var firstVisible = listView.indexOfFirstVisible;
                    this._initializeLayout(listView, viewState);
                    if (firstVisible >= 0 && listView.itemDataSource.list.length > 0) {
                        listView.indexOfFirstVisible = firstVisible;
                    }
                }
            }
        },

        // This function updates the ListView with new layouts
        _initializeLayout: function (listView, viewState) {
            /// <param name="listView" value="WinJS.UI.ListView.prototype" />

            if (viewState === appViewState.snapped) {
                listView.layout = new ui.ListLayout();
            } else {
                listView.layout = new ui.GridLayout();
            }
        },

        _itemInvoked: function (args) {
                     var groupKey = Data.groups.getAt(args.detail.itemIndex).key;
            WinJS.Navigation.navigate("/pages/split/split.html", { groupKey: groupKey });
        }
    });
})();

(function () {
    "use strict";

    var item;

    WinJS.UI.Pages.define("/pages/itemDetail/itemDetail.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {

            item = Data.items.getAt(options.itemIndex);
            ko.applyBindings(item);

            //element.querySelector(".content").focus();
            
            document.getElementById("articleIFrame").onload = function () {
                var pbar = document.getElementById("pbar");
                pbar.value = 0;
            };

            var dataTransferManager = Windows.ApplicationModel.DataTransfer.DataTransferManager.getForCurrentView();
            dataTransferManager.addEventListener("datarequested", dataRequestedForSharing);
            
            var pinButton = document.getElementById("cmdPin");
            pinButton.addEventListener("click", pinByElementAsync, false);

            function pinByElementAsync(element, newTileID, newTileShortName, newTileDisplayName) {
                var uriLogo = new Windows.Foundation.Uri("ms-appx:///images/secondary_square.png");
                var uriSmallLogo = new Windows.Foundation.Uri("ms-appx:///images/smallLogo.png");
                var uriWideLogo = new Windows.Foundation.Uri("ms-appx:///images/secondary_wide.png");
                var currentTime = new Date();
                var TileActivationArguments = newTileID + " WasPinnedAt=" + currentTime;

                var newTileDisplayName = item.ArticleTitle;
                var newTileShortName = "Metro-Weekly: " + item.ArticleTitle;

                var tile = new Windows.UI.StartScreen.SecondaryTile(newTileID, newTileShortName, newTileDisplayName, TileActivationArguments, Windows.UI.StartScreen.TileOptions.showNameOnLogo, uriLogo);
                tile.foregroundText = Windows.UI.StartScreen.ForegroundText.dark;
                tile.smallLogo = uriSmallLogo;

                var selectionRect = document.getElementById("cmdPin").getBoundingClientRect();

                // Now let's try to pin the tile.  We'll make the same fundamental call as we did in pinByElement, but this time we'll return a promise.
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

        }
    });

    function dataRequestedForSharing(e) {
        var request = e.request;

        // Title is required
        var dataPackageTitle = item.ArticleTitle;

        if ((typeof dataPackageTitle === "string") && (dataPackageTitle !== "")) {

            var dataPackageLink = item.ArticleUrl;
            if ((typeof dataPackageLink === "string") && (dataPackageLink !== "")) {
                request.data.properties.title = dataPackageTitle;

                // The description is optional.
                var dataPackageDescription = item.ArticleDescription;
                if ((typeof dataPackageDescription === "string") && (dataPackageDescription !== "")) {
                    request.data.properties.description = dataPackageDescription;
                }

                try {
                    request.data.setUri(new Windows.Foundation.Uri(dataPackageLink));
                    WinJS.log && WinJS.log("", "sample", "error");
                } catch (ex) {
                    WinJS.log && WinJS.log("Exception occured: the uri provided " + dataPackageLink + " is not well formatted.", "sample", "error");
                }
            } else {
                WinJS.log && WinJS.log("FAIL");
            }
        } else {
            WinJS.log && WinJS.log("FAIL");
        }
    }

})();

(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/itemDetail/itemDetail.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {

            var item = Data.items.getAt(options.itemIndex);
            //element.querySelector(".content").focus();

            ko.applyBindings(item);

            document.getElementById("articleIFrame").onload = function () {
                var pbar = document.getElementById("pbar");
                pbar.value = 0;
           
                //D42-43

            };

        }
    });

})();

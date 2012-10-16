(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/itemDetail/itemDetail.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {

            var item = Data.items.getAt(options.itemIndex);
            //element.querySelector(".content").focus();

            ko.applyBindings(item);
        }
    });

    function checkStatus() {
       document.getElementById("pbar").value = 0;
    }

})();

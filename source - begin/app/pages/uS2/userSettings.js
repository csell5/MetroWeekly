// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";
    var appdata = Windows.Storage.ApplicationData;
    

    WinJS.UI.Pages.define("/pages/userSettings/userSettings.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.

            /*
                        TODO We should think about moving this object out into a real js object that we can use and initalize across all. 
                        for now I am just going to copy some of it and revisit.  
                        --@CSELL5
                    */

            //retreive data
            var userName = appdata.current.roamingSettings.values["userName"];
            if (userName) {
                var userNameInputBox = document.getElementById("userName");
                userNameInputBox.innerText = userName;
            }
            var userUrl = appdata.current.roamingSettings.values["userUrl"];
            if (userUrl) {
                var userUrlInputBox = document.getElementById("userUrl");
                userUrlInputBox.innerText = userUrl;
            }
            var userTwitter = appdata.current.roamingSettings.values["userTwitter"];
            if (userTwitter) {
                var userTwitterInputBox = document.getElementById("userTwitter");
                userTwitterInputBox.innerText = userTwitter;
            }

            //save data
            var userNameInputBox = document.getElementById("userName");
            userNameInputBox.addEventListener("change", function (e) {
                appdata.current.roamingSettings.values["userName"] = userNameInputBox.value;
            });
            var userUrlInputBox = document.getElementById("userUrl");
            userUrlInputBox.addEventListener("change", function (e) {
                appdata.current.roamingSettings.values["userUrl"] = userUrlInputBox.value;
            });
            var userTwitterInputBox = document.getElementById("userTwitter");
            userTwitterInputBox.addEventListener("change", function (e) {
                appdata.current.roamingSettings.values["userTwitter"] = userTwitterInputBox.value;
            });


        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in viewState.
        }
    });
})();

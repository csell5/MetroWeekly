﻿// For an introduction to the Split template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=232447
(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var nav = WinJS.Navigation;
    var appdata = Windows.Storage.ApplicationData;

    var notify = Windows.UI.Notifications;
    var push = Windows.Networking.PushNotifications;
    var net = Windows.Networking.Connectivity;
    var wsc = Windows.Security.Cryptography;
    var popups = Windows.UI.Popups;


    app.onsettings = function (e) {
        e.detail.applicationcommands = {
            "about": {
                href: "/pages/about/about.html",
                title: "About"
            },
            "userSettings": {
                href: "/pages/userSettings/userSettings.html",
                title: "User Information"
            }

        }


        WinJS.UI.SettingsFlyout.populateSettings(e);
    };

    app.addEventListener("activated", function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }

            // Clear tiles and badges
            notify.TileUpdateManager.createTileUpdaterForApplication().clear();
            notify.BadgeUpdateManager.createBadgeUpdaterForApplication().clear();

            // Register for push notifications
            var profile = net.NetworkInformation.getInternetConnectionProfile();

            if (profile.getNetworkConnectivityLevel() === net.NetworkConnectivityLevel.internetAccess) {
                push.PushNotificationChannelManager.createPushNotificationChannelForApplicationAsync().then(function (channel) {

                    //var buffer = wsc.CryptographicBuffer.convertStringToBinary(channel.uri, wsc.BinaryStringEncoding.utf8);
                    //var uri = wsc.CryptographicBuffer.encodeToBase64String(buffer);

                    var postData = { uri: channel.uri};

                    WinJS.xhr({ 
                        type: "POST",
                        headers: { "Content-Type": "application/json; charset=utf-8" },
                        url: "http://metro-weekly.com/api/PushNotifications",
                        data: JSON.stringify(postData)
                    }).then(function (xhr) {
                        if (xhr.status < 200 || xhr.status >= 300) {
                            var dialog = new popups.MessageDialog("Unable to open push notification channel");
                            dialog.showAsync();
                        }
                    });
                });
            }


            if (app.sessionState.history) {
                nav.history = app.sessionState.history;
            }

            args.setPromise(WinJS.UI.processAll().then(function () {
                if (nav.location) {
                    nav.history.current.initialPlaceholder = true;
                    return nav.navigate(nav.location, nav.state);
                } else {
                    return nav.navigate(Application.navigator.home);
                }
            }));
        }
    });

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. If you need to 
        // complete an asynchronous operation before your application is 
        // suspended, call args.setPromise().
        app.sessionState.history = nav.history;
    };

    app.start();
})();

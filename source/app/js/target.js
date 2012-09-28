
(function () {

    // Variable to store the ShareOperation object
    var shareOperation = null;

    // Variable to store the visibility of the Extended Sharing section
    var extendedSharingCollapsed = true;

    var sharedUri = null;

    // variable for pulling saved roaming data
    var appdata = Windows.Storage.ApplicationData;

    /// <summary>
    /// Helper function to display received sharing content
    /// </summary>
    /// <param name="type">
    /// The type of content received
    /// </param>
    /// <param name="value">
    /// The value of the content
    /// </param>
    function displayContent(label, content, preformatted) {
        var labelNode = document.createElement("strong");
        labelNode.innerText = label;

        document.getElementById("contentValue").appendChild(labelNode);

        if (preformatted) {
            var pre = document.createElement("pre");
            pre.innerHTML = toStaticHTML(content);
            document.getElementById("contentValue").appendChild(pre);
        }
        else {
            document.getElementById("contentValue").appendChild(document.createTextNode(content));
        }
        document.getElementById("contentValue").appendChild(document.createElement("br"));

        

    }

    /// <summary>
    /// Handler executed on activation of the target
    /// </summary>
    /// <param name="eventArgs">
    /// Arguments of the event. In the case of the Share contract, it has the ShareOperation
    /// </param>
    function activatedHandler(eventObject) {
        // In this sample we only do something if it was activated with the Share contract
        if (eventObject.detail.kind === Windows.ApplicationModel.Activation.ActivationKind.shareTarget) {
            eventObject.setPromise(WinJS.UI.processAll());

            // We receive the ShareOperation object as part of the eventArgs
            shareOperation = eventObject.detail.shareOperation;

            // We queue an asychronous event so that working with the ShareOperation object does not
            // block or delay the return of the activation handler.
            WinJS.Application.queueEvent({ type: "shareready" });
        }
    }

    /// <summary>
    /// Handler executed when ready to share; handling the share operation should be performed outside the activation handler
    /// </summary>
    function shareReady(eventArgs) {
        //document.getElementById("title").innerText = shareOperation.data.properties.title;
        //document.getElementById("description").innerText = shareOperation.data.properties.description;
        // If this app was activated via a QuickLink, display the QuickLinkId
        if (shareOperation.quickLinkId !== "") {
            document.getElementById("selectedQuickLinkId").innerText = shareOperation.quickLinkId;
            document.getElementById("quickLinkArea").className = "hidden";
        }

        if (shareOperation.data.contains(Windows.ApplicationModel.DataTransfer.StandardDataFormats.uri)) {
            shareOperation.data.getUriAsync().done(function (uri) {
                sharedUri = uri.rawUri;
                document.getElementById("submitUrl").textContent = sharedUri;
            });
        }
        
        if (shareOperation.data.contains(Windows.ApplicationModel.DataTransfer.StandardDataFormats.html)) {
            shareOperation.data.getHtmlFormatAsync().done(function (htmlFormat) {
                document.getElementById("htmlContentArea").className = "unhidden";

                // Extract the HTML fragment from the HTML format
                var htmlFragment = Windows.ApplicationModel.DataTransfer.HtmlFormatHelper.getStaticFragment(htmlFormat);

                // Set the innerHTML of the iframe to the HTML fragment
                var iFrame = document.getElementById("htmlContent");
                iFrame.style.display = "";
                iFrame.contentDocument.documentElement.innerHTML = htmlFragment;

                // Now we loop through any images and use the resourceMap to map each image element's src
                var images = iFrame.contentDocument.documentElement.getElementsByTagName("img");
                if (images.length > 0) {
                    shareOperation.data.getResourceMapAsync().done(function (resourceMap) {
                        if (resourceMap.size > 0) {
                            for (var i = 0, len = images.length; i < len; i++) {
                                var streamReference = resourceMap[images[i].getAttribute("src")];
                                if (streamReference) {
                                    // Call a helper function to map the image element's src to a corresponding blob URL generated from the streamReference
                                    setResourceMapURL(streamReference, images[i]);
                                }
                            }
                        }
                    });
                }
            });
        }


        // post the stuff 
        document.getElementById("submitArticleBtn").addEventListener("click", postArticle, false);
    }

    function postArticle() {

        //Hide the submit button
        document.getElementById("submitProgress").style.visibility = "visible";
        document.getElementById("submitArticleBtn").style.visibility = "hidden";

        //Grab the roaming data
        var userNameInputBox = document.getElementById("quickLinkName");
        var userUrlInputBox = document.getElementById("quickLinkWebsite");
        var userTwitterInputBox = document.getElementById("quickLinkTwitter");
        var quickLinkIdInputBox = document.getElementById("quickLinkId");

        var postData = {
            ArticleUrl: sharedUri,
            UserName: userNameInputBox.value,
            UserWebSite: userUrlInputBox.value,
            Twitter: userTwitterInputBox.value
        };
        
        WinJS.xhr({
            type: "POST",
            url: "http://metro-weekly.com/api/submission",
            headers: { "Content-Type": "application/json; charset=utf-8" },
            data: JSON.stringify(postData)
        }).then(
            function () {
                //todo we should write something to the screen on success
                document.getElementById("submitProgress").style.visibility = "hidden";
                document.getElementById("submitArticleResult").textContent = "Submitted - Thank You";
            },
            function (e) {
                document.getElementById("submitArticleBtn").style.visibility = "visible";
                document.getElementById("submitArticleResult").textContent = "Error...";
            }
        );

    }

    /// <summary>
    /// Sets the blob URL for an image element based on a reference to an image stream within a resource map
    /// </summary>
    function setResourceMapURL(streamReference, imageElement) {
        if (streamReference) {
            streamReference.openReadAsync().done(function (imageStream) {
                if (imageStream) {
                    imageElement.src = URL.createObjectURL(imageStream, { oneTimeOnly: true });
                }
            }, function (e) {
                imageElement.alt = "Failed to load";
            });
        }
    }

    /// <summary>
    /// Use to simulate that an extended share operation has started
    /// </summary>
    function reportStarted() {
        shareOperation.reportStarted();
    }

    /// <summary>
    /// Use to simulate that an extended share operation has retrieved the data
    /// </summary>
    function reportDataRetrieved() {
        shareOperation.reportDataRetrieved();
    }

    /// <summary>
    /// Use to simulate that an extended share operation has reached the status "submittedToBackgroundManager"
    /// </summary>
    function reportSubmittedBackgroundTask() {
        shareOperation.reportSubmittedBackgroundTask();
    }

    /// <summary>
    /// Submit for extended share operations. Can either report success or failure, and in case of success, can add a quicklink.
    /// This does NOT take care of all the prerequisites (such as calling reportExtendedShareStatus(started)) before submitting.
    /// </summary>
    function reportError() {
        var errorText = document.getElementById("extendedShareErrorMessage").value;
        shareOperation.reportError(errorText);
    }

    /// <summary>
    /// Call the reportCompleted API with the proper quicklink (if needed)
    /// </summary>
    function reportCompleted() {
        var addQuickLink = document.getElementById("addQuickLink").checked;
        if (addQuickLink) {
            var el;
            var quickLink = new Windows.ApplicationModel.DataTransfer.ShareTarget.QuickLink();

            var quickLinkId = document.getElementById("quickLinkId").value;
            if ((typeof quickLinkId !== "string") || (quickLinkId === "")) {
                el = document.getElementById("quickLinkError");
                el.className = "unhidden";
                el.innerText = "Missing QuickLink ID";
                return;
            }
            quickLink.id = quickLinkId;

            var quickLinkTitle = document.getElementById("quickLinkTitle").value;
            if ((typeof quickLinkTitle !== "string") || (quickLinkTitle === "")) {
                el = document.getElementById("quickLinkError");
                el.className = "unhidden";
                el.innerText = "Missing QuickLink title";
                return;
            }
            quickLink.title = quickLinkTitle;

            // For quicklinks, the supported FileTypes and DataFormats are set independently from the manifest
            var dataFormats = Windows.ApplicationModel.DataTransfer.StandardDataFormats;
            quickLink.supportedFileTypes.replaceAll(["*"]);
            quickLink.supportedDataFormats.replaceAll([dataFormats.text, dataFormats.uri, dataFormats.bitmap, dataFormats.storageItems, dataFormats.html, customFormatName]);

            // Prepare the icon for a QuickLink
            Windows.ApplicationModel.Package.current.installedLocation.getFileAsync("images\\user.png").done(function (iconFile) {
                quickLink.thumbnail = Windows.Storage.Streams.RandomAccessStreamReference.createFromFile(iconFile);
                shareOperation.reportCompleted(quickLink);
            });
        } else {
            shareOperation.reportCompleted();
        }
    }

    /// <summary>
    /// Expand/collapse the QuickLink fields
    /// </summary>
    function addQuickLinkChanged() {
        if (document.getElementById("addQuickLink").checked) {
            quickLinkFields.className = "unhidden";
        } else {
            quickLinkFields.className = "hidden";
            document.getElementById("quickLinkError").className = "hidden";
        }
    }

    // Initialize the activation handler
    WinJS.Application.addEventListener("activated", activatedHandler, false);
    WinJS.Application.addEventListener("shareready", shareReady, false);

    WinJS.Application.start();

    function initialize() {
        //document.getElementById("addQuickLink").addEventListener("change", /*@static_cast(EventListener)*/addQuickLinkChanged, false);

        //retreive roaming and set it to the quick link meta...
        var userName = appdata.current.roamingSettings.values["userName"];
        if (userName) {
            var userNameInputBox = document.getElementById("quickLinkName");
            userNameInputBox.innerText = userName;
        }
        var userUrl = appdata.current.roamingSettings.values["userUrl"];
        if (userUrl) {
            var userUrlInputBox = document.getElementById("quickLinkWebsite");
            userUrlInputBox.innerText = userUrl;
        }
        var userTwitter = appdata.current.roamingSettings.values["userTwitter"];
        if (userTwitter) {
            var userTwitterInputBox = document.getElementById("quickLinkTwitter");
            userTwitterInputBox.innerText = userTwitter;
            var userImage = document.getElementById("quickLinkIcon");
            userImage.src = "https://api.twitter.com/1/users/profile_image?screen_name=" + userTwitter + "&size=bigger";
        }
        else {
            var userTwitterInputBox = document.getElementById("quickLinkTwitter");
            userTwitterInputBox.innerText = "metro_weekly";
            var userImage = document.getElementById("quickLinkIcon");
            userImage.src = "https://api.twitter.com/1/users/profile_image?screen_name=metro_weekly&size=bigger";
        }
    }

    document.addEventListener("DOMContentLoaded", initialize, false);

})();

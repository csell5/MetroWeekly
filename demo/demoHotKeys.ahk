
; global

#z::Run www.autohotkey.com

^!n::
IfWinExist Untitled - Notepad
	WinActivate
else
	Run Notepad++
return

; ------------------------
; winrt - demo snippits
; ------------------------

::d11::
clipboard =
(
	    <div id="rootGrid">
        <div id="header" role="contentinfo" data-win-control="WinJS.UI.HtmlControl" data-win-options="{uri: '/html/header.html'}"></div>
       
	    <div id="content">
            <div id="contentValue" >
                <div id="htmlContentArea" class="hidden"><!--<strong>HTML: </strong><br />--><iframe id="htmlContent" style="width:600px; height:auto; display:none" ></iframe></div>
                <p id="submitUrl"></p>
            </div>

            <div id="submitArticle">
                <span>Submit to Metro Weekly:</span>
                <button id="submitArticleBtn">Submit Article</button>
                
                <label id="submitProgress">
                    <progress class="win-ring withText"></progress>Processing</label>
                <p>
                    <label id="submitArticleResult"></label>
                </p>
            </div>

            <div id="quickLinkArea">
<!--                <input type="checkbox" id="addQuickLink" value="addQuickLink" /> Add a QuickLink (optional)<br />-->
                <br />
                <div id="quickLinkFields" class="hidden">
                    <div id="quickLinkError" class="hidden"></div>
<!--                    <div class="labelTextQL">QuickLink Id:</div> <input type="text" id="quickLinkId" value="ABC123"/><br />-->
                    <div class="labelTextQL">Your name:</div>  <input type="text" id="quickLinkName" value="John Doe"/><br />
                    <div class="labelTextQL">Your website:</div>  <input type="text" id="quickLinkWebsite" value="http://metro-weekly.com"/><br />
                    <div class="labelTextQL">Your twitter:</div>  <input type="text" id="quickLinkTwitter" value="@metro-weekly"/><br />
                    <img alt="QuickLink icon" id="quickLinkIcon" />
                </div>
            </div>

        </div>
          
        <div id="footer" data-win-control="WinJS.UI.HtmlControl" data-win-options="{uri: '/html/footer.html'}"></div>
    </div>
)
send ^v
return

::d21::
clipboard =
(
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
)
send ^v
return


::d22::
clipboard =
(
 <div id="userSettings" data-win-control="WinJS.UI.SettingsFlyout" data-win-options="{width: 'narrow'}">
        <div class="SettingsPane">
            <div class="win-label">
                <button onclick="WinJS.UI.SettingsFlyout.show()" class="win-backbutton">
                </button>
                <span class="SettingsTitle">User Information</span>
            </div>
            <article class="SettingsContent">
               <!-- <div id="remember" data-win-control="WinJS.UI.ToggleSwitch" data-win-options="{ title: 'Remember where I was' }" />-->
                <form>
			        <label for="orderName">Your name:</label><br />
			        <input id="userName" type="text" name="userName" placeholder="John Doe" required/><br />           
		            <br />
			        <label for="orderName">Your blog or website:</label><br />
			        <input id="userUrl" type="url" name="userUrl" placeholder="http://metro-weekly.com" required/><br />       
                    <br />
			        <label for="orderName">Your twitter handle:</label><br />
			        <input id="userTwitter" type="text" name="userTwitter" placeholder="@metro-weekly" required/><br />
                    <br />      
                </form>
            </article>
        </div>
    </div>
)
send ^v
return

::d23::
clipboard =
(
//var appdata = Windows.Storage.ApplicationData; after strict

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
)
send ^v
return

::d24::
clipboard =
(

.SettingsPane {
    margin-top:36px;
    margin-left:48px;
}

.SettingsTitle {
    margin-left: 36px;
}

.SettingsContent {
     margin-top: 24px;
}

)
send ^v
return

::d31::
clipboard =
(

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

)
send ^v
return

::d41::
clipboard =
(

        <!-- Create AppBar -->
    <!-- BEGINTEMPLATE: Template code for an AppBar -->
    <div id="createAppBar" data-win-control="WinJS.UI.AppBar" data-win-options="">
        <button data-win-control="WinJS.UI.AppBarCommand" data-win-options="{id:'cmdSort',label:'Sort',icon:'sort',section:'global',tooltip:'Sort items'}">
        </button>
        <button data-win-control="WinJS.UI.AppBarCommand" data-win-options="{id:'cmdFilter',label:'Filter',icon:'filter',section:'global',tooltip:'Filter items'}">
        </button>
        <button data-win-control="WinJS.UI.AppBarCommand" data-win-options="{id:'cmdPin',label:'Pin',icon:'pin',section:'selection',tooltip:'Pin page'}">
        </button>
        <hr data-win-control="WinJS.UI.AppBarCommand" data-win-options="{type:'separator',section:'selection'}" />
        <button data-win-control="WinJS.UI.AppBarCommand" data-win-options="{id:'cmdListView',label:'List View',icon:'list',section:'selection',tooltip:'Change View'}">
        </button>
    </div>
    <!-- ENDTEMPLATE -->
)
send ^v
return

::d42::
clipboard =
(
var pinButton = document.getElementById("cmdPin");
            pinButton.addEventListener("click", pinByElementAsync, false);
)
send ^v
return


::d43::
clipboard =
(
function pinByElementAsync(element, newTileID, newTileShortName, newTileDisplayName) {
                var uriLogo = new Windows.Foundation.Uri("ms-appx:///images/secondary_square.png");
                var uriSmallLogo = new Windows.Foundation.Uri("ms-appx:///images/smallLogoSecondaryTile-sdk.png");
                var uriWideLogo = new Windows.Foundation.Uri("ms-appx:///images/secondary_wide.png");
                var currentTime = new Date();
                var TileActivationArguments = newTileID + " WasPinnedAt=" + currentTime;
                var tile = new Windows.UI.StartScreen.SecondaryTile(newTileID, newTileShortName, newTileDisplayName, TileActivationArguments, Windows.UI.StartScreen.TileOptions.showNameOnLogo, uriLogo);
                tile.foregroundText = Windows.UI.StartScreen.ForegroundText.light;
                tile.smallLogo = uriSmallLogo;

                

                
            };
)
send ^v
return



::d44::
clipboard =
(
var selectionRect = document.getElementById("cmdPin").getBoundingClientRect();
            return new WinJS.Promise(function (complete, error, progress) {
                tile.requestCreateForSelectionAsync({ x: selectionRect.left, y: selectionRect.top, width: selectionRect.width, height: selectionRect.height }, Windows.UI.Popups.Placement.above).done(function (isCreated) {
                    if (isCreated) {
                        complete(true);
                    } else {
                        complete(false);
                    }
                });
            });
)
send ^v
return
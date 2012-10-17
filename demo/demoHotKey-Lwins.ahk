
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
	<div id="quickLinkArea">
		<br />
		<div id="quickLinkFields" class="hidden">
			<div id="quickLinkError" class="hidden"></div>
			<div class="labelTextQL">Your name:</div>  <input type="text" id="quickLinkName" value="John Doe"/><br />
			<div class="labelTextQL">Your website:</div>  <input type="text" id="quickLinkWebsite" value="http://metro-weekly.com"/><br />
			<div class="labelTextQL">Your twitter:</div>  <input type="text" id="quickLinkTwitter" value="@metro-weekly"/><br />
			<img alt="QuickLink icon" id="quickLinkIcon" />
		</div>
	</div>
)
send ^v
return


::d12::
clipboard =
(
	#quickLinkArea {
		-ms-grid-row: 3;
	}
)
send ^v
return


::d21::
clipboard =
(
	,
	"userSettings": {
		href: "/pages/userSettings/userSettings.html",
		title: "User Information"
	}
)
send ^v
return

::d22::
clipboard =
(
	<div id="userSettings" data-win-control="WinJS.UI.SettingsFlyout" data-win-options="{width: 'wide'}">
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

::d24::
clipboard =
(
	var appdata = Windows.Storage.ApplicationData;
)
send ^v
return


::d25::
clipboard =
(
	//save data
	var userNameInputBox = document.getElementById("userName");
	userNameInputBox.addEventListener("change", function (e) {
		appdata.current.localSettings.values["userName"] = userNameInputBox.value;
	});
	var userUrlInputBox = document.getElementById("userUrl");
	userUrlInputBox.addEventListener("change", function (e) {
		appdata.current.localSettings.values["userUrl"] = userUrlInputBox.value;
	});
	var userTwitterInputBox = document.getElementById("userTwitter");
	userTwitterInputBox.addEventListener("change", function (e) {
		appdata.current.localSettings.values["userTwitter"] = userTwitterInputBox.value;
	});
)
send ^v
return


::d26::
clipboard =
(
	//retreive data
	var userName = appdata.current.localSettings.values["userName"];
	if (userName) {
		var userNameInputBox = document.getElementById("userName");
		userNameInputBox.innerText = userName;
	}
	var userUrl = appdata.current.localSettings.values["userUrl"];
	if (userUrl) {
		var userUrlInputBox = document.getElementById("userUrl");
		userUrlInputBox.innerText = userUrl;
	}
	var userTwitter = appdata.current.localSettings.values["userTwitter"];
	if (userTwitter) {
		var userTwitterInputBox = document.getElementById("userTwitter");
		userTwitterInputBox.innerText = userTwitter;
	}
)
send ^v
return

::d31::
clipboard =
(
	notify.TileUpdateManager.createTileUpdaterForApplication().clear();
	notify.BadgeUpdateManager.createBadgeUpdaterForApplication().clear();
)
send ^v
return

::d32::
clipboard =
(
	var profile = net.NetworkInformation.getInternetConnectionProfile();

	if (profile.getNetworkConnectivityLevel() === net.NetworkConnectivityLevel.internetAccess) {
		push.PushNotificationChannelManager.createPushNotificationChannelForApplicationAsync().then(function (channel) {

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
	<!-- BEGINTEMPLATE: Template code for an AppBar -->
	<div id="createAppBar" data-win-control="WinJS.UI.AppBar" data-win-options="">
		<button data-win-control="WinJS.UI.AppBarCommand" data-win-options="{id:'cmdPin',label:'Pin',icon:'pin',section:'selection',tooltip:'Pin page'}">
		</button>
	</div>
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
		var uriSmallLogo = new Windows.Foundation.Uri("ms-appx:///images/secondary_small.png");
		var uriWideLogo = new Windows.Foundation.Uri("ms-appx:///images/secondary_wide.png");
		var currentTime = new Date();
		var TileActivationArguments = newTileID + " WasPinnedAt=" + currentTime;
		var tile = new Windows.UI.StartScreen.SecondaryTile(
			newTileID,
			newTileShortName,
			newTileDisplayName,
			TileActivationArguments,
			Windows.UI.StartScreen.TileOptions.showNameOnLogo,
			uriLogo);
		tile.foregroundText = Windows.UI.StartScreen.ForegroundText.light;
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
)
send ^v
return

::d00::
clipboard =
(
	
)
send ^v
return

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
	<button id="myButton">Make Call</button>
	<textarea aria-multiline="true" id="results" aria-readonly="True">results here..</textarea>
)
send ^v
return

::d12::
clipboard =
(
	public static string HelloWorld(){
		return "hello world";
	}
)
send ^v
return

::d13::
clipboard =
(
	function buttonClick () {

    };
)
send ^v
return

::d14::
clipboard =
(
	app.onready = function () {
        document.getElementById("myButton").addEventListener("click", buttonClick, false);
    }
)
send ^v
return

::d15::
clipboard =
(
	var resultElement = document.getElementById("results");

	var existingText = resultElement.innerHTML;
	var x = WinRTComponent.MyWinRTAwesome.helloWorld();

	resultElement.innerHTML = existingText + "\n" + x;
)
send ^v
return

; ------------------------
; web - demo snippits
; ------------------------

::d21::
clipboard =
(
	<script src="~/Scripts/jquery-1.7.1.js"></script>
	<script src="~/Scripts/knockout-2.1.0.js"></script>
)
send ^v
return

::d22::
clipboard =
(
	<script type="text/html" id="speaker-template">
		<h2><span data-bind="text: FirstName"></span> <span data-bind="text: LastName"></span></h2>
		<p data-bind="text: Bio"></p>
	   
		<hr />
		<br />
	</script>
)
send ^v
return

::d23::
clipboard =
(
	<div data-bind="template: { name: 'speaker-template', foreach: d }"></div>
)
send ^v
return

::d24::
clipboard =
(	
	<script type="text/javascript">
        $(document).ready(function () {
            $.ajax({
                url: 'http://www.thatconference.com/odata/api.svc/People',
                dataType: "json",

                success: function (data) {
                    ko.applyBindings(data);
                },
            });
        });
	</script>
)
send ^v
return

::d25::
clipboard =
(
		<div style="float: right; margin: 25px;" >
			<img src="Content/sheldon.gif" />
		</div> 
)
send ^v
return

::d26::
clipboard =
(
		<div style="clear: both"></div>
)
send ^v
return

; ------------------------
; powershell commands....
; ------------------------

::ps1::dir

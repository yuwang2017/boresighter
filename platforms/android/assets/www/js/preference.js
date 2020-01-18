var preference;

var app = {

    initialize: function() {
        this.bindEvents();
    },
 
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },

    
    receivedEvent: function(id) {
    	document.addEventListener("backbutton", onBackKeyDown, false);  
        document.getElementById("btnSaveSettings").addEventListener("click", savePreference);
        document.getElementById("btnCancelSettings").addEventListener("click", back);       
        populatePreference();        
    }
    
};


function savePreference() {
	
	preference.sysUnit = $("#sysUnit").val();
	preference.accUnit = $("#accUnit").val();
	
	preference.printGroupArea = $("#printGroupArea").val();
	preference.printMeanRadius = $("#printMeanRadius").val();
	preference.printPOI = $("#printPOI").val();
	preference.printScope = $("#printScope").val();
	preference.printTemperature = $("#printTemperature").val();
	preference.printWind = $("#printWind").val();
	preference.printRange = $("#printRange").val();
	preference.printShooter = $("#printShooter").val();
	preference.printDate = $("#printDate").val();
	preference.simpleLabel = $("#simpleLabel").val();
	
	settingBridge.savePreference(JSON.stringify(preference));
	back();
}

function populatePreference() {
	
	preference = JSON.parse(settingBridge. getPreference());
	$("#sysUnit").val(preference.sysUnit);
	$("#accUnit").val(preference.accUnit);
	
	$("#printGroupArea").val(preference.printGroupArea);
	$("#printMeanRadius").val(preference.printMeanRadius);
	$("#printPOI").val(preference.printPOI);
	$("#printScope").val(preference.printScope);
	$("#printTemperature").val(preference.printTemperature);
	$("#printWind").val(preference.printWind);
	$("#printRange").val(preference.printRange);
	$("#printShooter").val(preference.printShooter);
	$("#printDate").val(preference.printDate);
	$("#simpleLabel").val(preference.simpleLabel);
	
	$('.ui-slider').width(180);
	 	
	$("select#sysUnit").slider("refresh");
	$("select#accUnit").slider("refresh");	
	
	$("select#printGroupArea").slider("refresh");
	$("select#printMeanRadius").slider("refresh");	
	$("select#printPOI").slider("refresh");
	$("select#printScope").slider("refresh");
	$("select#printTemperature").slider("refresh");
	$("select#printWind").slider("refresh");
	$("select#printRange").slider("refresh");
	$("select#printShooter").slider("refresh");
	$("select#printDate").slider("refresh");
	$("select#simpleLabel").slider("refresh");
}


function back() {
   settingBridge.backToHome();
}

function getErrorString(errors) {
	var error = '';
	if(errors.length > 0) {
 		error = "<ul data-role='listview'>";
 		var i;
 		for(i=0; i<errors.length; i++) {
 			error = error + "<li>" + errors[i] + "</li>";
 		}

		error = error + "</ul>";
 	}
 	return error;
}

function onBackKeyDown() {
	return false;
}

app.initialize();

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
    
    // Update DOM on a Received Event
    receivedEvent: function(id) {
    	document.addEventListener("backbutton", onBackKeyDown, false);  
        document.getElementById("btnCalInch").addEventListener("click", calculateInch);
        document.getElementById("btnCalMetric").addEventListener("click", calculateMetric);                
        populateSettings();                 
    }
};

var ballisticInch;
var ballisticMetric;

var shootingDistance;
var zeroDistance;
var dx;
var dy;
var adjUnit;
var bulletDrop;
var xd;
var yd;

function calculateInch() {	   
    var poix = $("#dx").val();  
    var poiy = $("#dy").val();  

    var errors = validate(poix, poiy);
    if(errors != '') {
      alertDialog("Retrieve Permit", errors);
      return false;
    }

    var zd = $("#distance").val();
    var sd = $("#shootingDistance").val();   
    var poix =  $("#dx").val();  
    var poiy =  $("#dy").val();  
    var cal = $("#caliber").val();

    shootingDistance = parseFloat(sd);
    zeroDistance = parseFloat(zd);

    dx = parseFloat(poix);
    dy = parseFloat(poiy);

    adjUnit = $("#clickUnit").val(); 
    xd = $("#xd").val(); 
    yd = $("#yd").val(); 

    //Find out the bullet drop
   //alert(cal);
    var cj = ballisticInch[cal];
    var sj = cj['z' + sd];
    var dj = sj['d' + zd];

    bulletDrop = parseFloat(dj);
    calculate();
}

function calculateMetric() {
    var poix =  $("#dx2").val();  
    var poiy =  $("#dy2").val();  
    var errors = validate(poix, poiy);
    if(errors != '') {
      alertDialog("Retrieve Permit", errors);
      return false;
    }
    var zd = $("#distance2").val();
    var sd = $("#shootingDistance2").val();   
   
    var cal = $("#caliber2").val();

    shootingDistance = parseFloat(sd);
    zeroDistance = parseFloat(zd);

    dx = parseFloat(poix);
    dy = parseFloat(poiy);

     //Find out the bullet drop
    var cj = ballisticMetric[cal];
    var sj = cj['z' + sd];
    var dj = sj['d' + zd];

    bulletDrop = parseFloat(dj);
    bulletDrop = bulletDrop * 0.393701 

    shootingDistance = shootingDistance * 1.0936133
    zeroDistance = zeroDistance *  1.0936133

    dx = dx * 0.393701
    dy = dy * 0.393701

    adjUnit = $("#clickUnit2").val(); 
    xd = $("#xd2").val(); 
    yd = $("#yd2").val(); 
    calculate();   
}

function validate(poix, poiy) {
    var errors = new Array();
    if(poix == ''){
        errors.push('Missing horizantal POI');
    } 
     if(poiy == ''){
        errors.push('Missing vertical POI');
    } 
    return getErrorString(errors);
}

function calculate() {
    //alert (shootingDistance + " " + zeroDistance + " " +  bulletDrop);
    //1. Calculate adjustment to shooting distance
    var moax = dx / (shootingDistance / 100.0)/1.047;
    var moay = dy / (shootingDistance / 100.0)/1.047;

    var adj = getClickValueMOA();
    var clicky = moay / adj;
    var clickx = moax / adj;

    var moadrop = bulletDrop / (zeroDistance / 100.0)/1.047;

    var clickdrop = moadrop / adj;

    //2. Figure out labels
    //a. Y label
    var labelX = Math.round(clickx) + " Clicks ";
    if(xd == 'L') {
        labelX = labelX + " Right";
    } else {
        labelX = labelX + " Left";
    }

    //3. Try to figure out Y label, Up is +, Down is -
    if(yd == "H") {
        clicky = -1 * clicky
    }

    //Bullet drop:
    clickdrop = -1 * clickdrop
    clicky = clicky + clickdrop;
    var labelY = Math.round(Math.abs(clicky)) + " Clicks ";
    if(clicky > 0) {
        labelY = labelY + " Up";
    } else {
        labelY = labelY + " Down";
    }

    var adds = new Array();  
    adds.push(labelX);
    adds.push(labelY);
    alertDialog("Adjustments", getErrorString(adds));
}


function getClickValueMOA() {
    var adj = 0.25;
    if(adjUnit == "1") {
        adj = 0.125
    } else if(adjUnit == "2") {
        adj = 0.25
    } else if(adjUnit == "3") {
        adj = 0.5
    } else if(adjUnit == "4") {
        adj = 0.3438
    } else if(adjUnit == "5") {
        adj = 1.0
    }
    return adj
}


function populateSettings() {		
    //load ballistic data 
    //ballistic = JSON.parse("ballistic.json");
    //alert(ballistic.22lr);
    $.getJSON("ballistic.json", function(json) {
       ballisticInch = json;
    });
    $.getJSON("ballistic-metric.json", function(json) {
       ballisticMetric = json;
    });


	$('.ui-slider').width(120);
	$("select#xd").slider("refresh");
	$("select#yd").slider("refresh");
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

function alertDialog(title, message) {
  // NOTE: The selector can be whatever you like, so long as it is an HTML element.
  //       If you prefer, it can be a member of the current page, or an anonymous div
  //       like shown.
  var content = message +  "<a rel='close' data-role='button' href='#'>Close</a>";
  $('<div>').simpledialog2({
    mode: 'blank',
    headerText: title,
    headerClose: true,
    blankContent : content
  });
}

function onBackKeyDown() {
	   return false;
}
app.initialize();

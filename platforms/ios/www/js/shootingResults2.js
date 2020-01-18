


var selectedGroup = null;
var oTable = null;
var groupList = null;

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
    	document.addEventListener("backbutton", onBackKeyDown, false);  
    	
    	document.getElementById("closeBtn").addEventListener("click", back);
    	document.getElementById("closeBtn1").addEventListener("click", back);
    	document.getElementById("firearm").addEventListener("change", changeFirearm);
    	
    	getGroupList();  
    	       
       	$("#tableBody").on('click', 'tr', function(){      
       		var i;
       		for(i=0; i<groupList.groups.length; i++) {
       			if(this.id == groupList.groups[i].id) {
       				selectedGroup = groupList.groups[i];
       				settingBridge.viewGroupDetail(this.id, selectedGroup.firearm);
       				break;
       			}
       		}
    	});
       	
      	//JavaScript timer pull
       	setInterval(function(){ 
       		//alert(settingBridge.isResultChanged());
       		if(settingBridge.isResultChanged() == 'YES') {
       			getGroupList();      			
       		}
       	}, 2000);
    }
};

function onBackKeyDown() {
	   //Disable Android back button
	   //alert(navigator.connection.type);
	   return false;
}

function changeFirearm() {
	var firearm = $("#firearm").val();
	groupList = JSON.parse(settingBridge.getShootingResultList(firearm));
	refreshTable();
}


function populateLoadDetails() {
		var ulList = document.getElementById("ammoDetailList");
		while (ulList.firstChild) {
			ulList.removeChild(ulList.firstChild);
		}
	    var labels = new Array();
	    labels.push('Load Date: ' + selectedLoad.loadDate);
	    labels.push('Load Name and Lot: ' + selectedLoad.loadName + ", Lot #" + selectedLoad.lotNumber);
	    labels.push('Caliber: ' + selectedLoad.caliber);
	    labels.push('Powder: ' + selectedLoad.powder + " (" + selectedLoad.powderWeight + " grains)");
	    labels.push('Bullet: ' + selectedLoad.bullet);
	    labels.push('Brass and Primer: ' + selectedLoad.brass + " / " + selectedLoad.primer);
	    labels.push('Overall Length: ' + selectedLoad.ovl);
	    labels.push('Note: ' + selectedLoad.notes);
	    
	    var i;
	    for(i=0; i<labels.length; i++) {
	      var li = document.createElement("li");
	      li.setAttribute("class", "ui-li ui-li-static");
	      if(i == labels.length -1) {
	         li.setAttribute("style", "border-bottom-width: 1px;");
	      }
	      li.appendChild(document.createTextNode(labels[i]));
	      ulList.appendChild(li);
	    }
}


function getGroupList() {
	//alert(settingBridge.getAmmoCaliberList());
	var firearms = JSON.parse(settingBridge.getFirearmModelList()).firearms;		
	
	//Initial Caliber List
	var firearmList = document.getElementById("firearm");
	while (firearmList.firstChild) {
		firearmList.removeChild(firearmList.firstChild);
	}
	var i;
	for(i=0; i<firearms.length; i++) {
		var option = document.createElement("option");
		option.text = firearms[i].firearm;
		option.value = firearms[i].firearm;
		firearmList.add(option);	
	}
	$("#firearm").val(firearms[0].firearm);
	$("select#firearm").selectmenu('refresh');
	
	groupList = JSON.parse(settingBridge.getShootingResultList(firearms[0].firearm));
	refreshTable();
}


function refreshTable() {
	//Add data to table
	var tbody = document.getElementById("tableBody");
	
	//Remove childs from tbody
	while (tbody.firstChild) {
		tbody.removeChild(tbody.firstChild);
	}
	
	for(i=0; i<groupList.groups.length; i++) {
		var tr = document.createElement("tr");
		tr.setAttribute("id", groupList.groups[i].id);
		
		var td1 = document.createElement("td");
		td1.setAttribute("class", "title");
		td1.appendChild(document.createTextNode(groupList.groups[i].date));
		tr.appendChild(td1);
		
		var td2 = document.createElement("td");	
		td2.appendChild(document.createTextNode(groupList.groups[i].ammo));
		tr.appendChild(td2);
		
		var td3 = document.createElement("td");	
		td3.appendChild(document.createTextNode(groupList.groups[i].group));
		tr.appendChild(td3);				
		
		var td4 = document.createElement("td");	
		td4.appendChild(document.createTextNode(groupList.groups[i].shooter));
		tr.appendChild(td4);
				
		
		tbody.appendChild(tr);
		
		if(i%2 == 0) {
			td1.setAttribute("style","background-color:#333333;");
			td2.setAttribute("style","background-color:#333333;");
			td3.setAttribute("style","background-color:#333333;");
			td4.setAttribute("style","background-color:#333333;");			
		}
	}
	$('#ammoList').removeData();
	$('#ammoList').table("refresh");
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

app.initialize();
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
    	
        var url = settingBridge.getUrl();
        if(url == null) {
        	settingBridge.backToHome();
        }
        if(url != 'index.html') {
        	document.location = url;
        }
    }
};


app.initialize();
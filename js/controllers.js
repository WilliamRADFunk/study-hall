// Main function is that wrap all sub-controllers. State management.
studyHallApp.controller('MainController', ['appData', function(app) {
	var self = this;

	self.isLoggedIn = app.isLoggedIn;
	self.active = false;
	self.miscData = app.miscData;
	self.nav = app.navigation;
	self.state = app.state;

	// Calls the service to toggle public events display
	self.togglePublicEvents = function() {
		app.togglePublicEvents();
		if(!app.eventListData.isPublicEvents && !app.eventListData.isPrivateEvents) {
			app.togglePublicEvents();
		} else {
			var myElem = angular.element( document.querySelector( '#public-events' ) );
			if(app.eventListData.isPublicEvents) {
				myElem.addClass('active');
			} else {
				myElem.removeClass('active');
			}
		}
	};
	// Calls the service to toggle private events display
	self.togglePrivateEvents = function() {
		app.togglePrivateEvents();
		if(!app.eventListData.isPublicEvents && !app.eventListData.isPrivateEvents) {
			app.togglePrivateEvents();
		} else {
			var myElem = angular.element( document.querySelector( '#private-events' ) );
			if(app.eventListData.isPrivateEvents) {
				myElem.addClass('active');
			} else {
				myElem.removeClass('active');
			}
		}
	};
	// Calls the service to toggle rso groups display
	self.toggleRsoGroups = function() {
		app.toggleRsoGroups();
		if(!app.rsoListData.isRsoGroups && !app.rsoListData.isRsoEvents) {
			app.toggleRsoGroups();
		} else {
			var myElem = angular.element( document.querySelector( '#rso-groups' ) );
			if(app.rsoListData.isRsoGroups) {
				myElem.addClass('active');
			} else {
				myElem.removeClass('active');
			}
		}
	};
	// Calls the service to toggle rso events display
	self.toggleRsoEvents = function() {
		app.toggleRsoEvents();
		if(!app.rsoListData.isRsoGroups && !app.rsoListData.isRsoEvents) {
			app.toggleRsoEvents();
		} else {
			var myElem = angular.element( document.querySelector( '#rso-events' ) );
			if(app.rsoListData.isRsoEvents) {
				myElem.addClass('active');
			} else {
				myElem.removeClass('active');
			}
		}
	};
}]);
// Main function is manage event lists "page".
studyHallApp.controller('LoginController', ['appData', function(app) {
	var self = this;

	self.active = false;
	self.loginData = app.loginData;
	self.state = app.state;
	self.nav = app.navigation;

	self.falseInputUser = 0;
	self.falseInputPass = 0;
	self.invalidUserPass = false;

	resetLogin = function() {
		self.falseInputUser = 0;
		self.falseInputPass = 0;
		self.invalidUserPass = false;
	};

	self.loginActivate = function() {
		resetLogin();
		app.resetLog();
		var validInput = true;
		if(self.user === ""){
			//Toggle user error. Dont call app.login
			validInput = false;
			self.falseInputUser = 1;
		}
		if(self.pass === ""){
			//Toggle password error
			validInput = false;
			self.falseInputPass = 1;
		}

		if(validInput){
			app.login(self.user, self.pass);
		}
	};

	self.toRegister = function(){
		app.navigation.goToRegistration();
	};
}]);

studyHallApp.controller('RegisterController', ['appData', function(app) {
	var self = this;

	self.active = false;
	self.registerData = app.registerData;
	self.state = app.state;
	self.nav = app.navigation;

	self.falseInputEmail = false;
	self.noEmail = false;
	self.falseInputUser = false;
	self.noUser = false;
	self.falseInputPass = false;
	self.noPass = false;
	self.falseInputConfirmPass = false;
	self.noConfirm = false;

	self.falsePassCompare = false;

	self.invalidUserPass = false;

	resetRegister = function() {
		self.falseInputEmail = false;
		self.noEmail = false;
		self.falseInputUser = false;
		self.noUser = false;
		self.falseInputPass = false;
		self.noPass = false;
		self.falseInputConfirmPass = false;
		self.noConfirm = false;
		self.falsePassCompare = false;
	};

	self.registerActivate = function() {

		console.log("registerActivate activated.");
		resetRegister();

		var validInput = true;

		if(self.email === ""){
			//Toggle user error. Dont call app.login
			validInput = false;
			self.noEmail = true;
		}
		if(self.user === ""){
			//Toggle password error
			validInput = false;
			self.noUser = true;
		}
		if(self.pass === ""){
			//Toggle password error
			validInput = false;
			self.noPass = true;
		}
		else if(self.passConfirm === ""){
			//Toggle password error
			validInput = false;
			self.noConfirm = true;
		}
		else{
			if(self.pass !== self.passConfirm)
			{
				self.falsePassCompare = true;
				validInput = false;
			}
		}
		if(validInput){
			var fullName = self.fName + " " + self.lName;
			console.log(self.email, self.user, self.pass, self.passConfirm, self.major, self.minor, self.bio);
			app.register(self.email, self.user, self.pass, fullName, self.major, self.minor, self.bio);
		}
		else
		{
			//Registration failed
		}
	};

	self.toLogin = function(){
		app.navigation.goToLogin();
	};
}]);

studyHallApp.controller('EventCreateController', ['appData', function(app) {
	var self = this;
	self.eventLat = 0;
	self.eventLong = 0;

	self.active = false;
	self.eventCreateData = app.eventCreateData;
	self.state = app.state;

	// Creates the map for this page.
	var map = L.map('map-create');
	// Setup a marker group.
	var markers = L.featureGroup();
	// Sets up background image of map and associates type.
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	map.on('click', function(e) {
		// Wipe all markers off the map.
		markers.clearLayers();
		self.eventLat = e.latlng.lat;
		self.eventLong = e.latlng.lng;
	    // Create each individual marker.
		var marker = L.marker([self.eventLat, self.eventLong]).addTo(map);
		// Add marker to the group.
		markers.addLayer(marker);
		// Places all markers on the map.
		map.addLayer(markers);
	});

	self.falseInputEvent = false;
	self.falseInputStart = false;
	self.falseInputEnd = false;
	self.falseInputType = false;

	self.refreshRso = function(){
		app.getAvailableRSO();
	};

	self.createActivate = function() {
		ResetCreateEvent();
		//TEMP VARIABLES EXPECTED LATER BY EVENTCREATE.html
		var specific = "THE TESTER";

		var id = self.state.userId;
		var verified = true;

		if(self.nameE === ""){
			//NO EVENT NAME
			verified = false;
			self.falseInputEvent = true;
		}
		if(self.start === ""){
			//NO START
			verified = false;
			self.falseInputStart = true;
		}
		if(self.end === ""){
			//NO END
			verified = false;
			self.falseInputEnd = true;
		}
		if(self.type === ""){
			//NO TYPE
			verified = false;
			self.falseInputType = true;
		}
		if(verified){
			app.createEvent(id, self.nameE, self.start, self.end, self.type, self.desc, self.phone, self.email, self.eventLat, self.eventLong, specific, self.rso);
		}
	};

	var ResetCreateEvent = function(){
		self.falseInputEvent = false;
		self.falseInputStart = false;
		self.falseInputEnd = false;
		self.falseInputType = false;
	};

	var centerMap = function() {
		// Center the map on school's lat and long.
		map.setView([Number(self.state.latitude), Number(self.state.longitude)], 16);
		self.eventLat = self.state.latitude;
		self.eventLong = self.state.longitude;
	};

	// Center the map on school's lat and long.
	centerMap();
}]);
// Main function is manage event list "page".
studyHallApp.controller('EventsController', ['appData', function(app) {
	var self = this;

	self.active = false;
	self.eventListData = app.eventListData;
	self.state = app.state;

	// Create the leaflet map, and attach it to the map with that id.
	var map = L.map('map-events');
	// Setup a marker group.
	var markers = L.featureGroup();
	// Sets up background image of map and associates type.
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	// Calls the service to get the list of events.
	self.getEventList = function() {
		app.listEvents();
	};

	// Calls the service to route to specific event page.
	self.selectEvent = function(eventIndex=null) {
		if(eventIndex !== null) {
			app.getEventById(self.eventListData.events[eventIndex]);
		}
	};

	// Calls the service to route to event creation page.
	self.createEvent = function() {
		app.navigation.goToCreateEvent();
	};

	// Called by service everytime the list of events is changed.
	var updateEvents = function() {
		// Wipe all markers off the map.
		markers.clearLayers();

		// Centers map on the first marker.
		if(self.eventListData.events[0]
			&& self.eventListData.events[0].latitude
			&& self.eventListData.events[0].longitude
			) {
			map.setView([self.eventListData.events[0].latitude,
				self.eventListData.events[0].longitude
			], 15);
		}

		// Create each individual marker.
		self.eventListData.events.forEach(function(elem) {
			var marker = L.marker([elem.latitude, elem.longitude
			]).addTo(map)
				.bindPopup(elem.name + '<br>' + elem.specificName);
			// Add marker to the group.
			markers.addLayer(marker);
		});
		// Places all markers on the map.
		map.addLayer(markers);
	};
	// Registers the map updater function with the service's observer pattern.
	app.registerObserverCallback(updateEvents);
	// Initial call to populate table with events.
	self.getEventList();
}]);

studyHallApp.controller('RSOCreateController', ['appData', function(app) {
	var self = this;

	self.active = false;
	self.RSOCreateData = app.RSOCreateData;
	self.state = app.state;

	self.falseInputRSO = false;

	self.validInput = true;

	self.CreateActivate = function() {
		if(self.name === '')
		{
			validInput = false;
		}
	};
}]);

// Main function is manage RSO list "page".
studyHallApp.controller('RSOsController', ['appData', function(app) {
	var self = this;

	self.active = false;
	self.rsoListData = app.rsoListData;
	self.state = app.state;

	// Create the leaflet map, and attach it to the map with that id.
	var map = L.map('map-rsos');
	// Setup a marker group.
	var markers = L.featureGroup();
	// Sets up background image of map and associates type.
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	map.setView([app.state.latitude, app.state.longitude], 15);

	// Calls the service to get the list of RSOs.
	self.getRsoList = function() {
		app.listRsos();
	};

	// Calls the service to route to specific RSO event page.
	self.selectRso = function(rsoIndex=null) {
		if(eventIndex !== null) {
			app.getRsoById(self.eventListData.events[eventIndex]);
		}
	};

	// Calls the service to route to event creation page.
	self.createEvent = function() {
		app.navigation.goToCreateEvent();
	};

	// Calls the service to route to rso group creation page.
	self.createGroup = function() {
		app.navigation.goToCreateGroup();
	};

	// Called by service everytime the list of events is changed.
	var updateRsos = function() {
		var events = [];
		var groups = [];
		// Wipe all markers off the map.
		markers.clearLayers();

		// Separates rso events from rso groups for mapping purposes.
		self.rsoListData.rsos.forEach(function(elem, index) {
			if(elem['rso_id']) {
				groups.push(elem);
			} else if(elem['e_id']) {
				events.push(elem);
			}
		});

		// Centers map on the first marker.
		if(events[0]
			&& events[0].latitude
			&& events[0].longitude
			) {
			map.setView([events[0].latitude, events[0].longitude], 15);
		}

		// Create each individual marker.
		events.forEach(function(elem) {
			var marker = L.marker([elem.latitude, elem.longitude])
				.addTo(map)
				.bindPopup(elem.name + '<br>' + elem.specificName + '<br><i>' + elem['rso_name'] + '</i>');
			// Add marker to the group.
			markers.addLayer(marker);
		});
		// Places all markers on the map.
		map.addLayer(markers);
	};
	// Registers the map updater function with the service's observer pattern.
	app.registerObserverCallback(updateRsos);
	// Initial call to populate table with rso groups and events.
	self.getRsoList();
}]);
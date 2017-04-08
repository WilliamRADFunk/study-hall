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

	self.active = false;
	self.eventCreateData = app.eventCreateData;
	self.eventData = app.eventData;
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
		self.eventCreateData.latitude = e.latlng.lat;
		self.eventCreateData.longitude = e.latlng.lng;
	    // Create each individual marker.
		var marker = L.marker([
			self.eventCreateData.latitude,
			self.eventCreateData.longitude
		]).addTo(map);
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

		if(self.eventCreateData.nameE === ""){
			//NO EVENT NAME
			verified = false;
			self.falseInputEvent = true;
		}
		if(self.eventCreateData.start === ""){
			//NO START
			verified = false;
			self.falseInputStart = true;
		}
		if(self.eventCreateData.end === ""){
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
			app.createEvent(id, self.eventCreateData.nameE, self.eventCreateData.start, self.eventCreateData.end, self.type, self.eventCreateData.desc, self.eventCreateData.phone, self.eventCreateData.email, self.eventCreateData.latitude, self.eventCreateData.longitude, EventCreateCtrl.eventCreateData.locationName, self.rso);
		}
	};

	self.editActivate = function() {
		var id = self.state.userId;
		var verified = true;

		if(self.eventCreateData.nameE === ""){
			//NO EVENT NAME
			verified = false;
			self.falseInputEvent = true;
		}
		if(self.eventCreateData.start === ""){
			//NO START
			verified = false;
			self.falseInputStart = true;
		}
		if(self.eventCreateData.end === ""){
			//NO END
			verified = false;
			self.falseInputEnd = true;
		}
		if(verified){
			app.submitEventEdit(self.eventData.event['e_id'], self.eventCreateData.nameE, self.eventCreateData.start, self.eventCreateData.end, self.eventCreateData.desc, self.eventCreateData.phone, self.eventCreateData.email, self.eventCreateData.latitude, self.eventCreateData.longitude, self.eventCreateData.locationName);
		}
	};

	var ResetCreateEvent = function(){
		self.falseInputEvent = false;
		self.falseInputStart = false;
		self.falseInputEnd = false;
		self.falseInputType = false;
	};

	var centerMap = function() {
		if(self.eventData.event.latitude &&
			self.eventData.event.latitude != 0 &&
			self.eventData.event.longitude &&
			self.eventData.event.longitude != 0
			) {
			// Center the map on event's lat and long.
			map.setView([
				Number(self.eventData.event.latitude),
				Number(self.eventData.event.longitude)
			], 16);
			self.eventCreateData.latitude = self.eventData.event.latitude;
			self.eventCreateData.longitude = self.eventData.event.longitude;
			editMarker();
			// Clear these to prevent crossover problems in create event.
			self.eventData.event.latitude = 0;
			self.eventData.event.longitude = 0;
		} else {
			// Center the map on school's lat and long.
			map.setView([
				Number(self.state.latitude),
				Number(self.state.longitude)
			], 16);
			self.eventCreateData.latitude = self.state.latitude;
			self.eventCreateData.longitude = self.state.longitude;
		}
	};

	var editMarker = function() {
		// Wipe all markers off the map.
		markers.clearLayers();
		// Creates individual marker.
		var marker = L.marker([
			self.eventCreateData.latitude,
			self.eventCreateData.longitude
		]).addTo(map);
		// Add marker to the group.
		markers.addLayer(marker);
		// Places all markers on the map.
		map.addLayer(markers);
	};

	// Registers the map updater function with the service's observer pattern.
	app.registerObserverCallback(editMarker);
	// Center the map on school's lat and long.
	centerMap();
}]);

// Main function is to manage individual event "page".
studyHallApp.controller('EventController', ['appData', function(app) {
	var self = this;

	self.active = false;
	self.eventData = app.eventData;
	self.state = app.state;

	// Create the leaflet map, and attach it to the map with that id.
	var map = L.map('map-event');
	// Setup a marker group.
	var markers = L.featureGroup();
	// Sets up background image of map and associates type.
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	// Router function to send event object to service.
	self.editEvent = function(){
		app.editEvent(self.eventData.event);
	};
	// Router function to send event id to service.
	self.deleteEvent = function(){
		app.deleteEvent(self.eventData.event['e_id']);
	};
	// Router function to send event id to service.
	self.acceptEvent = function(){
		app.acceptEvent(self.eventData.event['e_id']);
	};
	// Router function to send event id to service.
	self.rejectEvent = function(){
		app.rejectEvent(self.eventData.event['e_id']);
	};

	// Called by service everytime the list of events is changed.
	var updateEvent = function() {
		// Wipe all markers off the map.
		markers.clearLayers();

		// Centers map on the first marker.
		if(self.eventData.event
			&& self.eventData.event.latitude
			&& self.eventData.event.longitude
			) {
			map.setView([
				self.eventData.event.latitude,
				self.eventData.event.longitude
			], 15);
		}

		// Creates individual marker.
		var marker = L.marker([
			self.eventData.event.latitude,
			self.eventData.event.longitude
		]).addTo(map)
			.bindPopup(self.eventData.event.name + '<br>' + self.eventData.event.specificName);
		// Add marker to the group.
		markers.addLayer(marker);
		// Places all markers on the map.
		map.addLayer(markers);
	};
	// Registers the map updater function with the service's observer pattern.
	app.registerObserverCallback(updateEvent);
	// Initial call to populate table with events.
	updateEvent();
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

		self.validInput = true;
		self.falseInputRSO = false;

		var id = self.state.userId;

		if(self.name === '')
		{
			self.validInput = false;
			self.falseInputRSO = true;
		}

		if(self.validInput)
		{
			app.createRSO(id, self.name, self.desc);
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
	self.selectEvent = function(eventIndex=null) {
		if(eventIndex !== null) {
			app.getEventById(self.rsoListData.events[eventIndex]);
		}
	};

	// Calls the service to route to specific RSO group page.
	self.selectGroup = function(groupIndex=null) {
		if(groupIndex !== null) {
			app.getGroupById(self.rsoListData.groups[groupIndex]);
		}
	};

	// Calls the service to route to event creation page.
	self.createEvent = function() {
		app.navigation.goToCreateEvent();
	};

	// Calls the service to route to rso group creation page.
	self.createGroup = function() {
		app.navigation.goToCreateRSO();
	};

	// Called by service everytime the list of events is changed.
	var updateRsos = function() {
		self.rsoListData.events = [];
		self.rsoListData.groups = [];
		// Wipe all markers off the map.
		markers.clearLayers();

		// Separates rso events from rso groups for mapping purposes.
		self.rsoListData.rsos.forEach(function(elem, index) {
			if(elem['rso_id']) {
				self.rsoListData.groups.push(elem);
			} else if(elem['e_id']) {
				self.rsoListData.events.push(elem);
			}
		});

		// Centers map on the first marker.
		if(self.rsoListData.events[0]
			&& self.rsoListData.events[0].latitude
			&& self.rsoListData.events[0].longitude
			) {
			map.setView([
				self.rsoListData.events[0].latitude,
				self.rsoListData.events[0].longitude
			], 15);
		}

		// Create each individual marker.
		self.rsoListData.events.forEach(function(elem) {
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
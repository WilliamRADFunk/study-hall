// Main function is that wrap all sub-controllers. State management.
studyHallApp.controller('MainController', ['appData', function(app) {
	var self = this;

	self.isLoggedIn = app.isLoggedIn;
	self.active = false;
	self.miscData = app.miscData;
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
}]);
// Main function is manage event lists "page".
studyHallApp.controller('LoginController', ['appData', function(app) {
	var self = this;

	self.active = false;
	self.loginData = app.loginData;
	self.state = app.state;
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
}]);
// Main function is manage event lists "page".
studyHallApp.controller('EventsController', ['appData', '$scope', function(app, $scope) {
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
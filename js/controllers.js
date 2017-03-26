// Main function is that wrap all sub-controllers. State management.
studyHallApp.controller('MainController', ['appData', function(app) {
	var self = this;

	self.isLoggedIn = app.isLoggedIn;
	self.active = false;
	self.miscData = app.miscData;
	self.state = app.state;
}]);
// Main function is manage event lists "page".
studyHallApp.controller('LoginController', ['appData', function(app) {
	var self = this;

	self.active = false;
	self.loginData = app.loginData;
	self.state = app.state;
	self.falseInputUser = 0;
	self.falseInputPass = 0;

	resetLogin = function() {
		self.falseInputUser = 0;
		self.falseInputPass = 0;
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
studyHallApp.controller('EventsController', ['appData', function(app) {
	var self = this;
	// var mymap = L.map('mapid').setView([28.6024, 81.2001], 2);
	// L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	// 	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
	// 	maxZoom: 18,
	// 	id: 'your.mapbox.project.id',
	// 	accessToken: 'your.mapbox.public.access.token'
	// }).addTo(mymap);

	var map = L.map('map').setView([51.505, -0.09], 13);

	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	L.marker([51.5, -0.09]).addTo(map)
	    .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
	    .openPopup();

	self.active = false;
	self.eventListData = app.eventListData;
	self.state = app.state;

	self.getEventList = function() {
		app.listEvents();
	};
}]);
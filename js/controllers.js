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
studyHallApp.controller('EventsController', ['appData', function(app) {
	var self = this;

	var map = L.map('map-events').setView([28.6024, -81.2001], 16);

	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	L.marker([28.6024, -81.2001]).addTo(map)
	    .bindPopup('University of<br>Central Florida')
	    .openPopup();

	self.active = false;
	self.eventListData = app.eventListData;
	self.state = app.state;

	self.getEventList = function() {
		app.listEvents();
	};
}]);
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
		var self = 1;
		if(self.user === ""){
			//Toggle user error. Dont call app.login
			self = 0;
			self.falseInputUser = 1;
		}
		if(self.pass === ""){
			//Toggle password error
			self = 0;
			self.falseInputPass = 1;
		}

		if(self === 1){
			app.login(self.user, self.pass);
		}
	};
}]);
// Main function is manage event lists "page".
studyHallApp.controller('EventsController', ['appData', function(app) {
	var self = this;

	self.active = false;
	self.eventListData = app.eventListData;
	self.state = app.state;

	self.getEventList = function() {
		app.listEvents();
	};
}]);
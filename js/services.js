studyHallApp.factory('appData', ['$http', function($http) {
	var app = {};								// Main object the service passes back to controller.

	app.eventListData = {};						// Angular prefers objects to primitives for binding.
	app.eventListData.isPublicEvents = true;	// Lets us know the view public events toggle is on.
	app.eventListData.isPrivateEvents = false;	// Lets us know the view private events toggle is on.
	app.eventListData.events = [];				// List of event objects returned from query.

	app.eventData = {};
	app.eventData.event = {};					// event object of selected event.

	app.state = {};								// Manages overall state of application.
	app.state.isLoggedIn = true;				// Ensures user is logged in and allowed in certain areas.
	app.state.registration = false;				// User is on register page.
	app.state.events = true;					// User is on list events page.
	app.state.event = false;					// User is on individual event page.
	app.state.rsos = false;						// User is on rsos page.
	app.state.rso = false;						// User is on individual rso page.
	app.state.userId = 0;						// User's id after logging in.

	app.loginData = {};
	app.loginData.userId = null;
	app.loginData.errorLogin = false;

	goToEvent = function() {
		if(app.state.isLoggedIn) {
			app.state.events = false;
			app.state.event = true;
			app.state.rsos = false;
			app.state.rso = false;
			app.state.registration = false;
		}
	};
	goToEvents = function() {
		if(app.state.isLoggedIn) {
			app.state.events = true;
			app.state.event = false;
			app.state.rsos = false;
			app.state.rso = false;
			app.state.registration = false;
		}
	};
	goToRSO = function(rsoId=null) {
		if(app.state.isLoggedIn && rsoId) {
			app.state.events = false;
			app.state.event = false;
			app.state.rsos = false;
			app.state.rso = true;
			app.state.registration = false;
		}
	};
	goToRSOs = function() {
		if(app.state.isLoggedIn) {
			app.state.events = false;
			app.state.event = false;
			app.state.rsos = true;
			app.state.rso = false;
			app.state.registration = false;
		}
	};
	goToRegistration = function() {
		if(!app.state.isLoggedIn) {
			app.state.events = false;
			app.state.event = false;
			app.state.rsos = false;
			app.state.rso = false;
			app.state.registration = true;
		}
	};
	login = function(userId=null) {
		if(userId) {
			app.state.isLoggedIn = true;
			app.state.events = true;
			app.loginData.userId = userId;
		}
	};
	// Post template
	app.editEvent = function(id) {
		$http({
			method: 'POST',
			url: './actions/event.php',
			data:
			{
				id: id
			}
		}).then(function successCallback(response) {
			console.log(response.data);
		}, function errorCallback(response) {
			console.log(response);
		});
	};
	// Called when user clicks on a specific id.
	app.getEventById = function(event=null) {
		console.log(event);
		if(event !== null) {
			app.eventData.event = event;
			goToEvent();
		}
	};
	// Called when user lands on main page.
	// @param {int} mode - public, private, all determines query type.
	app.listEvents = function() {
		var mode = '';
		if(app.loginData.userId
			&& !app.eventListData.isPublicEvents
			&& app.eventListData.isPrivateEvents
		) {
			mode = '?user_id=' + app.loginData.userId + '&private';
		} else if(app.loginData.userId
			&& app.eventListData.isPublicEvents
			&& app.eventListData.isPrivateEvents
		) {
			mode = '?user_id=' + app.loginData.userId;
		}
		$http({
			method: 'GET',
			url: './actions/event.php' + mode,
			transformResponse: [function (data) {
				return data;
			}]
		}).then(function successCallback(response) {
			var parsed = JSON.parse(response.data);
			app.eventListData.events = parsed;
		}, function errorCallback(response) {
			console.log("failure", response.statusText);
		});
	};

	app.login = function(user=null, passw=null) {
		app.loginData.errorLogin = false;
		$http({
			method: 'POST',
			url: './actions/user.php',
			data:
			{
				type: 'log',
				user: user,
				pass: passw
			},
			transformResponse: [function (data) {
				return data;
			}]
		}).then(function successCallback(response) {
			if(response.data === '"{}"'){
				//Error on login. Incorrect username or password
				app.loginData.errorLogin = true;
			}
			else{
				var parsed = JSON.parse(response.data);
				login(parsed[0].s_id);
			}
		}, function errorCallback(response) {
			console.log(response);
			//Call failure here?
		});
	};
	// Toggles the public events view
	app.togglePublicEvents = function() {
		app.eventListData.isPublicEvents = !app.eventListData.isPublicEvents;
		app.listEvents();
	}
	// Toggles the public events view
	app.togglePrivateEvents = function() {
		app.eventListData.isPrivateEvents = !app.eventListData.isPrivateEvents;
		app.listEvents();
	}
	// Pass one-way data to those dependent on the service.
	return app;
}]);
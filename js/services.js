studyHallApp.factory('appData', ['$http', function($http) {
	var app = {};								// Main object the service passes back to controller.

	app.eventListData = {};						// Angular prefers objects to primitives for binding.
	app.eventListData.isPublicEvents = true;	// Lets us know the view public events toggle is on.
	app.eventListData.isPrivateEvents = false;	// Lets us know the view private events toggle is on.

	app.state = {};								// Manages overall state of application.
	app.state.isLoggedIn = false;				// Ensures user is logged in and allowed in certain areas.
	app.state.events = false;					// User is on list events page.
	app.state.event = false;					// User is on individual event page.
	app.state.rsos = false;						// User is on rsos page.
	app.state.rso = false;						// User is on individual rso page.
	app.state.userId = 0;						// User's id after logging in.

	goToEvent = function(eventId=null) {
		if(app.state.isLoggedIn && eventId) {
			app.state.events = false;
			app.state.event = true;
			app.state.rsos = false;
			app.state.rso = false;
		}
	};
	goToEvents = function() {
		if(app.state.isLoggedIn) {
			app.state.events = true;
			app.state.event = false;
			app.state.rsos = false;
			app.state.rso = false;
		}
	};
	goToRSO = function(rsoId=null) {
		if(app.state.isLoggedIn && rsoId) {
			app.state.events = false;
			app.state.event = false;
			app.state.rsos = false;
			app.state.rso = true;
		}
	};
	goToRSOs = function() {
		if(app.state.isLoggedIn) {
			app.state.events = false;
			app.state.event = false;
			app.state.rsos = true;
			app.state.rso = false;
		}
	};
	login = function(userId=null) {
		if(userId) {
			app.state.isLoggedIn = true;
			app.state.events = true;
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
	// Called when user lands on main page.
	// @param {int} mode - public, private, all determines query type.
	app.listEvents = function(userId=null, univId=null) {
		console.log(userId, univId);
		var mode = '';
		if(userId && univId) {
			mode = '?user_id=' + userId + '&uni=' + univId;
		} else if(userId) {
			mode = '?user_id=' + userId;
		}
		$http({
			method: 'GET',
			url: './actions/event.php' + mode,
			transformResponse: [function (data) {
				return data;
			}]
		}).then(function successCallback(response) {
			console.log("success", response.data);
		}, function errorCallback(response) {
			console.log("failure", response.statusText);
		});
	};

	app.login = function(user=null, passw=null) {
		$http({
			method: 'POST',
			url: './actions/event.php',
			data:
			{
				type: log,
				user: id,
				pass: passw
			},
			transformResponse: [function (data) {
				return data;
			}]
		}).then(function successCallback(response) {
			console.log(response.data);
			login(response.data.s_id);
		}, function errorCallback(response) {
			console.log(response);
			//Call failure here?
		});
	};
	// Toggles the public events view
	app.togglePublicEvents = function() {
		app.eventListData.isPublicEvents = !app.eventListData.isPublicEvents;
	}
	// Toggles the public events view
	app.togglePrivateEvents = function() {
		app.eventListData.isPrivateEvents = !app.eventListData.isPrivateEvents;
	}
	// Pass one-way data to those dependent on the service.
	return app;
}]);
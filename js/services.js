studyHallApp.factory('appData', ['$http', function($http) {
	var app = {};								// Main object the service passes back to controller.

	app.eventListData = {};						// Angular prefers objects to primitives for binding.
	app.eventListData.isPublicEvents = true;	// Lets us know the view public events toggle is on.
	app.eventListData.isPrivateEvents = false;	// Lets us know the view private events toggle is on.
	app.eventListData.events = [];				// List of event objects returned from query.

	app.eventData = {};
	app.eventData.event = {};					// event object of selected event.

	app.state = {};								// Manages overall state of application.
	app.state.isLoggedIn = false;				// Ensures user is logged in and allowed in certain areas.
	app.state.registration = false;				// User is on register page.
	app.state.events = false;					// User is on list events page.
	app.state.event = false;					// User is on individual event page.
	app.state.rsos = false;						// User is on rsos page.
	app.state.rso = false;						// User is on individual rso page.
	app.state.userId = 0;						// User's id after logging in.
	app.state.createEvent = false;

	app.loginData = {};
	app.loginData.errorLogin = false;
	app.loginData.registrationSuccess = false;

	app.registerData = {};
	app.registerData.registered = false;

	app.eventCreate = {};

	// Router function to send user to individual event page.
	goToEvent = function() {
		if(app.state.isLoggedIn) {
			app.state.events = false;
			app.state.event = true;
			app.state.rsos = false;
			app.state.rso = false;
			app.state.registration = false;
		}
	};
	// Router function to send user to events list page.
	goToEvents = function() {
		if(app.state.isLoggedIn) {
			app.state.events = true;
			app.state.event = false;
			app.state.rsos = false;
			app.state.rso = false;
			app.state.registration = false;
		}
	};
	// Router function to send user to individual rso page.
	goToRSO = function() {
		if(app.state.isLoggedIn) {
			app.state.events = false;
			app.state.event = false;
			app.state.rsos = false;
			app.state.rso = true;
			app.state.registration = false;
		}
	};
	// Router function to send user to rsos list page.
	goToRSOs = function() {
		if(app.state.isLoggedIn) {
			app.state.events = false;
			app.state.event = false;
			app.state.rsos = true;
			app.state.rso = false;
			app.state.registration = false;
		}
	};
	// Router function to send user to registration page.
	goToRegistration = function() {
		if(!app.state.isLoggedIn) {
			app.state.events = false;
			app.state.event = false;
			app.state.rsos = false;
			app.state.rso = false;
			app.state.registration = true;
		}
	};
	// Router function to send user (on successful login) to events list page.
	login = function(userId=null) {
		if(userId) {
			app.state.isLoggedIn = true;
			app.state.events = true;
			app.state.userId = userId;
			goToEvents();
		}
	};

	goToLogin = function(){
		app.state.isLoggedIn = false;				// Ensures user is logged in and allowed in certain areas.
		app.state.registration = false;				// User is on register page.
		app.state.events = false;					// User is on list events page.
		app.state.event = false;					// User is on individual event page.
		app.state.rsos = false;						// User is on rsos page.
		app.state.rso = false;
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
	// Called when user lands on events list page.
	app.listEvents = function() {
		var mode = '';
		if(app.state.userId
			&& !app.eventListData.isPublicEvents
			&& app.eventListData.isPrivateEvents
		) {
			mode = '?user_id=' + app.state.userId + '&private';
		} else if(app.state.userId
			&& app.eventListData.isPublicEvents
			&& app.eventListData.isPrivateEvents
		) {
			mode = '?user_id=' + app.state.userId;
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
			notifyObservers(); // Call to update map markers.
		}, function errorCallback(response) {
			console.log("failure", response.statusText);
		});
	};
	// Called when user attempts to login.
	app.login = function(user=null, passw=null) {
		app.loginData.errorLogin = false;
		app.loginData.registrationSuccess = false;
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

	app.register = function(email=null, user=null, pass=null, name=null, major=null, minor=null, bio=null) {
		app.loginData.errorLogin = false;
		app.loginData.registrationSuccess = false;
		$http({
			method: 'POST',
			url: './actions/usercreate.php',
			data:
			{
				email: email,
				username: user,
				password: pass,
				name: name,
				major: major,
				minor: minor,
				bio: bio
			},
			transformResponse: [function (data) {
				return data;
			}]
		}).then(function successCallback(response) {
			var parsed = JSON.parse(response.data);
			if(parsed.status === "success"){
				//Error on login. Incorrect username or password
				app.registerData.registered = true;
				app.loginData.registrationSuccess = true;
				console.log("SUCCESS");
				goToLogin();
			}
			else{
				console.log('failure registering');
				app.registerData.registered = false;
			}
		}, function errorCallback(response) {
			console.log(response);
			//Call failure here?
		});
	};

	app.createEvent = function(id=null, nameE=null, start=null, end=null, type=null, desc=null, phone=null, email=null, latitude=null, longitude=null, nameL=null) {
	
		$http({
			method: 'POST',
			url: './actions/event.php',
			data:
			{
				user_id: id,
				type: "create",
				location_info:{
					latitude: latitude,
					longitude: longitude,
					name: nameL
				},
				event_info:{
					event_type: type,
					name: nameE,
					start_time: start,
					end_time: end,
					description: desc,
					phone_num: phone,
					email: email
					}
			},
			transformResponse: [function (data) {
				return data;
			}]
		}).then(function successCallback(response) {
			var parsed = JSON.parse(response.data);
			if(parsed.status === "success"){
				//Error on login. Incorrect username or password
				console.log("SUCCESS");
			}
			else{
				console.log('failure registering');
			}
		}, function errorCallback(response) {
			console.log(response);
			//Call failure here?
		});
	};

	app.resetLog = function() {
		app.loginData.registrationSuccess = false;
	};

	app.sendToRegister = function() {
		goToRegistration();
	};

	app.sendToLogin = function() {
		goToLogin();
	};
	// Toggles the public events view
	app.togglePublicEvents = function() {
		app.eventListData.isPublicEvents = !app.eventListData.isPublicEvents;
		app.listEvents();
	};
	// Toggles the public events view
	app.togglePrivateEvents = function() {
		app.eventListData.isPrivateEvents = !app.eventListData.isPrivateEvents;
		app.listEvents();
	};
	/*** Allows service to call controller when significant change happens - START ***/
	var observerCallbacks = [];

	//register an observer
	app.registerObserverCallback = function(callback) {
		observerCallbacks.push(callback);
	};

	//call this when you know 'foo' has been changed
	var notifyObservers = function() {
		angular.forEach(observerCallbacks, function(callback) {
			callback();
		});
	};
	/*** Allows service to call controller when significant change happens - END ***/

	// Pass one-way data to those dependent on the service.
	return app;
}]);
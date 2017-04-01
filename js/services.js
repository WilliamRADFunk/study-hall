studyHallApp.factory('appData', ['$http', function($http) {
	var app = {};								// Main object the service passes back to controller.

	app.eventListData = {};						// Angular prefers objects to primitives for binding.
	app.eventListData.isPublicEvents = true;	// Lets us know the view public events toggle is on.
	app.eventListData.isPrivateEvents = false;	// Lets us know the view private events toggle is on.
	app.eventListData.events = [];				// List of event objects returned from query.

	app.eventData = {};							// Object to individual event page variables.
	app.eventData.event = {};					// Event object of selected event.

	app.state = {};								// Manages overall state of application.
	app.state.isLoggedIn = false;				// Ensures user is logged in and allowed in certain areas.
	app.state.userId = 0;						// User's id after logging in.
	app.state.latitude = 0;				// User's school's latitude for map centering.
	app.state.longitude = 0;				// User's school's longitude for map centering.
	app.state.registration = false;				// User is on register page.
	app.state.events = false;					// User is on list events page.
	app.state.event = false;					// User is on individual event page.
	app.state.rsos = false;						// User is on rsos page.
	app.state.rso = false;						// User is on individual rso page.
	app.state.createEvent = false;				// User is on event creation page.
	app.state.createRSO = false;				// User is on rso creation page.

	app.navigation = {};						// Contains service navigation functions.

	app.loginData = {};							// Data object to contain returned login data.
	app.loginData.errorLogin = false;			// Error boolean to trigger hide/show of error msg.
	app.loginData.registrationSuccess = false;	// Boolean to default set username/password if just registered.

	app.registerData = {};						// Data object for registration variables.
	app.registerData.registered = false;		// Flag to determine if registration succeeded.

	app.eventCreateData = {};					// Data object containing variables for event creation page.
	app.eventCreateData.rso = [];				// Array of possible rsos available to attach event to.

	// Router function to send user (on successful login) to events list page.
	login = function(userId=null, lat=null, long=null) {
		if(userId) {
			app.state.isLoggedIn = true;
			app.state.events = true;
			app.state.userId = userId;
			app.state.latitude = lat;
			app.state.longitude = long;
			app.navigation.goToEvents();
		}
	};
	// Router function to send user to create event page.
	app.navigation.goToCreateEvent = function() {
		if(app.state.isLoggedIn) {
			app.state.events = false;
			app.state.event = false;
			app.state.rsos = false;
			app.state.rso = false;
			app.state.registration = false;
			app.state.createEvent = true;
			app.state.createRSO = false;
		}
	};
	// Router function to send user to create rso page.
	app.navigation.goToCreateRSO = function() {
		if(app.state.isLoggedIn) {
			app.state.events = false;
			app.state.event = false;
			app.state.rsos = false;
			app.state.rso = false;
			app.state.registration = false;
			app.state.createEvent = false;
			app.state.createRSO = true;
		}
	};
	// Router function to send user to individual event page.
	app.navigation.goToEvent = function() {
		if(app.state.isLoggedIn) {
			app.state.events = false;
			app.state.event = true;
			app.state.rsos = false;
			app.state.rso = false;
			app.state.registration = false;
			app.state.createEvent = false;
			app.state.createRSO = false;
		}
	};
	// Router function to send user to events list page.
	app.navigation.goToEvents = function() {
		if(app.state.isLoggedIn) {
			app.state.events = true;
			app.state.event = false;
			app.state.rsos = false;
			app.state.rso = false;
			app.state.registration = false;
			app.state.createEvent = false;
			app.state.createRSO = false;
		}
	};
	// Router function to send user to login page.
	app.navigation.goToLogin = function(){
		app.state.isLoggedIn = false;				// Ensures user is logged in and allowed in certain areas.
		app.state.registration = false;				// User is on register page.
		app.state.events = false;					// User is on list events page.
		app.state.event = false;					// User is on individual event page.
		app.state.rsos = false;						// User is on rsos page.
		app.state.rso = false;
		app.state.createEvent = false;
		app.state.createRSO = false;
	};
	// Router function to send user to individual rso page.
	app.navigation.goToRSO = function() {
		if(app.state.isLoggedIn) {
			app.state.events = false;
			app.state.event = false;
			app.state.rsos = false;
			app.state.rso = true;
			app.state.registration = false;
			app.state.createEvent = false;
			app.state.createRSO = false;
		}
	};
	// Router function to send user to rsos list page.
	app.navigation.goToRSOs = function() {
		if(app.state.isLoggedIn) {
			app.state.events = false;
			app.state.event = false;
			app.state.rsos = true;
			app.state.rso = false;
			app.state.registration = false;
			app.state.createEvent = false;
			app.state.createRSO = false;
		}
	};
	// Router function to send user to registration page.
	app.navigation.goToRegistration = function() {
		if(!app.state.isLoggedIn) {
			app.state.events = false;
			app.state.event = false;
			app.state.rsos = false;
			app.state.rso = false;
			app.state.registration = true;
			app.state.createEvent = false;
			app.state.createRSO = false;
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
				//, parsed[0].latitude, parsed[0].longitude
				console.log(parsed);
				login(parsed[0].s_id, parsed[0].latitude, parsed[0].longitude);
			}
		}, function errorCallback(response) {
			console.log(response);
			//Call failure here?
		});
	};
	// API function to send registration information to db.
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
	// API call to send event data to db for event creation.
	app.createEvent = function(id=null, nameE=null, start=null, end=null, type=null, desc=null, phone=null, email=null, latitude=null, longitude=null, nameL=null, rso=null) {
	
		$http({
			method: 'POST',
			url: './actions/event.php',
			data:
			{
				rso_id: rso,
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
	// GET to receive rsos available to user for event creation purposes.
	app.getAvailableRSO = function() {

		$http({
			method: 'GET',
			url: './actions/rso.php?user_id=' + app.state.userId + '&rso_id',
			transformResponse: [function (data) {
				return data;
			}]
		}).then(function successCallback(response) {
			console.log(response);
			var parsed = JSON.parse(response.data);
			app.eventCreateData.rso = parsed;
		}, function errorCallback(response) {
			console.log("failure", response.statusText);
		});
	};
	// Trigger to clear login page form fields.
	app.resetLog = function() {
		app.loginData.registrationSuccess = false;
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
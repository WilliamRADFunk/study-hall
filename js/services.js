studyHallApp.factory('appData', ['$http', function($http) {
	var app = {};								// Main object the service passes back to controller.
	app.isLoggedIn = false;						// Ensures user is logged in and allowed in certain areas.

	app.eventListData = {};						// Angular prefers objects to primitives for binding.
	app.eventListData.isPublicEvents = true;	// Lets us know the view public events toggle is on.

	// Post template
	app.editEvent = function(id) {
			$http({
				method: 'POST',
				url: 'http://jitorodriguez.com/EventNote/event.php',
				data:
				{
					id: id
				}
			}).then(function successCallback(response) {
				console.log(response);
			}, function errorCallback(response) {
				console.log(response);
			});
		}
	};
	// Called when user lands on main page.
	// @param {int} mode - public, private, all determines query type.
	app.listEvents = function(userId=null, univId=null) {
		var mode = '';
		if(userId && univId) {
			mode = '?user_id=' + userId + '&uni=' + univId;
		} else if(userId) {
			mode = '?user_id=' + userId;
		}
		$http({
			method: 'GET',
			url: 'http://jitorodriguez.com/EventNote/event.php' + mode
		}).then(function successCallback(response) {
			console.log("Success");
		}, function errorCallback(response) {
			console.log(response.statusText);
			getNewMovies();
		});
	};
	// Pass one-way data to those dependent on the service.
	return game;
}]);
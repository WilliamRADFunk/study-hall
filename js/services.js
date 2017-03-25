studyHallApp.factory('appData', ['$http', function($http)
{
	var app = {};								// Main object the service passes back to controller.
	app.isLoggedIn = false;						// Ensures user is logged in and allowed in certain areas.

	app.eventListData = {};						// Angular prefers objects to primitives for binding.
	app.eventListData.isPublicEvents = true;	// Lets us know the view public events toggle is on.

	// Post template
	app.produceMovie = function(id)
	{
			$http(
			{
				method: 'POST',
				url: './actions/createMovie.php',
				data:
				{
					id: actualPopularity
				}
			}).then(function successCallback(response)
			{
				console.log(response);
			}, function errorCallback(response)
			{
				console.log(response);
			});
		}
	};
	// Called when user lands on main page.
	// @param {int} mode - public, private, all determines query type.
	app.listEvents = function()
	{
		$http(
		{
			method: 'GET',
			url: './actions/getMovies.php'
		}).then(function successCallback(response)
		{
			console.log("Success");
		}, function errorCallback(response)
		{
			console.log(response.statusText);
			getNewMovies();
		});
	};
	// Pass one-way data to those dependent on the service.
	return game;
}]);
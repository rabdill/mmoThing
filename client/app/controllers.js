var mmoControllers = angular.module('mmoControllers', [
	'ngRoute'
]);

mmoControllers.controller('FrontCtrl', ['$scope', 'LoginSvc', '$q', '$location', function ($scope, LoginSvc, $q, $location) {
	var attempts = 0;	// to prevent a zillion facebook popups
  $scope.checkLoginState = function() {
    FB.getLoginStatus(function(status) {
			attempts++;
			LoginSvc.evaluate(status)
			.then(function(res) {	// if they are logged in now
				console.log("User accepted.");
				$scope.name = res.firstName;
				return LoginSvc.getCity(res.fbook.id);
			},
			function(err) {	// if they aren't logged in
				if(err == "not logged in") {
					console.log("Not logged in.");
					if(attempts < 2) {
						FB.login(function(){	// pop up the FB login box
							$scope.checkLoginState();	// then do this again
						});
					} else {
						attempts = 0; // so they can hit the button again
					}
					return $q.reject();
				} else if(err == "no account") {
					console.log("New user!");
					prepareNewUser(status.authResponse);
					return $q.reject();
				}
			})
			.then(function(res) {	// once we get their city
				if(!res) {	// if they never actually logged in (i.e. closed the login box)
					console.log("Nothin.");
					return $q.reject();
				}
				$scope.city = res.city;
				$location.url('square/' + res.city.name);
			});
    });
  };

	// dealing with new users:
	var details;
	var prepareNewUser = function(data) {
		$scope.newUserTime = true;
		details = {
			token : data.accessToken,
			userId : data.userID
		};
	};
	$scope.createUser = function() {
		details.town = $scope.town;
		LoginSvc.newUser(details).then(function(user) {
			console.log(user);
		});
	};
}]);

mmoControllers.controller('SquareCtrl', ['$scope', "$q", "$interval", "$routeParams", 'CitySvc', 'StoreSvc', 'MetaSvc',
	function ($scope, $q, $interval, $routeParams, CitySvc, StoreSvc, MetaSvc) {

	// fetch the game info data
	MetaSvc.lookup('house').then(function(res) {
		$scope.houseData = res;
	});
	MetaSvc.lookup('farm').then(function(res) {
		$scope.farmData = res;
	});

	var fetchData = function() {
		CitySvc.getStats($routeParams.city).then(function(data) {
			$scope.city = displayFormatting(data);
		});
		console.log("Fetching...");
	};

	var rounder = function(number, places) {
		return Math.floor(number * (10 ^ places)) / (10 ^ places);
	};
	var displayFormatting = function(city) {
		city.population.count = rounder(city.population.count, 0);
		city.coin.count = rounder(city.coin.count, 0);
		city.food.count = rounder(city.food.count, 0);

		city.coin.netHr = rounder(city.coin.ratePerCapita * city.population.count * 3600, 2);
		city.food.netHr = rounder(3600 * (city.food.rate - (city.food.consumptionPerCapita * city.population.count)), 2);

		// setting foodMessage:
		if(city.food.net < 0) {
			city.foodMessage = "You aren't pulling in enough food.";
		} else if(city.food.net === 0) {
			city.foodMessage = "Subsistance farming. Pulling in just enough to survive."
		} else {
			city.foodMessage = "";
		}
		return city;
	};

	/* refreshes data on load, then every 3.05 seconds */
	fetchData();
	var updater = $interval(fetchData, 3050);

	// for canceling the auto-refresher
	$scope.stop = function() {
		console.log("Canceling...");
		$interval.cancel(updater);
	};

	// build a thing
	$scope.build = function(item, qty) {
		StoreSvc.build(item, qty, $scope.city.name).then(function(data) {
			console.log(data.message);
		})
		.catch(function(err) {
			console.log(err);
		});
	};

	// sell food
	$scope.sellFood = function(qty) {
		StoreSvc.sell('food',qty).then(function(data) {
			console.log(data.message);
		})
		.catch(function(err) {
			console.log(err);
		});
	};
}]);

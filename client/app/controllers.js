var mmoControllers = angular.module('mmoControllers', [
	'ngRoute'
]);

mmoControllers.controller('LoginCtrl', ['$scope', '$rootScope', 'LoginSvc', '$q', '$location', function ($scope, $rootScope, LoginSvc, $q, $location) {
  $scope.checkLoginState = function(promptForLogin) {
		LoginSvc.FBcheck()
		.then(function(status) {	 // if they're logged in
			$rootScope.token = status.authResponse.accessToken;
			$rootScope.userId = status.authResponse.userID;
			return LoginSvc.gameCheck(status);
		},
		function() {	// if they aren't logged in
			console.log("Not logged in.");
			if(promptForLogin) {
				FB.login(function(){	// pop up the FB login box
					$scope.checkLoginState(false);	// then do this again
				});
			}
			return $q.reject("not logged in");
		})
		.then(function(res) {	// if they're a known player
				$rootScope.token = res.fbook.token;
				return LoginSvc.getCity(res.fbook.id);
			},
			function(err) {	// if they're new or not logged in
				if(err == "new user") {
					console.log("New user!");
					prepareNewUser(err.authResponse);
				}
				return $q.reject(err);
			})
			.then(function(res) {	// once we get their city
				if(!res) {	// still trying to figure out why this would happen
					console.log("No city?");
					return $q.reject();
				}
				$scope.city = res.city;	// otherwise, take them to their town
				$location.url('square/' + res.city.name);
			},
			function() {
				console.log("not going to get your city yet because you don't have one.");
			});
  };

	$scope.checkLoginState(false);

	// dealing with new users:
	var details;
	var prepareNewUser = function() {
		$scope.newUserTime = true;	// activate the form
		details = {
			token : $rootScope.token,
			userId : $rootScope.userId
		};
	};
	$scope.createUser = function() {
		details.town = $scope.town;
		LoginSvc.newUser(details).then(function(user) {
			console.log(user);
			$scope.checkLoginState();
		});
	};
}]);

mmoControllers.controller('SquareCtrl', ['$scope', "$q", "$interval", "$routeParams", "$location", 'CitySvc', 'StoreSvc', 'MetaSvc',
	function ($scope, $q, $interval, $routeParams, $location, CitySvc, StoreSvc, MetaSvc) {

	// fetch the game info data
	MetaSvc.lookup('house').then(function(res) {
		$scope.houseData = res;
	});
	MetaSvc.lookup('farm').then(function(res) {
		$scope.farmData = res;
	});

	var fetchData = function() {
		console.log("Fetching...");
		CitySvc.getStats($routeParams.city).then(function(data) {
			$scope.city = displayFormatting(data);
			return true;
		},
		function() {	// if the city request is rejected
			$location.url('/');
			return false;
		});
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

	/* refreshes data on load, then every 3.05 seconds. only if it's a valid request. */
	var validRequest = fetchData();
	if(validRequest) var updater = $interval(fetchData, 3050);

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

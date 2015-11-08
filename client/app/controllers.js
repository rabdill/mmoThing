var mmoControllers = angular.module('mmoControllers', [
	'ngRoute'
]);

mmoControllers.controller('HomeCtrl', ['$scope', "$q", "$interval", 'CitySvc', 'StoreSvc', 'MetaSvc',
	function ($scope, $q, $interval, CitySvc, StoreSvc, MetaSvc) {

	// fetch the game info data
	MetaSvc.lookup('house').then(function(res) {
		$scope.houseData = res;
	});
	MetaSvc.lookup('farm').then(function(res) {
		$scope.farmData = res;
	});

	/* refreshes data every 3.05 seconds */
	var updater = $interval(function() {
		CitySvc.getStats().then(function(data) {
			$scope.city = data;

			$scope.city.coin.count = Math.floor($scope.city.coin.count);
			$scope.city.food.count = Math.floor($scope.city.food.count);
			$scope.city.coin.net = Math.floor(100 * ($scope.city.coin.ratePerCapita * $scope.city.population.count)) / 100;
			$scope.city.food.net = Math.floor(100 * ($scope.city.food.rate - ($scope.city.food.consumptionPerCapita * $scope.city.population.count))) / 100;
		});
		console.log("Fetching...");
	}, 3050);

	// for canceling the auto-refresher
	$scope.stop = function() {
		console.log("Canceling...");
		$interval.cancel(updater);
	};

	// buy a thing
	$scope.buy = function(item) {
		StoreSvc.buy(item).then(function(data) {
			console.log(data.message);
		})
		.catch(function(err) {
			console.log(err);
		});
	};

	// upgrade a thing
	$scope.upgrade = function(item, id) {
		console.log(id);
		StoreSvc.upgrade(item, id).then(function(data) {
			console.log(data.message);
		})
		.catch(function(err) {
			console.log(err);
		});
	};

}]);

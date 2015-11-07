var mmoControllers = angular.module('mmoControllers', [
	'ngRoute'
]);

mmoControllers.controller('HomeCtrl', ['$scope', "$q", "$interval", 'CitySvc', '$http',
	function ($scope, $q, $interval, CitySvc, $http) {

	/* for printing, round down non-integers for categories where decimals
			don't make sense
	*/
	var applyRounding = function(cityData) {
		cityData.population.count = Math.floor(cityData.population.count);
		return cityData;
	}

	/* refreshes data every 3.05 seconds */
	var updater = $interval(function() {
		CitySvc.getStats().then(function(data) {
			$scope.data = {};
			angular.copy(data, $scope.data); // for printing out the HTTP response literally

			$scope.city = applyRounding(data);
		});
		console.log("Fetching...");
	}, 3050);

	// for canceling the auto-refresher
	$scope.stop = function() {
		console.log("Canceling...");
		$interval.cancel(updater);
	};

	// buy a house
	$scope.buyHouse = function() {
		$http.post('http://localhost:3000/Delran/purchase/house')
			.success(function(data) {
				console.log(data);
			})
			.error(function(err) {
				console.log(err);
			});
	};

}]);

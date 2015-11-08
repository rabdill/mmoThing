var mmoControllers = angular.module('mmoControllers', [
	'ngRoute'
]);

mmoControllers.controller('HomeCtrl', ['$scope', "$q", "$interval", 'CitySvc', 'StoreSvc',
	function ($scope, $q, $interval, CitySvc, StoreSvc) {

	/* refreshes data every 3.05 seconds */
	var updater = $interval(function() {
		CitySvc.getStats().then(function(data) {
			$scope.data = data.raw;
			$scope.city = data.printable;
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
		StoreSvc.house().then(function(data) {
			console.log(data.message);
		})
		.catch(function(err) {
			console.log(err);
		});
	};

}]);

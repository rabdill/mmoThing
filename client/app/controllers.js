var mmoControllers = angular.module('mmoControllers', [
	'ngRoute'
]);

mmoControllers.controller('HomeCtrl', ['$scope', "$q", "$interval", 'CitySvc', 'StoreSvc', 'MetaSvc',
	function ($scope, $q, $interval, CitySvc, StoreSvc, MetaSvc) {

	var houseData, gameData;
	// fetch the house data
	MetaSvc.house().then(function(res) {
		houseData = res;
	});

	/* refreshes data every 3.05 seconds */
	var updater = $interval(function() {
		CitySvc.getStats().then(function(data) {
			$scope.city = data;
		});
		console.log("Fetching...");
	}, 3050);

	// for canceling the auto-refresher
	$scope.stop = function() {
		console.log("Canceling...");
		$interval.cancel(updater);
	};

	// buy a house
	$scope.buy = function(item) {
		StoreSvc.buy(item).then(function(data) {
			console.log(data.message);
		})
		.catch(function(err) {
			console.log(err);
		});
	};

}]);

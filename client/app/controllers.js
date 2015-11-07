var mmoControllers = angular.module('mmoControllers', [
	'ngRoute'
]);

mmoControllers.controller('HomeCtrl', ['$scope', "$q", "$interval", 'CitySvc',
	function ($scope, $q, $interval, CitySvc) {

	var fetch = function() {
		/;*/
	};

	var updater = $interval(function() {
		CitySvc.getStats().then(function(data) {
			$scope.city = data;
			var stampy = new Date(data.last_updated).getTime();
			console.log(stampy);
		});
		console.log("Fetching...");
	}, 3000);


	$scope.stop = function() {
		console.log("Canceling...");
		$interval.cancel(updater);
	};

}]);

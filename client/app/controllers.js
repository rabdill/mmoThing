var mmoControllers = angular.module('mmoControllers', [
	'ngRoute'
]);

mmoControllers.controller('HomeCtrl', ['$scope', "$q", 'CitySvc',
	function ($scope, $q, CitySvc) {
	CitySvc.getStats().then(function(data) {
		$scope.city = data;
	});

}]);

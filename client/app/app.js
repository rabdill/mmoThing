app = angular.module('mmoThing', [
	'ngRoute',
	'mmoControllers'
]);

app.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/square/:city', {
			templateUrl: 'views/square.html',
			controller: 'SquareCtrl'
		}).
		when('/', {
			templateUrl: 'views/index.html',
			controller: 'LoginCtrl'
		}).
		otherwise({redirectTo: '/square'});
}]);

app.config(['$httpProvider', function($httpProvider) {
	$httpProvider.defaults.useXDomain = true;
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);

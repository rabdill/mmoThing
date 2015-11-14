app = angular.module('mmoThing', [
	'ngRoute',
	'mmoControllers'
]);

app.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/square', {
			templateUrl: 'views/home.html',
			controller: 'HomeCtrl'
		}).
		when('/', {
			templateUrl: 'views/index.html',
			controller: 'FrontCtrl'
		}).
		otherwise({redirectTo: '/square'});
}]);

app.config(['$httpProvider', function($httpProvider) {
	$httpProvider.defaults.useXDomain = true;
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);

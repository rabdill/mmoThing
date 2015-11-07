app = angular.module('mmoThing', [
	'ngRoute',
	'mmoControllers'
]);

app.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/', {
			templateUrl: 'views/home.html',
			controller: 'HomeCtrl'
		}).
		otherwise({redirectTo: '/'});
}]);

app.config(['$httpProvider', function($httpProvider) {
	$httpProvider.defaults.useXDomain = true;
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);

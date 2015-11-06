app = angular.module('mmoThing', [
	'ngRoute',
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

app.controller('HomeCtrl', ['$scope', '$http', function ($scope, $http) {
	$scope.woo = "WOO!";
	$http.get('http://localhost:3000/Delran/home').success(function(data) {
		$scope.city = data;
	});
}]);

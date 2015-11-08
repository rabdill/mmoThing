mmoThing = angular.module("mmoThing");

mmoThing.service("CitySvc", ["$http", "$q", function($http, $q) {
	var self = this;

	self.getStats = function() {
		return $q(function(resolve, reject) {
			$http.post('http://localhost:3000/Delran/home')
				.success(function(res) {
					resolve(res);
				})
				.error(reject);
		});
	};

	return self;
}]);

mmoThing.service("StoreSvc", ["$http", "$q", function($http, $q) {
	var self = this;
	self.house = function() {
		return $q(function(resolve, reject) {
			$http.post('http://localhost:3000/Delran/purchase/house')
				.success(function(res) {
					resolve(res);
				})
				.error(reject);
		});
	};

	return self;
}]);

mmoThing.service("MetaSvc", ["$http", "$q", function($http, $q) {
	var self = this;

	self.house = function() {
		return $q(function(resolve, reject) {
			$http.get('http://localhost:3000/meta/house')
				.success(function(res) {
					resolve(res);
				})
				.error(reject);
		});
	};

	self.game = function() {
		return $q(function(resolve, reject) {
			$http.get('http://localhost:3000/meta/game')
				.success(function(res) {
					resolve(res);
				})
				.error(reject);
		});
	};

	return self;
}]);

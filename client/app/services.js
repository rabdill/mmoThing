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
	self.buy = function(item) {
		return $q(function(resolve, reject) {
			params = {level : 0};
			$http.post('http://localhost:3000/Delran/purchase/' + item, params)
				.success(function(res) {
					resolve(res);
				})
				.error(reject);
		});
	};
	self.upgrade = function(item, id) {
		return $q(function(resolve, reject) {
			var params = {
				id : id
			};
			$http.post('http://localhost:3000/Delran/upgrade/' + item, params)
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

	self.lookup = function(category) {
		return $q(function(resolve, reject) {
			$http.get('http://localhost:3000/meta/' + category)
				.success(function(res) {
					resolve(res);
				})
				.error(reject);
		});
	}

	return self;
}]);

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
	self.buy = function(item, level) {
		if(!level) level == 0;

		return $q(function(resolve, reject) {
			params = {level : level};
			$http.post('http://localhost:3000/Delran/purchase/' + item, params)
				.success(function(res) {
					resolve(res);
				})
				.error(reject);
		});
	};

	self.sell = function(item, qty) {
		return $q(function(resolve, reject) {
			var params = {
				qty : qty
			};
			$http.post('http://localhost:3000/Delran/sell/' + item, params)
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

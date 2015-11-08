mmoThing = angular.module("mmoThing");

mmoThing.service("CitySvc", ["$http", "$q", function($http, $q) {
	var self = this;

	/* for printing, round down non-integers for categories where decimals
			don't make sense
	*/
	var applyRounding = function(cityData) {
		cityData.population.count = Math.floor(cityData.population.count);
		return cityData;
	}

	self.getStats = function() {
		return $q(function(resolve, reject) {
			$http.post('http://localhost:3000/Delran/home')
				.success(function(res) {
					resolve({
						raw : res,
						printable: applyRounding(res)
					});
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

mmoThing = angular.module("mmoThing");

mmoThing.service("CitySvc", ["$http", "$q", function($http, $q) {
	var self = this;

	self.getStats = function(city) {
		return $q(function(resolve, reject) {
			$http.post('http://localhost:3000/' + city + '/home')
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
	self.build = function(item, level) {
		if(!level) level == 0;

		return $q(function(resolve, reject) {
			params = {level : level};
			$http.post('http://localhost:3000/Delran/build/' + item, params)
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

mmoThing.service("LoginSvc", ["$q", "$http", function($q, $http) {
	var self = this;

	self.evaluate = function(fbook) {
		return $q(function(resolve, reject) {
			switch(fbook.status) {
				case "connected":
					var params = {
						token : fbook.authResponse.accessToken
					};
					$http.post('http://localhost:3000/user/' + fbook.authResponse.userID, params)
						.success(function(res) {
							resolve(res);
						})
						.error(reject);
					break;
				default:
					FB.login(function(response){
						self.evaluate(response);
					});
					break;
			}
		});
	};

	self.getCity = function(userId) {
		return $q(function(resolve, reject) {
			$http.get('http://localhost:3000/user/' + userId + '/getCity')
				.success(function(res) {
					resolve({"city" : res});
				})
				.error(reject);
		});
	};

	return self;
}]);

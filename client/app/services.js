mmoThing = angular.module("mmoThing");

mmoThing.service("CitySvc", ["$http", "$rootScope", "$q", function($http, $rootScope, $q) {
	var self = this;

	self.getStats = function(city) {
		return $q(function(resolve, reject) {
			var params = {
				token : $rootScope.token
			};
			console.log(params);
			$http.post('http://localhost:3000/' + city + '/home', params)
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
	self.build = function(item, level, city) {
		if(!level) level == 0;

		return $q(function(resolve, reject) {
			params = {level : level};
			$http.post('http://localhost:3000/' + city + '/build/' + item, params)
				.success(function(res) {
					resolve(res);
				})
				.error(reject);
		});
	};

	self.sell = function(item, qty, city) {
		return $q(function(resolve, reject) {
			var params = {
				qty : qty
			};
			$http.post('http://localhost:3000/' + city + '/sell/' + item, params)
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

	self.FBcheck = function() {	// if they're logged into facebook
		return $q(function(resolve, reject) {
			FB.getLoginStatus(function(data) {
				console.log("BEEP");
				console.log(data);
				if(data.status == "connected") {
					resolve(data);
				} else {
					reject("not logged in");
				}
			});
		});
	};

	self.gameCheck = function(fbook) {	// if we know about them
		return $q(function(resolve, reject) {
			var params = {
				token : fbook.authResponse.accessToken
			};
			$http.post('http://localhost:3000/user/' + fbook.authResponse.userID, params)
			.success(function(res) {
				console.log("Found user!");
				resolve(res);
			})
			.error(function(err) {
				reject("new user");
			});
		});
	};

	self.getCity = function(userId) {
		console.log("We're getting the city!");
		return $q(function(resolve, reject) {
			$http.get('http://localhost:3000/user/' + userId + '/getCity')
				.success(function(res) {
					resolve({"city" : res});
				})
				.error(function() {
					reject();
				});
		});
	};

	self.newUser = function(user) {
		return $q(function(resolve, reject) {
			$http.post('http://localhost:3000/user/create', user)
				.success(function(res) {
					resolve("yaaay");
				})
				.error(reject);
		});
	};

	return self;
}]);

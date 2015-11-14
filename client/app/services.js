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

	self.getUser = function() {
		return $q(function(resolve, reject) {
			console.log("Trying...");
			FB.init({
				appId      : '1025296660845354',
				cookie     : true,
				version    : 'v2.5'
			});

			FB.getLoginStatus(function(response) {
				switch(response.status) {
					case "connected":
						var params = {
							token : response.authResponse.accessToken
						};
						$http.post('http://localhost:3000/user/' + response.authResponse.userID, params)
							.success(function(res) {
								console.log("Wahoo!");
								console.log(res);
								resolve(res);
							})
							.error(reject);
					case "not_authorized":
						reject("You aren't logged into the app.");
						break;
					default:
						reject("You aren't logged into Facebook.");
						break;
				}
			});
		});
	}

	return self;
}]);

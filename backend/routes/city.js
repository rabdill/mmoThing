var City = require('../models/city').City;
var User = require('../models/user').User;
var q = require('q');

exports.square = function(req, res) {
	var cityStorage;
	City.findByName(req.params.city).
	then(function(city) {
		cityStorage = city;
		return User.findById(city.ruler);
	})
	.then(function(user) {
		if(user.fbook.token === req.body.token) {
			return q.resolve(cityStorage);
		} else {
			return q.reject();
		}
	})
	.then(function(city) {
		return city.update();
	})
	.then(function(data) {
		res.json(200, data);
	})
	.fail(function(err) {
		console.log(err);
		res.json(500, { message: "Something broke somewhere else." });
	});
};

exports.findByUser = function(req, res) {
	City.findByUser(req.params.id).
	then(function(city) {
		res.json(200, city);
	}).
	fail(function(err) {
		res.json(500, { message: "Something broke somewhere else." });
	});
};

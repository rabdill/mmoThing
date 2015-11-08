var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var q = require('q');

var citySchema = new Schema({
	name : String,
	population : {
		count: { type : Number, default: 20 },
		rate: { type : Number, default: 1 }
	},
	coin : {
		count: { type : Number, default: 0 },
		ratePerCapita: { type : Number, default: 0.1 }
	},
	buildings : {
		houses : [
			{level: Number}
		]
	},
	last_updated : { type : Date, default: Date.now }
});

citySchema.methods.update = function() {
	var self = this;	// in this case, will be a particular city
	var now = new Date().getTime();
	var last = new Date(self.last_updated).getTime();
	// fast-forward however many ticks have happened since last update:
	for(var i=0; i < ((now - last)/1000); i++) {
		self.population.count += self.population.rate;
		self.coin.count += self.coin.ratePerCapita * self.population.count;
	}
	self.last_updated = now;

	// save update:
	return q.promise(function(resolve, reject) {
		self.model('city').update({ _id: self.id }, { $set: self }, function(err) {
			if(err) reject(err);
			else resolve(self);
		});
	});
};

citySchema.statics.findByName = function(search) {
	var self = this;	// in this case, will be the "city" schema as a whole
	return q.promise(function(resolve, reject) {
		self.findOne({ name: search }, function(err, city) {
			if(err) reject(err);
			else if(!city) reject(new Error("No city named " + search));
			else {
				resolve(city);
			}
		});
	});
}

module.exports = {
	City: mongoose.model('city', citySchema),
};

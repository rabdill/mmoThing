var mongoose = require('mongoose')
var Schema = mongoose.Schema;

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

citySchema.methods.findByName = function(search) {
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

citySchema.methods.update = function(callback) {
	var self = this;	// in this case, will be a particular city
	var now = new Date().getTime();
	var last = new Date(this.last_updated).getTime();

	// update tax revenue before population gets updated:
	this.coin.count += this.coin.ratePerCapita * this.population.count;

	// update population:
	this.population.count += ((now - last)/1000) * this.population.rate;
	this.last_updated = now;

	// write it back to DB
	return this.model('city').findByIdAndUpdate(this.id, { $set: this }, callback);
};

module.exports = {
	City: mongoose.model('city', citySchema)
};

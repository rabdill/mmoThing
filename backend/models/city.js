var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var citySchema = new Schema({
	name : String,
	population : {
		value: Number,
		rate: { type : Number, default: 1 }
	},
	last_updated : { type : Date, default: Date.now }
});

module.exports = {
	City: mongoose.model('city', citySchema)
};

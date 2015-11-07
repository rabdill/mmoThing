var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var citySchema = new Schema({
	name : String,
	population : Number,
	last_updated : { type : Date, default: Date.now } 
});

module.exports = {
	City: mongoose.model('city', citySchema)
};

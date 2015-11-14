var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var q = require('q');

var userSchema = new Schema({
	firstName : String,
	fbook : {
		id: String,
		token : String,
		expires : Date
	}
});

userSchema.methods.update = function(data) {
	var self = this;	// in this case, will be a particular city
	self.fbook.token = data.token;
	self.fbook.expires = new Date(data.expires);
	console.log("Expiring: " + self.fbook.expires);

	// save update:
	return q.promise(function(resolve, reject) {
		self.model('user').update({ _id: self.id }, { $set: self }, function(err) {
			if(err) reject(err);
			else resolve(self);
		});
	});
};

userSchema.statics.findById = function(search) {
	var self = this;	// in this case, will be the "city" schema as a whole
	return q.promise(function(resolve, reject) {
		self.findOne({ 'fbook.id' : search }, function(err, user) {
			if(err) reject(err);
			else if(!user) reject(new Error("No user with id " + search));
			else {
				resolve(user);
			}
		});
	});
}

module.exports = {
	User: mongoose.model('user', userSchema),
};

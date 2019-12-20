var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: { type: String, required: true, max: 100 },
  first_name: { type: String, required: true, max: 100 },
  family_name: { type: String, required: true, max: 100 },
  password: { type: String, required: true, min: 6, max: 100 },
  member: { type: Boolean, required: true },
  admin: { type: Boolean, required: true }
});

// Virtual for user's full name
UserSchema.virtual("name").get(function() {
  return this.family_name + ", " + this.first_name;
});

// Virtual for user's URL
UserSchema.virtual("url").get(function() {
  return "/clubhouse/user/" + this._id;
});

//Export model
module.exports = mongoose.model("User", UserSchema);

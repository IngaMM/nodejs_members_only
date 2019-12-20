var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var MessageSchema = new Schema({
  title: { type: String, required: true, max: 100 },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  timestamp: { type: Date, required: true },
  content: { type: String }
});

// Virtual for message's URL
MessageSchema.virtual("url").get(function() {
  return "/clubhouse/message/" + this._id;
});

//Export model
module.exports = mongoose.model("Message", MessageSchema);

var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

var classSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  description: String,
  subscribers: [{ userId: ObjectId }],
  onlineSubscribers: [{ userId: ObjectId }]
});

var Class = mongoose.model('Class', classSchema);
module.exports = Class;
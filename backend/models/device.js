const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const DeviceSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  deviceName: {
    type: String,
    required: true
  },
  deviceZipCode: {
    type: String,
    required: true
  },
});

module.exports = Device = mongoose.model("devices", DeviceSchema);

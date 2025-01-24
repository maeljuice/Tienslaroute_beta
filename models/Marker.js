const mongoose = require('mongoose');

const markerSchema = new mongoose.Schema({
  lat: Number,
  lng: Number,
  address: String
});

module.exports = mongoose.model('Marker', markerSchema);

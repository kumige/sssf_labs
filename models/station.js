// https://docs.mongodb.com/manual/core/2dsphere/

const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

const Schema = mongoose.Schema;

const stationSchema = new Schema({
  Title: String,
  AddressLine1: String,
  Town: String,
  StateOrProvince: String,
  Postcode: String,
  Connections: [{ type: Schema.Types.ObjectId, ref: 'Connection' }],
  Locations: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number], //first is longitude, second latitude
      required: true
    }

  }
});

module.exports = mongoose.model('Station', stationSchema);

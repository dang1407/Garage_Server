const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var parkingFeeSchema = new mongoose.Schema({
    vehicle: {
      type: String,
      required: true
    }, 
    licensePlates: {
      type: String,
      required: true
    },
    typeCustomer: {
      type: String,
      required: true
    },
    timein: {
      type: Date, 
      required: true
    },
    dayin: {
      type: String, 
      required: true
    },
    timeout: {
      type: Date
    },
    status: {
      type: String,
      default: "Xe chưa ra khỏi bãi!!"
    }
});

//Export the model
module.exports = mongoose.model('ParkingFee', parkingFeeSchema);
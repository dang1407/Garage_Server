// const mongoose = require('mongoose');

// function connect(){
//       mongoose.connect('mongodb://localhost:27017/admin', {
//             useNewUrlParser: true,
//             useUnifiedTopology: true
//       })
//       .then(() => console.log("Connected to MongoDB!"))
//       .catch(err => console.log('Could not connect to MongoDB',err))
// }

// module.exports = { connect };

const mongoose = require("mongoose");

function connect() {
  mongoose.connect("mongodb://localhost:27017/admin", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));
}

module.exports = { connect };
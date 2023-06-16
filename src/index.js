const express = require('express');
const cors = require('cors');
const port = 5000;
const app = express();
const mongoose = require('mongoose');
const route = require('./app/routes');
const bodyParser = require('body-parser')
// Connect database
mongoose.connect("mongodb://127.0.0.1:27017/admin", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false })); // Xử lý dữ liệu URL-encoded

// Connect BE and FE
app.use(cors());


// Config rout
route(app);
app.listen(port, () => {
      console.log(`Server is listening on port ${port}!`);
})
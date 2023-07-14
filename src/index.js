const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();
const connectDB = require("./config/db");
const route = require('./app/routes');
const bodyParser = require('body-parser');
const doenv = require('dotenv').config()
const cookieParser = require('cookie-parser');

// Connect database
connectDB();

app.use(express.json());

// Xử lý dữ liệu URL-encoded
app.use(express.urlencoded({extended: true}))
// Connect BE and FE
app.use(cors());

// Đọc cookie
app.use(cookieParser());

// Config rout
route(app);
app.listen(port, () => {
      console.log(`Server is listening on port ${port}!`);
})
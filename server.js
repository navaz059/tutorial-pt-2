const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const port = process.env.Port || 3000;

const app = express();

//This is the production URL need to go in config files
app.use(cors());

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));
require('./routes/route')(app);
app.listen(port);
console.log(`Port listening at ${port}`);
module.exports = app;

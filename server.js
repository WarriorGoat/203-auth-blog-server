// Loads the configuration from config.env to process.env
require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

//Assign port
const PORT = process.env.PORT || 5002;

const { mongooseConnect } = require("./mongoose.js");
mongooseConnect();
const cors = require('cors');
const mongoose = require('mongoose');

//register routes.
//NOTE: notice how there is no .js after index, this is because
// we exported the module as index. 
const indexRouter = require('./routes/index');
const blogRoutes = require('./routes/blogs');

const app = express();

// get MongoDB driver connection
// const dbo = require('./db/conn');

//View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//set up logger and cookie parser 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//allows us to load static files from public 
app.use(express.static(path.join(__dirname, 'public')));

//Register routes
app.use(cors());
app.options("*", cors());
// app.use(express.json());
app.use('/', indexRouter);
app.use('/blogs', blogRoutes); 

//Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//Error handling
app.use(function (err, req, res, next) {
  //set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development'? err :{};

  //render the error page
  res.status(err.status || 500);
  res.render('error');
});


// perform a database connection when the server starts
// dbo.connectToServer(function (err) {
//   if (err) {
//     console.error(err);
//     process.exit();
//   }

  // start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});


module.exports = app;

// Loads the configuration from config.env to process.env
require("dotenv").config();

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

//Assign port
const PORT = process.env.PORT || 5002;

//register routes.
//NOTE: notice how there is no .js after index, this is because
// we exported the module as index.
const indexRouter = require("./routes/index");
const blogRoutes = require("./routes/blogs");
const userRoutes = require("./routes/users");

const { mongooseConnect } = require("./mongoose.js");
mongooseConnect();
const mongoose = require("mongoose");

const app = express();

//View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//set up logger and cookie parser
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//allows us to load static files from public
app.use(express.static(path.join(__dirname, "public")));

//Register routes
app.use(cors());
app.options("*", cors());
app.use("/", indexRouter);
app.use("/blogs", blogRoutes);
app.use("/users", userRoutes);

//Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

//Error handling
app.use(function (err, req, res, next) {
  //set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  //render the error page
  res.status(err.status || 500);
  res.render("error");
});

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

module.exports = app;

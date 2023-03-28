//import mongoose library
const mongoose = require ("mongoose");
const {v4: uuidv4} = require("uuid");

//Create a blogSchema
const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  text: String,
  categories: [String],
  id: {type: String, default: ()=>uuidv4()},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
});



//Register the model and make it available to other files
module.exports = Blog= mongoose.model("sample_blogs", blogSchema);
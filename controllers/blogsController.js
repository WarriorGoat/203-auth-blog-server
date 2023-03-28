

const Blog = require('../models/Blogs');

//Request and display all blogs
async function getAllBlogs(req, res) {

    //query blogs 
    try {
      const allBlogs = await Blog.find({});
      res.json({
        success: true,
        blogs: allBlogs });
    }catch(e){
      console.log(`Error Point 1` + e);
    }
}

//Create a new blog
async function createOneBlog(req, res, next) {
    try {
      //parse out fields from POST request
      const title  = req.body.title; 
      const text = req.body.text; 
      const author = req.body.author;
      const categories = req.body.category;
      const year =  req.body.year;
  
      //pass fields to new Blog model 
      const newBlog = new Blog({
          title,
          text,
          author,
          categories,
          year
      });
  
      //save our new entry to the database 
      const savedData =  await newBlog.save();
      
      //return the successful request to the user 
      res.json({
          success: true,
          blogs: savedData
      });
  
    } catch (e) {
      console.log(typeof e);
      console.log(e);
      res.json({
        error: e.toString(),
      });
    }
  }

// This section will pull a single record, using the a dynamic id paramter.
async function getOneBlog(req, res, next) {

  try {
    const oneBlog = await Blog.findOne({"id": req.params.id});
    res.json({blog: oneBlog});
  }
  catch (error) {
    res.status(500).send(error);
  }
};

// This section will pull a single record, using the a dynamic id paramter.
async function deleteOneBlog(req, res, next) {
  try {
    const oneBlog = await Blog.findOneAndRemove({"id": req.params.id});
    res.json({message: "Removed", 
      blog: oneBlog});
  }
  catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
    getAllBlogs,
    createOneBlog,
    getOneBlog,
    deleteOneBlog
};
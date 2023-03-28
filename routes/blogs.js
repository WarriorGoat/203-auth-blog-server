const express = require ('express');
const blogRoutes = express.Router();
const { v4: uuidv4 } = require ("uuid");
const blogsController = require('../controllers/blogsController');
uuidv4();

// GET All Blog Posts
blogRoutes.get('/all',blogsController.getAllBlogs);

// This section will pull a single record, using the a dynamic id paramter.
blogRoutes.get('/getOne/:id', blogsController.getOneBlog
);

//add a new post
blogRoutes.post("/create-one", blogsController.createOneBlog);

// This section will help you delete a record.
blogRoutes.delete('/deleteOne/:id', blogsController.deleteOneBlog); 
 

// This section will help you retrieve multiple records and sort them.
// blogRoutes.route('/getManyStatic').




module.exports = blogRoutes;
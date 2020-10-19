const blogsRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const Blog = require("../models/blog");
const User = require("../models/user");
blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user");
  response.json(blogs);
});


blogsRouter.post("/", async (request, response, next) => {
  const blog = new Blog(request.body);
  const token = request.token
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if(!token || !decodedToken.id) {
    return response.status(401).json({error: 'token missing or invalid'})
  }
  const user = await User.findById(decodedToken.id);
  blog.user = user._id;
  const result = await blog.save();
  user.blogs = user.blogs.concat(result._id);
  await user.save();
  response.status(201).json(result);
});

blogsRouter.delete("/:id", async (request, response, next) => {
  const token = request.token
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if(!token || !decodedToken.id) {
    return response.status(401).json({error: 'token missing or invalid'})
  }
  const blog = await Blog.findById(request.params.id);
  if(blog.user.toString() !== decodedToken.id){
    return response.status(401).json({error: 'You can only delete your own blog'})
  
  }

  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response, next) => {
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });
  response.json(updatedBlog.toJSON());
});

module.exports = blogsRouter;

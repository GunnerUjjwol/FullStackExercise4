const _ = require("lodash");
const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.reduce((sum, blog) => {
        return sum + blog.likes;
      }, 0);
};

const mostLikes = (blogs) => {
  return blogs.reduce(
    (mostLikedBlog, blog) => {
      if (blog.likes > mostLikedBlog.likes) {
        mostLikedBlog.title = blog.title;
        mostLikedBlog.author = blog.author;
        mostLikedBlog.likes = blog.likes;
      }
      return mostLikedBlog;
    },
    { title: "", author: "", likes: 0 }
  );
};

const mostBlogs = (blogs) => {
  const blogPartitioned = {};
  blogs.forEach((blog) => {
    if (!Object.keys(blogPartitioned).includes(blog.author)) {
      blogPartitioned[blog.author] = { author: blog.author, blogs: 1 };
    } else {
      blogPartitioned[blog.author].blogs += 1;
    }
  });
  return _.maxBy(Object.values(blogPartitioned), "blogs");
};

const mostLikedAuthor = (blogs) => {
  const blogPartitioned = {};
  blogs.forEach((blog) => {
    if (!Object.keys(blogPartitioned).includes(blog.author)) {
      blogPartitioned[blog.author] = { author: blog.author, likes: blog.likes };
    } else {
      blogPartitioned[blog.author].likes += blog.likes;
    }
  });
  return _.maxBy(Object.values(blogPartitioned), "likes");
};

module.exports = {
  dummy,
  totalLikes,
  mostLikes,
  mostBlogs,
  mostLikedAuthor
};

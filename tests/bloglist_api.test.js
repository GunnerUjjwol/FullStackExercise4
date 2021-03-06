const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);
const Blog = require("../models/blog");
const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url:
      "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
];

let token;
beforeAll( async() => {
  await api.post("/api/users").send({
    username: "GunnerUjjwol",
    password: "12345678",
  });
  const response = await api.post("/api/login").send({
    username: "GunnerUjjwol",
    password: "12345678",
  });
  token = response.body.token;
})
beforeEach(async () => {
  await Blog.deleteMany({});
  const blogObjects = initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
  
});
test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("there are zero blogs", async () => {
  const response = await api
    .get("/api/blogs")
    .set("Authorization", `Bearer ${token}`);
  expect(response.body).toHaveLength(initialBlogs.length);
});

test("a specific blog is within the returned blogs", async () => {
  const response = await api
    .get("/api/blogs")
    .set("Authorization", `Bearer ${token}`);
  const blogTitles = response.body.map((r) => r.title);
  expect(blogTitles).toContain("React patterns");
});

test("id Property defined", async () => {
  const response = await api
    .get("/api/blogs")
    .set("Authorization", `Bearer ${token}`);
  expect(response.body[0].id).toBeDefined();
});

test('Post request without authorization is rejected',async () => {
  const newBlog = {
    title: "Ujjwol Test Note123",
    author: "Ujjwol Dandekhya",
    url: "https://reactpatterns.com/",
    likes: 70,
  };
  await api
  .post("/api/blogs")
    .send(newBlog)
    .expect(401)
});

test("a valid blog can be added", async () => {
  const newBlog = {
    title: "Ujjwol Test Note",
    author: "Ujjwol Dandekhya",
    url: "https://reactpatterns.com/",
    likes: 70,
  };
  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs").set('Authorization', `Bearer ${token}`);

  const titles = response.body.map((r) => r.title);

  expect(response.body).toHaveLength(initialBlogs.length + 1);
  expect(titles).toContain("Ujjwol Test Note");
});

test("blog without likes is defaulted to zero", async () => {
  const newBlog = {
    title: "Ujjwol Test Note",
    author: "Ujjwol Dandekhya",
    url: "https://reactpatterns.com/",
  };

  if (!newBlog.likes) {
    newBlog.likes = 0;
  }

  const response = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog);
  expect(response.body.likes).toBe(0);
});

test("blog without title and url is not added", async () => {
  const newBlog = {
    author: "Ujjwol Dandekhya",
  };

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(400);

  const response = await api
    .get("/api/blogs")
    .set("Authorization", `Bearer ${token}`);

  expect(response.body).toHaveLength(initialBlogs.length);
});

test("deletion succeeds with status code 204 if id is valid", async () => {
  const newBlog = {
    title: "Ujjwol Test Note",
    author: "Ujjwol Dandekhya",
    url: "https://reactpatterns.com/",
    likes: 70,
  };
  const response = await api
    .post("/api/blogs")
    .send(newBlog)
    .set("Authorization", `Bearer ${token}`);
  let blogsAtStart = await api
    .get("/api/blogs")
    .set("Authorization", `Bearer ${token}`);
  blogsAtStart = blogsAtStart.body;
  const blogToDelete = response.body;

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(204);

  let blogsAtEnd = await api
    .get("/api/blogs")
    .set("Authorization", `Bearer ${token}`);
  blogsAtEnd = blogsAtEnd.body;

  expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1 - 1);

  const titles = blogsAtEnd.map((r) => r.title);

  expect(titles).not.toContain(blogToDelete.title);
});

afterAll(() => {
  mongoose.connection.close();
});

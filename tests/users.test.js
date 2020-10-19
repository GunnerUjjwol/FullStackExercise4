const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const bcrypt = require("bcrypt");

const api = supertest(app);
const User = require("../models/user");

beforeEach(async () => {
  await User.deleteMany({});
    
  const passwordHash = await bcrypt.hash("123456", 10);
  const user = new User({ username: "root", passwordHash });

  await user.save();
});

test("creation succeeds with a fresh username", async () => {
  let usersAtStart = await api.get("/api/users");
  usersAtStart = usersAtStart.body;
  const newUser = {
    username: "GunnerUjjwol",
    name: "Ujjwol Dandekhya",
    password: "asdfghjkl",
  };

  await api
    .post("/api/users")
    .send(newUser)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  let usersAtEnd = await api.get("/api/users");
  usersAtEnd = usersAtEnd.body;
  expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

  const usernames = usersAtEnd.map((u) => u.username);
  expect(usernames).toContain(newUser.username);
});

test("users without username and password is not added", async () => {
    const newUser = {
      name: "Ujjwol Dandekhya",
    };
  
    let usersAtStart = await api.get("/api/users")
    usersAtStart = usersAtStart.body
    await api.post("/api/users").send(newUser).expect(400);
  
    const response = await api.get("/api/users");
  
    expect(response.body).toHaveLength(usersAtStart.length);
  });

  test("users with invalid username and password is not added", async () => {
    const newUser = {
      username: "uj",
      name: "Ujjwol Dandekhya",
      password: "12"
    };
  
    let usersAtStart = await api.get("/api/users")
    usersAtStart = usersAtStart.body
    await api.post("/api/users").send(newUser).expect(400);
  
    const response = await api.get("/api/users");
  
    expect(response.body).toHaveLength(usersAtStart.length);
  });

  test("users with non-unique username is not added", async () => {
    const newUser = {
      username: "root",
      name: "Ujjwol Dandekhya",
      password: "1234566"
    };
  
    let usersAtStart = await api.get("/api/users")
    usersAtStart = usersAtStart.body
    await api.post("/api/users").send(newUser).expect(400);
  
    const response = await api.get("/api/users");
  
    expect(response.body).toHaveLength(usersAtStart.length);
  });

afterAll(() => {
  mongoose.connection.close();
});

const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }

  if (!isValid(username)) return res.status(200).send("Username already exists");

  users.push({ username, password });
  return res.status(201).send("Customer successfully registered. You can now login");
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  //Write your code here
  const promise = new Promise(function (resolve, reject) {
    resolve(JSON.stringify(books, null, 2));
  });
  const data = await promise;
  res.status(200).send(data);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  new Promise((resolve, reject) => resolve(books[req.params.isbn])).then((data) => res.status(200).json(data));
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  new Promise((resolve, reject) => {
    const author = req.params.author;
    const data = Object.entries(books)
      .filter(([_, data]) => data.author === author)
      .map(([_, data]) => data);
    resolve({ [author]: data });
  }).then((data) => res.status(200).json(data));
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  new Promise((resolve, reject) => {
    const title = req.params.title;
    const data = Object.entries(books)
      .filter(([_, data]) => data.title === title)
      .map(([_, data]) => data);
    resolve({ [title]: data });
  }).then((data) => res.status(200).json(data));
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  return res.status(200).json(books[req.params.isbn].reviews);
});

module.exports.general = public_users;

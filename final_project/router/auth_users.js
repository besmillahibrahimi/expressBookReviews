const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  return !users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  return users.some((user) => user.username === username && user.password === password);
};

//only registered users can login
regd_users.post("/login", async (req, res) => {
  try {
    //Write your code
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "username and password are required." });

    if (!authenticatedUser(username, password)) return res.status(400).json({ message: "Credential doesn't match." });

    const token = jwt.sign({ username }, "test_secret", { expiresIn: 60 * 60 });

    req.session.authorization = { token, username };

    return res.status(200).send("You are now authenticated");
  } catch (error) {
    res.status(500).json(error);
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const username = req.session.authorization["username"];
  books[isbn].reviews[username] = req.query.review ?? req.body.review;

  return res.status(200).json({ message: `You have added/modified a review for book with isb ${isbn}.` });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization["username"];
  delete books[req.params.isbn].reviews[username];
  return res.status(200).json({ message: "Your review has been deleted." });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

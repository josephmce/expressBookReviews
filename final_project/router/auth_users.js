const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const doesExist = (username) => {
    return users.some(user => user.username === username);
  };

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  return userswithsamename.length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  return validusers.length > 0;
}

//only registered users can login - Route to handle user login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken, username
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Get the ISBN from the URL
    const ISBN = req.params.isbn;
    //Get the review text from the request body
    const review = req.body.review;
    //Retrieve logged in user's username
    const username = req.session.authorization.username;
    //Look up the book via the ISBN
    const book = books[ISBN];

    if (!book) {
        return res.status(404).json({ message: "Cannot find the book" });
    }
    //If the review is empty or contains only spaces then display this message
    if (!review || review.trim() === "") {
        return res.status(400).json({ message: "Review cannot be empty" });
    }

    // Add or update the review
    book.reviews[username] = review;

    return res.status(200).json({ message: `${username}, your review for ${book.title} has been added/updated successfully!` });
    //To make the PUT request, go to postman, enter /customer/auth/review/1 as the put request. Then "review": "Such a great book!" as the JSON body. 
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.doesExist = doesExist;

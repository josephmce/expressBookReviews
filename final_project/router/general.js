const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
let doesExist = require("./auth_users.js").doesExist;
const public_users = express.Router();



// Route to handle user registration
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    //Gets the list of books and displays, check in postman with a Get request
    return res.status(200).json(books);
});

// Get book details based on ISBN
//In Postman, go to the URL of the site and append /isbn/[number] to the end to view the details of 1 book
public_users.get('/isbn/:isbn',function (req, res) {
    //Extract the ISBN from the URL
    const isbn = req.params.isbn;
    //Look up the book using the ISBN in the books object
    const book = books[isbn];

    if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({ message: "This book cannot be found." });
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    //Get author from url string, convert to lowercase
  const author = req.params.author.toLowerCase();
  //Variable to store list of matched books
  const matchedBooksList = {};
  //For loop to go through each ISBN keys (book objects). 
  for (let ISBN in books){
    //Then access the book object using the ISBN key. Then checks if the book's author matches the author pass in the URL 
    //Use toLowerCase here too so the case entered doesn't matter
    if (books[ISBN].author.toLowerCase() === author) {
        //If the author matches then add the book to the matchedBooklist object using the ISBN ID as the key
        matchedBooksList[ISBN] = books[ISBN];
    }
  }
  if (Object.keys(matchedBooksList).length > 0) {
    return res.status(200).json(matchedBooksList);
    } else {
        return res.status(404).json({ message: "No books can be found for this author." });
    }
}); 

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    //This is similar to the code for retreiving the author
    const title = req.params.title.toLowerCase();
    const matchedBooksList = {};

    for (let ISBN in books) {
        if (books[ISBN].title.toLowerCase() === title) {
            matchedBooksList[ISBN] = books[ISBN];
        }
    }
    if (Object.keys(matchedBooksList).length > 0) {
        return res.status(200).json(matchedBooksList);
    } else {
        return res.status(404).json({ message: "No books can be found with this title." });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    //Extract ISBN from URL
    const isbn = req.params.isbn;
    //Look up the book object usin the ISBN
    const book = books[isbn];

    if (book) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({ message: "This book cannot be found." });
    }
});

module.exports.general = public_users;

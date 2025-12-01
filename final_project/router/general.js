const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
let doesExist = require("./auth_users.js").doesExist;
const public_users = express.Router();



// Route to handle user registration
//To Register, go to Postman, make a POST request to /register, with parameters as raw JSON: {"username": "johndoe", "password": "mypassword"}
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

/*
// Get the book list available in the shop
public_users.get('/',function (req, res) {
    //Gets the list of books and displays, check in postman with a Get request
    const booksString = JSON.stringify(books, null, 2);

    // Send it as a JSON response
    res.status(200).send(booksString);
});*/

//Get the book list available in the shop using async-await with Axios
//Simulate async fetching of books
function fetchBooks() {
    return new Promise((resolve) => {
        //Simulates 3.5s delay
        setTimeout(() => resolve(books), 3500);
    });
}

public_users.get('/', async (req, res) => {
    try {
        //Wait for "async" operation
        const allBooks = await fetchBooks();
        res.status(200).send(JSON.stringify(allBooks, null, 2));
    } catch (err) {
        res.status(500).json({ message: "Error fetching books" });
    }
});



// Get book details based on ISBN
//In Postman, go to the URL of the site and append /isbn/[number] to the end to view the details of 1 book
/*public_users.get('/isbn/:isbn',function (req, res) {
    //Extract the ISBN from the URL
    const isbn = req.params.isbn;
    //Look up the book using the ISBN in the books object
    const book = books[isbn];

    if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({ message: "This book cannot be found." });
    }
 });*/


//Using a Promise callback to get the books based on ISBN
 //In Postman, go to the URL of the site and append /isbn/[number] to the end to view the details of 1 book
 public_users.get('/isbn/:isbn', function (req, res) {
    const ISBN = req.params.isbn;
    //Creating a Promise to simulate async book lookup
    const getBookByISBN = new Promise((resolve, reject) => {
        setTimeout(() => {
            const book = books[ISBN];
            if (book) {
                //Promise is resolved with book
                resolve(book);
            } else {
                //Otherwise reject with error message
                reject("This book can't be found.");
            }
        }, 5000); //Simulate 5s delay
    });

    //Call the promise
    getBookByISBN.then((book) => {
        //If the promise resolves successfully then display the book
        res.status(200).json(book);
        })
        //If the promise is rejected, executes this error message
        .catch((errMessage) => {
            res.status(404).json({ message: errMessage });
        });
});



  
// Get book details based on author
/*public_users.get('/author/:author',function (req, res) {
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
}); */

//Get book details based on author using Callback Promise
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author.toLowerCase();
    //Create a Promise to simulate async book lookup
    const getBooksByAuthor = new Promise((resolve, reject) => {
        setTimeout(() => {
            const matchedBooksList = {};
            //Loop through the list of books and match the author
            for (let ISBN in books) {
                if (books[ISBN].author.toLowerCase() === author) {
                    matchedBooksList[ISBN] = books[ISBN];
                }
            }
            //This returns an array of all the keys in the matchedBooksList object
            if (Object.keys(matchedBooksList).length > 0) {
                //if it's greater than 0 then it resolves with the matched books
                resolve(matchedBooksList);
            } else {
                reject("No books found for this author."); //promise rejected with error message
            }
        }, 2400); //Simulate 2.4s delay
    });
    //Call the Promise and handle results
    getBooksByAuthor
        .then((matchedBooks) => res.status(200).json(matchedBooks))
        .catch((errMessage) => res.status(404).json({ message: errMessage }));
});



// Get all books based on title
/*public_users.get('/title/:title',function (req, res) {
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
});*/
//Get all books based on title using Promise callbacks
//Get book details based on author using Callback Promise
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title.toLowerCase();
    //Create a Promise to simulate async book lookup
    const getBooksByTitle = new Promise((resolve, reject) => {
        setTimeout(() => {
            const matchedBooksList = {};
            //Loop through the list of books and match the title
            for (let ISBN in books) {
                if (books[ISBN].title.toLowerCase() === title) {
                    matchedBooksList[ISBN] = books[ISBN];
                }
            }
            //This returns an array of all the keys in the matchedBooksList object
            if (Object.keys(matchedBooksList).length > 0) {
                //if it's greater than 0 then it resolves with the matched books
                resolve(matchedBooksList);
            } else {
                reject("No books found for by this title."); //promise rejected with error message
            }
        }, 4200); //Simulate 4.2s delay
    });
    //Call the Promise and handle results
    getBooksByTitle
        .then((matchedBooks) => res.status(200).json(matchedBooks))
        .catch((errMessage) => res.status(404).json({ message: errMessage }));
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

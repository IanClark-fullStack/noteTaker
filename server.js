const express = require('express');
const path = require('path');
const fs = require('fs');
// Required External Paths
const notes = require('./db/db.json');
const uuid = require('./helpers/uuid');
// New instance of express 
const app = express();
const PORT = process.env.PORT || 3001;
// Middleware -----------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
// Get Static Files -----------------------------------
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, './public/index.html'))
);
// Get Notes html -----------------------------------
app.get('/notes', (req, res) => {
    // Send a message to the client
    // res.status(200).json(`${req.method} request received to get reviews`);
    // The response serves up the data from the Database to the directory currently being viewed 
    res.sendFile(path.join(__dirname, './public/notes.html'))  
    // Log our request to the terminal
});
// Get Notes Database -----------------------------------
app.get('/api/notes', (req, res) => {
    // The response serves up the data from the Database to the directory currently being viewed 
    res.sendFile(path.join(__dirname, './db/db.json'))  
    // Log our request to the terminal
    console.info(`${req.method} request received to get reviews`);
});
// POST Request to Add a Note -----------------------------------
app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a review`);
    // Take the result of FS Read File Sync, and Parse into a JSON Object 
    const notes = JSON.parse(fs.readFileSync('./db/db.json'));
    // Destructured Object to Save Variables from the request Body 
    const newNotes = req.body; 
    newNotes.id = uuid();
    // Push the object obtained from the request into the Database Array
    notes.push(newNotes);
    // Stringify the Completed Array, with no replacer and appropriate spacing, write the file again 
    fs.writeFileSync('./db/db.json', JSON.stringify(notes, null, 4));
    res.json(notes);
});
// Delete Functionality -----------------------------------
app.delete(`/api/notes/:id`, (req, res) => {
     // Take the result of FS Read File Sync, and Parse into a JSON Object 
     const notes = JSON.parse(fs.readFileSync('./db/db.json'));
    // Return an array of elements that do not match request id to be removed. 
     const noteToRemove = notes.filter((el) => el.id !== req.params.id);
     // Re write the Database, 
     fs.writeFileSync('./db/db.json', JSON.stringify(noteToRemove));
     res.json(noteToRemove);  
})
// Listen Here -----------------------------------
app.listen(PORT, () => console.log(`Listening at http://${PORT}`));
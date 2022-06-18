//brings in all the dependences
const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");
const {
    v4: uuidv4
} = require('uuid');

//creates server object with express
const app = express();

//creates port and allows it to communicate with heroku
const PORT = process.env.PORT || 3001;

//utilizes express to parse through data
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

//sets the public folder to static and allows users to view files
app.use(express.static("public"));

//sends the index.html file to user as welcome page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"))
})

//sends the notes.html file to user to interact with page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"))
})

//sends the database json to user to view all the notes in json form
app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "/db/db.json"))
})

//takes user req posts to apo/notes
app.post('/api/notes', (req, res) => {
    //assigns the body of req (title and note) to userNote
    const userNote = req.body;
    //gives userNote and randomly generated id
    userNote.id = uuidv4();
    //reads the db.json file
    fs.readFile("./db/db.json", "utf8", (err, data) => {
        //if there is an error, console.error it
        if (err) {
            console.error(err);
        } else {
            //stores the parsed data from db.json into parsedNotes
            const parsedNotes = JSON.parse(data);
            //pushes the user's note into the parsedNotes array
            parsedNotes.push(userNote);
            //overwrites the db.json file with new stringified array of notes (parsedNotes)
            fs.writeFile('./db/db.json',
                JSON.stringify(parsedNotes), (secondErr) => {
                    if (secondErr) {
                        console.error(secondErr)
                    } else {
                        console.info('Succesfully updated note')
                    }
                }

            )
        }
        res.status(500).json('Updated notes')
    })
});

//deletes selected saved note
app.delete('/api/notes/:id', (req, res) => {
    //reads db.json file
    fs.readFile("./db/db.json", "utf8", (err, data) => {
        //stores parsed data from db.json into deleteData
        let deleteData = JSON.parse(data);
        //filters through each of the data inside the parsed data and returns everything that does not match the id of selected note and stores it into newData
        const newData = deleteData.filter(datum => datum.id != req.params.id);
        if (err) {
            console.error(err);
        } else {
            //writes new db.json using the newData array which has deleted the specific id
            fs.writeFile('./db/db.json',
                JSON.stringify(newData), (deleteErr) => {
                    if (deleteErr) {
                        console.error(deleteErr)
                    } else {
                        console.info('Succesfully deleted note')
                    }
                }
            )
        }
        res.status(500).json("Updated Notes")
    })
});

//catches all url that is not specificied above and returns them to main page
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"))
})


app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`))
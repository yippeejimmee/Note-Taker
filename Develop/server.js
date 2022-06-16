const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");
const {
    v4: uuidv4
} = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(express.static("public"));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"))
})

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"))
})

app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "/db/db.json"))
})

app.post('/api/notes', (req, res) => {
    const userNote = req.body;
    userNote.id = uuidv4();
    fs.readFile("./db/db.json", "utf8", (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const parsedNotes = JSON.parse(data);
            console.log(data);
            parsedNotes.push(userNote);
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

app.delete('/api/notes/:id', (req, res) => {
    fs.readFile("./db/db.json", "utf8", (err, data) => {
        let deleteData = JSON.parse(data);
        console.log("data to delete", deleteData);
        const newData = deleteData.filter(datum => datum.id != req.params.id);
        if (err) {
            console.error(err);
        } else {


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

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"))
})


app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`))
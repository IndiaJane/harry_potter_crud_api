const sqlite3 = require('sqlite3').verbose()
const express = require('express')
const http = require('http')
const dbutils = require('./dbUtils')

const app = express()
app.use(express.json())
const server = http.createServer(app)
const db = new sqlite3.Database("./db/harrypotter.db");

//Anytime you create an API you're most likely going to be using Express.

// Root Index, Your Home Page
app.get('/', function(req,res){
    res.send(`<h3> Hi there, You are going to perform CRUD operations.............
    [CREATE] Please enter 'http://localhost:3000/create/houses' to add new houses to the database.........................
    [READ] 'http://localhost:3000/view/(id number)' to view houses.........................
    [UPDATE] 'http://localhost:3000/update/(id number)/(new name)' to update a house.....................
    [DELETE] 'http://localhost:3000/del/(id number)' to delete a character..............................
    .Before closing this window, kindly enter 'http://localhost:3000/close' to close the database connection <h3/>`)
});

// Adding our first create POST
// House Table (We'll create a fake house to assign students to)
app.post('/create/houses', function(req, res){
    const { name, description} = req.body
    // {
    //     "name": "Name",
    //     "description": ""
    // }
    if(!name || !description){
        return res.status(400).send("All Fields are Required.")
    }

    dbutils.modifyData(
        db, 
        "INSERT INTO Houses (name, description) Values (?, ?)",
        [name, description],
        "INSERT"
    ).then(() => {
        console.log("New house has been added");
        res.send("New house has been added into the database with Name = " + name + " and Description = " + description);
    }).catch((err) => {
        console.error("Error adding a new house:", err);
        res.status(500).send("Error adding a new house: " + err.message);
    });
})

//Creating Characters

app.post('/create/characters', function(req, res){
    const {name, gender, bloodstatus, species, house_id, affiliation_id, wand, description} = req.body

    // {
    //     "name": "name",
    //     "gender": "",
    //     "bloodstatus": "",
    //     "species": "",
    //     "house_id": "",
    //     "affiliation_id": "",
    //     "wand": "",
    //     "description": ""
    // }
        
    if(!name || !gender|| !bloodstatus || !species || !house_id || !affiliation_id || !wand ||!description){
        return res.status(400).send("All Fields are Required.")
    }
    dbutils.modifyData(
        db, 
        `INSERT INTO Characters 
        (name, gender, bloodstatus, species, house_id, 
        affiliation_id, wand, description) Values (?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, gender, bloodstatus, species, house_id, affiliation_id, wand, description],
        "INSERT"
    ).then(() => {
        console.log("New Characters has been added");
        res.send("New Characters has been added into the database with Name = " + name + " and Description = " + description);
    }).catch((err) => {
        console.error("Error adding a new Characters:", err);
        res.status(500).send("Error adding a new Characters: " + err.message);
    });
})

//Creating Affiliation

app.post('/create/affiliation', function(req, res){
    const {id, name} = req.body

    // {
    //     "id": "",
    //     "name": "name"
    // }


    if(!id || !name){
        return res.status(400).send("All Fields are Required.")
    }

    dbutils.modifyData(
        db, 
        `INSERT INTO Affiliation (id, name) Values (?, ?)`,
        [id, name],
        "INSERT"
    ).then(() => {
        console.log("New Affiliation has been added");
        res.send("New Affiliation has been added into the database with Id = " + id + " and Name = " + name);
    }).catch((err) => {
        console.error("Error adding a new Characters:", err);
        res.status(500).send("Error adding a new Characters: " + err.message);
    });
})

//Creating Creatures

app.post('/create/creatures', function(req, res){
    const {id, name, species, affiliation_id, classification, status} = req.body

    // {
    //     "id": "id",
    //     "name": "name",
    //     "species":"",
    //     "affiliation_id": "",
    //     "classification": "",
    //     "status": ""
    // }

    if(!id || !name || !species || !affiliation_id || !classification || !status){
        return res.status(400).send("All Fields are Required.")
    }

    dbutils.modifyData(
        db, 
        `INSERT INTO Creatures (id, name, species, affiliation_id, classification, status) Values (?, ?, ?, ?, ?, ?)`,
        [id, name, species, affiliation_id, classification, status],
        "INSERT"
    ).then(() => {
        console.log("New Creatures has been added");
        res.send("New Affiliation has been added into the database with Name = " + name + " and Species = " + species);
    }).catch((err) => {
        console.error("Error adding a new Creatures:", err);
        res.status(500).send("Error adding a new Creatures: " + err.message);
    });
})

//Reading the house data from database using GET
app.get('/view/houses/:id', function(req,res){

    let query = `SELECT * from houses where id = ${req.params.id}`
    if (req.params.id === "all") {
        query = `SELECT * from houses`
    }

    dbutils.selectData(db, query)
        .then((results) => {
            res.json(results);
        }).catch((err) => {
            console.error('Error Executing Query: ' + err.message);
            res.status(500).send("Error retrieving house data.");
        })
})

//Reading the characters data from database using GET

app.get('/view/characters/:id', function(req,res){

    let query = `SELECT * from characters where id = ${req.params.id}`
    if (req.params.id === "all") {
        query = `SELECT * from characters`
    }

    dbutils.selectData(db, query)
        .then((results) => {
            res.json(results);
        }).catch((err) => {
            console.error('Error Executing Query: ' + err.message);
            res.status(500).send("Error retrieving house data.");
        })
})

//Reading the affiliations data from database using GET
app.get('/view/affiliation/:id', function(req,res){

    let query = `SELECT * from affiliation where id = ${req.params.id}`
    if (req.params.id === "all") {
        query = `SELECT * from affiliation`
    }

    dbutils.selectData(db, query)
        .then((results) => {
            res.json(results);
        }).catch((err) => {
            console.error('Error Executing Query: ' + err.message);
            res.status(500).send("Error retrieving house data.");
        })
})

//Reading the creatures data from database using GET
app.get('/view/creatures/:id', function(req,res){

    let query = `SELECT * from creatures where id = ${req.params.id}`
    if (req.params.id === "all") {
        query = `SELECT * from creatures`
    }

    dbutils.selectData(db, query)
        .then((results) => {
            res.json(results);
        }).catch((err) => {
            console.error('Error Executing Query: ' + err.message);
            res.status(500).send("Error retrieving house data.");
        })
})


//DELETING the houses data from database using DELETE
app.delete('/del/houses/:id', function(req,res){
    dbutils.modifyData(
        db,
        `DELETE FROM houses WHERE id = ?`,
        [req.params.id],
        "DELETE"
    )
    .then((results) => {
        // res.json(results);
        res.send(`${req.params.id} successfully removed from database.`)
    }).catch((err) => {
        console.error('Error Executing Query: ' + err.message);
        res.status(500).send("Error deleting house data.");
    })
})

//
//DELETING the characters data from database using DELETE
app.delete('/del/characters/:id', function(req,res){
    dbutils.modifyData(
        db,
        `DELETE FROM characters WHERE id = ?`,
        [req.params.id],
        "DELETE"
    )
    .then((results) => {
        // res.json(results);
        res.send(`${req.params.id} successfully removed from database.`)
    }).catch((err) => {
        console.error('Error Executing Query: ' + err.message);
        res.status(500).send("Error deleting house data.");
    })
})

//DELETING the affiliation data from database using DELETE
app.delete('/del/affiliation/:id', function(req,res){
    dbutils.modifyData(
        db,
        `DELETE FROM affiliation WHERE id = ?`,
        [req.params.id],
        "DELETE"
    )
    .then((results) => {
        // res.json(results);
        res.send(`${req.params.id} successfully removed from database.`)
    }).catch((err) => {
        console.error('Error Executing Query: ' + err.message);
        res.status(500).send("Error deleting house data.");
    })
})

//DELETING the creatures data from database using DELETE
app.delete('/del/creatures/:id', function(req,res){
    dbutils.modifyData(
        db,
        `DELETE FROM creatures WHERE id = ?`,
        [req.params.id],
        "DELETE"
    )
    .then((results) => {
        // res.json(results);
        res.send(`${req.params.id} successfully removed from database.`)
    }).catch((err) => {
        console.error('Error Executing Query: ' + err.message);
        res.status(500).send("Error deleting house data.");
    })
})
server.listen(3000, function(){
    console.log("Server listening on port: 3000")
})


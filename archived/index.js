const sqlite3 = require('sqlite3').verbose()
const express = require('express')
const http = require('http')
const dbutils = require('../dbUtils')

const app = express()
const server = http.createServer(app)
const db = new sqlite3.Database("./db/harrypotter.db");

//Anytime you create an API you're going to be using Express.

// Root Index, Your Home Page
app.get('/', function(req,res){
    res.send(`<h3> Hi there, You are going to perform CRUD operations.............
    [CREATE] Please enter 'http://localhost:3000/add/(id number)/(name)' to add new employee to the database.........................
    [READ] 'http://localhost:3000/view/(id number)' to view an employee.........................
    [UPDATE] 'http://localhost:3000/update/(id number)/(new name)' to update an employee.....................
    [DELETE] 'http://localhost:3000/del/(id number)' to delete an employee..............................
    .Before closing this window, kindly enter 'http://localhost:3000/close' to close the database connection <h3/>`)
});

// Adding our first create
// House Table (We'll create a fake house to assign students to)
app.get('/create/houses/:name/:description', function(req, res){
    dbutils.insertData(
        db, 
        "INSERT INTO Houses (name, description) Values (?, ?)",
        [req.params.name, req.params.description]
    ).then(() => {
        console.log("New house has been added");
        res.send("New house has been added into the database with Name = " + req.params.name + " and Description = " + req.params.description);
    }).catch((err) => {
        console.error("Error adding a new house:", err);
        res.status(500).send("Error adding a new house: " + err.message);
    });
})

//Creating Characters

app.get('/create/characters/:name/:gender/:bloodstatus/:species/:house_id/:affiliation_id/:wand/:description', function(req, res){
    dbutils.insertData(
        db, 
        `INSERT INTO Characters 
        (name, gender, bloodstatus, species, house_id, 
        affiliation_id, wand, description) Values (?, ?, ?, ?, ?, ?, ?, ?)`,
        [req.params.name, req.params.gender, req.params.bloodstatus, req.params.species, 
        req.params.house_id, req.params.affiliation_id, req.params.wand, req.params.description]
    ).then(() => {
        console.log("New Characters has been added");
        res.send("New Characters has been added into the database with Name = " + req.params.name + " and Description = " + req.params.description);
    }).catch((err) => {
        console.error("Error adding a new Characters:", err);
        res.status(500).send("Error adding a new Characters: " + err.message);
    });
})

//Creating Affiliation

app.get('/create/affiliation/:id/:name', function(req, res){
    dbutils.insertData(
        db, 
        `INSERT INTO Affiliation (id, name) Values (?, ?)`,
        [req.params.id, req.params.name]
    ).then(() => {
        console.log("New Affiliation has been added");
        res.send("New Affiliation has been added into the database with Id = " + req.params.id + " and Name = " + req.params.name);
    }).catch((err) => {
        console.error("Error adding a new Characters:", err);
        res.status(500).send("Error adding a new Characters: " + err.message);
    });
})

//Creating Creatures

app.get('/create/creatures/:name/:species', function(req, res){
    dbutils.insertData(
        db, 
        `INSERT INTO Creatures (id, name, species, affiliation_id, classification, status) Values (?, ?, ?, ?, ?, ?)`,
        [req.params.id, req.params.name, req.params.species, req.params.affiliation_id, req.params.classification, req.params.status]
    ).then(() => {
        console.log("New Creatures has been added");
        res.send("New Affiliation has been added into the database with Name = " + req.params.name + " and Species = " + req.params.species);
    }).catch((err) => {
        console.error("Error adding a new Creatures:", err);
        res.status(500).send("Error adding a new Creatures: " + err.message);
    });
})

//

server.listen(3000, function(){
    console.log("Server listening on port: 3000")
})


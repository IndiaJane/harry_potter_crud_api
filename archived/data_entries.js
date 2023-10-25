const dbutils = require('../dbUtils');
const fs = require("fs");
const { parse } = require("csv-parse");
//https://www.digitalocean.com/community/tutorials/how-to-read-and-write-csv-files-in-node-js-using-node-csv

const dbFile = './db/harrypotter.db'

async function main(){
    // Read in our CSV Files

    // Create a Database Connection\
    try {
        const db = await dbutils.connectToDatabase(dbFile)  
        // Create Affilation Table
        // Add Affilation Data from CSV
        await dbutils.dropTableIfExists(db, 'Affiliation')
        await dbutils.createTableIfNotExists(db, 'Affiliation', 
        `id INTEGER PRIMARY KEY, 
        Name TEXT NOT NULL UNIQUE`)

        fs.createReadStream("./csv/hp_affiliations.csv")
        .pipe(parse({ delimiter: ",", from_line: 2 }))
        .on("data", function (row) {
            dbutils.insertData(db, "INSERT INTO Affiliation (id, name) Values (?, ?)", row)
            //console.log(row);
        })
        .on("end", async function () {
            console.log("finished");

            const affData = await dbutils.selectData(db,"SELECT * FROM Affiliation");
            console.log(affData);
        })
        .on("error", async function (error) {
            console.log(error.message);
        });

        // Create Characters Table
        // Add Character Data from CSV

        await dbutils.dropTableIfExists(db, 'Characters')
        await dbutils.createTableIfNotExists(db, 'Characters', 
        `id INTEGER PRIMARY KEY,  
        Name TEXT NOT NULL UNIQUE, 
        Gender TEXT, 
        BloodStatus TEXT, 
        Species TEXT, 
        House_id TEXT,
        Affiliation_id INTEGER,
        Wand TEXT,
        Description TEXT,
        FOREIGN KEY(Affiliation_id) REFERENCES Affiliation(id)
        FOREIGN KEY(House_id) REFERENCES House(id)`)

        fs.createReadStream("./csv/hp_characters.csv")
        .pipe(parse({ delimiter: ",", from_line: 2 }))
        .on("data", function (row) {
            console.log(row);
            dbutils.insertData(db, `INSERT INTO Characters 
            (name, gender, bloodstatus, species, house_id, 
            affiliation_id, wand, description) Values (?, ?, ?, ?, ?, ?, ?, ?)`, row)
        })
        .on("end", async function () {
            console.log("finished");

            const affData = await dbutils.selectData(db,"SELECT * FROM Characters");
            console.log(affData);
            
        })
        .on("error", async function (error) {
            console.log(error.message);
        });
        
        // Create Creatures Table
        // Add Creature Data from CSV
        await dbutils.dropTableIfExists(db, 'Creatures')
        await dbutils.createTableIfNotExists(db, 'Creatures', 
        `id INTEGER PRIMARY KEY,
        Name TEXT NOT NULL,
        Species TEXT,
        Affiliation_id INTEGER,
        Classification TEXT,
        Status TEXT,
        FOREIGN KEY(Affiliation_id) REFERENCES Affiliation(id)`)

        fs.createReadStream("./csv/hp_creatures.csv")
        .pipe(parse({ delimiter: ",", from_line: 2 }))
        .on("data", function (row) {
            dbutils.insertData(db, `INSERT INTO Creatures 
            (id, name, species, affiliation_id, classification, status) 
            Values (?, ?, ?, ?, ?, ?)`, row)
            //console.log(row);
        })
        .on("end", async function () {
            console.log("finished");

            const affData = await dbutils.selectData(db,"SELECT * FROM Creatures");
            console.log(affData);
        })
        .on("error", async function (error) {
            console.log(error.message);
        });

        // Create Houses Table
        // Add Houses Data from CSV
        await dbutils.dropTableIfExists(db, 'houses')
        await dbutils.createTableIfNotExists(db, 'houses', 
        ` id INTEGER PRIMARY KEY,
        Name TEXT NOT NULL,
        Description TEXT`)

        fs.createReadStream("./csv/hp_houses.csv")
        .pipe(parse({ delimiter: ",", from_line: 2 }))
        .on("data", function (row) {
            dbutils.insertData(db, `INSERT INTO Houses 
            (name, description) Values (?, ?)`, row)
            //console.log(row);
        })
        .on("end", async function () {
            console.log("finished");

            const affData = await dbutils.selectData(db,"SELECT * FROM Houses");
            console.log(affData);

            
            // Close Database Connection
            await dbutils.closeDatabaseConnection(db);
        })
        .on("error", async function (error) {
            console.log(error.message);
        });

        //
        
    } catch(err) {
        console.error(err.message)
    }
}

main()
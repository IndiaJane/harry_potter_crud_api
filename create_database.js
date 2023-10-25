const dbutils = require('./dbUtils');
const fs = require("fs");
const { parse } = require("csv-parse");
// https://www.digitalocean.com/community/tutorials/how-to-read-and-write-csv-files-in-node-js-using-node-csv

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

        await readCSVandInsertData(
            db,
            "./csv/hp_affiliations.csv",
            "INSERT INTO Affiliation (id, name) Values (?, ?)"
        );

        const affData = await dbutils.selectData(db, "SELECT * FROM Affiliation");
        console.log(affData);

        // Create Characters Table
        // Add Character Data from CSV

        // Waits till table is dropped
        await dbutils.dropTableIfExists(db, 'Characters')
        
        // Waits till table is created
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

        // Waits to read in the CSV file and Populate the table
        // with data from CSV file. Notice Query has header record
        // and then the ? to fill in the data from the row
        await readCSVandInsertData(
            db,
            "./csv/hp_characters.csv",
            `INSERT INTO Characters 
            (name, gender, bloodstatus, species, house_id, 
            affiliation_id, wand, description) Values (?, ?, ?, ?, ?, ?, ?, ?)`
        );

        // We call "selectData" to query the database and return all records
        const charData = await dbutils.selectData(
            db,
            "SELECT * FROM Characters"
        );

        // We print to verify the data
        console.log(charData);
        
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

        await readCSVandInsertData(
            db,
            "./csv/hp_creatures.csv",
            `INSERT INTO Creatures 
            (id, name, species, affiliation_id, classification, status) 
            Values (?, ?, ?, ?, ?, ?)`
        );

        const creaturesData = await dbutils.selectData(db, "SELECT * FROM Creatures");
        console.log(creaturesData);

        // Create Houses Table
        // Add Houses Data from CSV
        await dbutils.dropTableIfExists(db, 'houses')
        await dbutils.createTableIfNotExists(db, 'houses', 
        ` id INTEGER PRIMARY KEY,
        Name TEXT NOT NULL,
        Description TEXT`)

        await readCSVandInsertData(
            db,
            "./csv/hp_houses.csv",
            `INSERT INTO Houses (name, description) Values (?, ?)`
        );

        const housesData = await dbutils.selectData(db, "SELECT * FROM Houses");
        console.log(housesData);
        
    } catch(err) {
        console.error(err.message)
    }
}


// Create a promise that'll wait for the process of reading in a file
// then inserting the data into our database is completed before we move on
// our resolve is empty since we don't need to do anything with the data, but should
// the file fail to read or the database fail to insert a record, the promise returns
// an error within the reject() statement

// db is the database connection
// inputCSV is the path to your CSV file
// insertQuery is the Query you want to use to insert the row from the inputCSV
async function readCSVandInsertData(db, inputCSV, insertQuery){
    return new Promise((resolve, reject) => {
        // Read in the file using the path provided in the "inputCSV" argument
        fs.createReadStream(inputCSV)
            // .pipe will do row by row and feed it into parse
            // where parse will split the record by comma to create
            // an object, starting at row 2. This avoids the header record if we have one
            .pipe(parse({ delimiter: ",", from_line: 2 }))
            .on("data", function (row) {
                // as the data is being read, for each row (that's why we have a row argument)
                // we will take that row of data, and inject it into our insertQuery.
                // This will insert the record into your database
                dbutils.modifyData(db, insertQuery, row, "insert");
                //console.log(row);
            })
            .on("end", async function () {
                // This prints when the file has completed reading.
                console.log("finished");
                resolve();
            })
            .on("error", async function (error) {
                // This only prints should there be a problem reading the records
                // from the file
                console.log(error.message);
                reject(error);
            });
    })
}

main()
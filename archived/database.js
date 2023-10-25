// Library imported from NPM
const sqlite3 = require('sqlite3').verbose();

// Creates the connection to the database file
// Saving to a variable so we can use throughout the program

let db = new sqlite3.Database('./db/starwars.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the starwars database.');
});

// db.serialize() opens the connection
db.serialize(() => {
    // Will execute the query in "each" against the open connection
    db.each(
        `CREATE TABLE IF NOT EXISTS Affiliation (
        id INTEGER PRIMARY KEY,
        Name TEXT NOT NULL UNIQUE
    )`, (err, row) => {
            if (err) {
                console.error(err.message);
            }
            console.log("Stuff done in database");
        }
    );
});

db.close((err) => {
    if (err) {
        console.error(err.message);
    }
    console.log("Close the database connection.");
});
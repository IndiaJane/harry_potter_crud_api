// Library downloaded from NPM to handle sqlite3 connections
const sqlite3 = require("sqlite3").verbose();

// This function helps us connect to the database.
async function connectToDatabase(path) {
return new Promise((resolve, reject) => {
    // We open the database file here.
    const db = new sqlite3.Database(path, (err) => {
    if (err) {
        // If something goes wrong, we'll say "Oops!"
        reject(err);
    } else {
        // If everything's good, we say "We're connected!"
        console.log("Connected to Database.");
        // We also give you the database object.
        resolve(db);
    }
    });
});
}

// This function helps us create a table in the database.
async function createTableIfNotExists(db, tableName, tableSchema) {
return new Promise((resolve, reject) => {
    // We write down what the table should look like.
    const createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (${tableSchema})`;
    // Then, we run this command to create the table.
    db.run(createTableQuery, (err) => {
    if (err) {
        // If something goes wrong, we'll say "Oops!"
        reject(err);
    } else {
        // If the table is created successfully, we say "Table is ready!"
        resolve();
    }
    });
});
}

// This function helps us delete a table from the database.
async function dropTableIfExists(db, tableName) {
return new Promise((resolve, reject) => {
    // We write down the name of the table to delete.
    const dropTableQuery = `DROP TABLE IF EXISTS ${tableName}`;
    // Then, we run this command to delete the table.
    db.run(dropTableQuery, (err) => {
    if (err) {
        // If something goes wrong, we'll say "Oops!"
        reject(err);
    } else {
        // If the table is deleted successfully, we say "Table is gone!"
        resolve();
    }
    });
});
}

// This function helps us add data to a table in the database.
async function modifyData(db, query, data, operation) {
return new Promise((resolve, reject) => {
    //console.log(`Executing query: ${query}`);
    //console.log(`Data to insert: ${data}`);
    // Then, we run this command to add the data.
    db.run(query, data, (err) => {
    if (err) {
        // If something goes wrong, we'll say "Oops!"
        reject(err);
    } else {
        // If the data is added successfully, we say "Data is in!"
        console.log(`${operation} successful: ${data}`)
        resolve();
    }
    });
});
}

// This function helps us get data from a table in the database.
async function selectData(db, query) {
return new Promise((resolve, reject) => {
    // We ask for data from the table using a question.
    db.all(query, [], (err, rows) => {
    if (err) {
        // If something goes wrong, we'll say "Oops!"
        reject(err);
    } else {
        // If we get the data successfully, we give it to you.
        resolve(rows);
    }
    });
});
}

// This function helps us close the connection to the database.
async function closeDatabaseConnection(db) {
return new Promise((resolve, reject) => {
    // We say goodbye to the database here.
    db.close((err) => {
    if (err) {
        // If something goes wrong, we'll say "Oops!"
        reject(err);
        
    } else {
        // If the connection is closed successfully, we say "Goodbye!"
        console.log("Closed the database connection.");
        // You're all done!
        resolve();
    }
    });
});
}

module.exports = {
connectToDatabase,
createTableIfNotExists,
dropTableIfExists,
modifyData: modifyData,
selectData,
closeDatabaseConnection,
};

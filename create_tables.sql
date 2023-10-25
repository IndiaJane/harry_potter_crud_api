--House
--Affiliation
--Characters: Name (UNIQUE),Gender,BloodStatus,Species,House,Affiliation,Wand,Description
--Creatures: Name,Species,Affiliation,Classification,Status

CREATE TABLE IF NOT EXISTS Affiliation (
    id INTEGER PRIMARY KEY,
    Name TEXT NOT NULL UNIQUE
)

CREATE TABLE IF NOT EXISTS Characters (
    id INTEGER PRIMARY KEY,
    Name TEXT NOT NULL UNIQUE,
    Gender TEXT,
    BloodStatus TEXT,
    Species TEXT,
    House_id TEXT,
    Affiliation_id INTEGER,
    Wand TEXT,
    Description TEXT,
    FOREIGN KEY(Affiliation_id) REFERENCES Affiliation(id)
    FOREIGN KEY(House_id) REFERENCES House(id)
)

CREATE TABLE IF NOT EXISTS Creatures (
    id INTEGER PRIMARY KEY,
    Name TEXT NOT NULL,
    Species TEXT,
    Affiliation_id INTEGER,
    Classification TEXT,
    Status TEXT,
    FOREIGN KEY(Affiliation_id) REFERENCES Affiliation(id)
)

CREATE TABLE IF NOT EXISTS House (
    id INTEGER PRIMARY KEY,
    Name TEXT NOT NULL,
    Description TEXT
)
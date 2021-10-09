var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('data.db');

db.run("CREATE TABLE IF NOT EXISTS events (title TEXT, description TEXT, day INTEGER, month INTEGER, year INTEGER, hour INTEGER, minute INTEGER)");

async function each_sync(query, params, action) {
    return new Promise(function(resolve, reject) {
        db.serialize(function() {
            db.each(query, params, function(err, row)  {
                if(err) reject("Read error: " + err.message)
                else {
                    if(row) {
                        action(row)
                    }    
                }
            })
            db.get("", function(err, row)  {
                resolve(true)
            })            
        })
    }) 
}

async function getEntries() {
    const entries = [];
    await each_sync("SELECT rowid AS id, title, description, day, month, year, hour, minute FROM events", [], function(row) {
        //console.log(row.id + ": " + row.title);
        entries.push(row);
    });
    //console.log(entries);
    return entries;
}

function createEntry(title, desc, dt) {
    db.run(`INSERT INTO events VALUES (\'${title}\', \'${desc}\', ${dt[0]}, ${dt[1]}, ${dt[2]}, ${dt[3]}, ${dt[4]})`);
}

function deleteEntry(index) {
    db.run(`DELETE FROM events WHERE rowid = ${index}`);
}

function closeDB() {
    db.close();
}

module.exports = {getEntries, createEntry, deleteEntry, closeDB};
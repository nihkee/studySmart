const sqlite3 = require("sqlite3").verbose()
let db = new sqlite3.Database("email_queue.db", (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log("Connected to SQLite database");
    // db.run(`
    //     CREATE TABLE emails (
    //         email TEXT NOT NULL,
    //         timestamp TEXT NOT NULL
    //     );
    // `, (err) => {
    //     if (err) {
    //         console.error(err.message);
    //     }
    // });
    // db.close();

    // db.run(`
    //     INSERT INTO emails (
    //         email,
    //         timestamp
    //     )
    //     VALUES 
    //         ("vinhkhl1@umbc.edu", "2023-11-30 12:00:00.000"),
    //         ("nikki@umbc.edu", "2023-12-01 05:30:00.000")
    //     ;
    // `, (err) => {
    //     if (err) {
    //         console.error(err.message);
    //     }
    // })
    // db.close();

    // db.run(`
    //     DELETE FROM emails;
    // `)

    // db.each(`
    //     SELECT *
    //     FROM emails
    //     WHERE timestamp < Datetime('now', '-30 minutes');
    // `, (err, row) => {
    //     if (err) {
    //         console.error(err.message);
    //     }
    //     console.log(`${row.email} : ${row.timestamp}`)
    // })
});


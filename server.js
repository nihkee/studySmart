const express = require("express")
const bodyParser = require("body-parser")
const mongodb = require("mongodb")
const cors = require("cors")
const sqlite3 = require("sqlite3").verbose()
const cron = require("node-cron")
const fs = require("fs")
const nodemailer = require("nodemailer")

const app = express();
const db = new sqlite3.Database("email_queue.db", (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log("Connected to SQLite database");
});

const emailCredentials = JSON.parse(fs.readFileSync("email_credentials.json", "utf8"))
const transporter = nodemailer.createTransport({

    service: emailCredentials["service"],
    auth: {
        user: emailCredentials["user"],
        pass: emailCredentials["pass"]
    }
})

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());
app.use(cors())

app.get("/home", (request, response) => {
    response.json({
        a:"test response"
    })
})

// process preference data from request
// respond with recommendation
app.post("/preferences", (request, response) => {
    try {
        var noise = parseInt(request.body["noise"], 10);
        var preferenceResponse = "";
        if (noise < 250) {
            preferenceResponse = "You should go to the library!";
        }
        else {
            preferenceResponse = "You should go to the commons!"
        }
        console.log(preferenceResponse);
        response.json({
            res:preferenceResponse
            // res: `lighting is ${request.body["lighting"]}, noise is ${request.body["noise"]}, and temperature is ${request.body["temperature"]}}`
        })
    }
    catch (error) {
        console.log(error)
        response.json({
            a:"bad response"
        })
    }
})

// check and send emails every minute
cron.schedule('* * * * *', () => {
    console.log("Emails from last 30 minutes (for testing, will be after 30 minutes)")
    db.each(`
        SELECT *
        FROM emails
        WHERE timestamp >= Datetime('now', '-30 minutes');
    `, (err, row) => {
        if (err) {
            console.error(err.message);
        }
        console.log(`${row.email} : ${row.timestamp}`)

        transporter.sendMail({
            from: emailCredentials["user"],
            to: row.email,
            subject: 'Test Feedback Form :)',
            html: <div><iframe src="https://docs.google.com/forms/d/e/1FAIpQLSfkuui2Cz8SSbOsvCJze_6geomSEKKqL23Qyfhj6l6jHg7_FA/viewform?embedded=true" width="640" height="412" frameborder="0" marginheight="0" marginwidth="0"></iframe></div>
        }, (error, info) => {
            if (error) {
                console.error(error.message);
            }
            console.log(`Message sent: ${info.messageId}`)
        })

        db.run(`DELETE FROM emails WHERE email = '${row.email}'`)
    })
})

const insertEmail = async(email, currDatetime) => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT email FROM emails WHERE email = '${email}'`, [], (err, rows1) => {
            if (err) {
                reject(err);
            }
            else if (rows1.length > 0) {
                reject(new Error(`${email} already exists`))
            }
            else {
                db.run(`
                    INSERT INTO emails (
                        email,
                        timestamp
                    )
                    VALUES ("${email}", "${currDatetime}");`, (err) => {
                    if (err) {
                        reject(err);
                    }
                    console.log(`${email} added to queue`)
                    resolve({res:`${email} added to queue`});
                })
            }
        })
    })
}

//process user's email
app.post("/emails", async (request, response) => {
    var email = request.body["email"];
    var currDatetime = new Date().toISOString();

    try {
        const result = await insertEmail(email, currDatetime);
        response.json(result);
    }
    catch(error) {
        console.error(error.message);
        response.json({res:error.message})
    }
})

// app.put("/")
// app.delete("/")

app.listen(8000, () => console.log("Server up!"))
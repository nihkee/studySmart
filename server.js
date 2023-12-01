const express = require("express")
const bodyParser = require("body-parser")
const mongodb = require("mongodb")
const cors = require("cors")
const sqlite3 = require("sqlite3").verbose()

const app = express();
let db = new sqlite3.Database("email_queue.db", (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log("Connected to SQLite database");
});

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

//process user's email
app.post("/emails", (request, response) => {
    try {
        var email = request.body["email"];
        console.log(email);
        response.json({
            res:`email ${email} received`
        })
    }
    catch (error) {
        console.log(error)
        response.json({
            a:"poopoo response"
        })
    }
})

// app.put("/")
// app.delete("/")

app.listen(8000, () => console.log("Server up!"))
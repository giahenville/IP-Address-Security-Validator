import express from "express";
import axios from "axios";
import bodyParser from "body-parser";


const app = express();
const port = 3000;
const API_URL = "https://api.ipapi.is";
// Middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

// Initial load-in
app.get("/", (req, res) => {
    res.render("index.ejs");
});

// Process form data and make request to API
app.post("/submit", async (req, res) => {
    console.log(req.body.ipAddress);
    const address = req.body.ipAddress;
    try {
        // use user passed in ip address to get data from api
        console.log("entered try block")
        const result = await axios.get(API_URL + "?q=", address);
        console.log(result);
        res.render("index.ejs", { data: JSON.stringify(result.data.company), asn: JSON.stringify(result.asn), abuse: JSON.stringify(result.abuse), location: JSON.stringify(result.location) });
    }catch (error) {
        res.render("index.ejs", { error: JSON.stringify(error.response) });
    }
});

// Host on server
app.listen(port, () => {
    console.log("Security Info Api running on port ", port);
});
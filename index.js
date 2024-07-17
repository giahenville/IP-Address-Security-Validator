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

// Handles api request and sends data to info.ejs file to be displayed to user
app.post("/submit", async (req, res) => {
   
    const address = req.body.ipAddress;

    try {
        // use user passed in ip address to get data from api  
        const response = await axios.get(`${API_URL}?q=${address}`);

        // data to be sent to info.ejs
        const companyName = JSON.stringify(response.data.company.name);
        const country = JSON.stringify(response.data.location.country);
        const state = JSON.stringify(response.data.location.state); // some ip may not have states make sure to account for this check if state !== to "NA" in info.ejs file before rendering 
        const city = JSON.stringify(response.data.location.city); 
        const type = JSON.stringify(response.data.asn.type);
        const isAbuser = JSON.stringify(response.data.is_abuser);
        const isCrawler = JSON.stringify(response.data.is_crawler);
        const email = JSON.stringify(response.data.abuse.email);
      
        res.render("info.ejs", { companyName, country, state, city, type, isAbuser, isCrawler, email});
    
    }catch (error) {
        // sends api error or default error
        res.render("info.ejs", { error: error.message || "An error occurred" });
    }
});

// Host server
app.listen(port, () => {
    console.log("Security Info Api running on port ", port);
});
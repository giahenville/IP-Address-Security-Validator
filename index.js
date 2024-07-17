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


// const dummyObj = {
//     ip: '104.16.143.237',
//     rir: 'ARIN',
//     is_bogon: false,
//     is_mobile: false,
//     is_crawler: false,
//     company: {
//       name: 'Cloudflare, Inc.',
//       abuser_score: '0.0027 (Low)',
//       domain: 'cloudflare.com',
//       type: 'hosting',
//       network: '104.16.0.0 - 104.31.255.255',
//       whois: 'https://api.ipapi.is/?whois=104.16.0.0'
//     }
//   };

// used to save api response to access in try block and solves the issue that info.ejs company is undefined
let response;

app.post("/submit", async (req, res) => {
   
    const address = req.body.ipAddress;
    
    try {
        // use user passed in ip address to get data from api  
        response = await axios.get(`${API_URL}?q=${address}`);
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
        res.render("info.ejs", { error });
        // console.error("Error occurred:", error.message);
        // res.render("info.ejs", { error: error.message || "An error occurred" });
   
    }
});

// Host server
app.listen(port, () => {
    console.log("Security Info Api running on port ", port);
});
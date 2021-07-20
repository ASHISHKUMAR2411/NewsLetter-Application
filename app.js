/*jslint es6 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define */
/*global require, module,  __dirname */
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require('https');
require('dotenv').config();
const app = express();
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(express.static("public"));
app.get("/", function (req, res) {
    "use strict";
    res.sendFile(__dirname + "/signup.html");
});
app.post("/", function (req, res) {
    // console.log(req.body.firstName,req.body.lastName,req.body.emailId);
    const fName = req.body.firstName;
    const lName = req.body.lastName;
    const email = req.body.emailId;
    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: fName,
                LNAME: lName,
            }
        }]
    };
    const jsonData = JSON.stringify(data);
    const url = "https://us6.api.mailchimp.com/3.0/lists/"+process.env.LIST_ID;
    const options = {
        method:"POST",
        auth:{
            user:"Ashish",
            pass:process.env.API_KEY
        }
    };
    const requests = https.request(url, options, function (response) {
        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }else{
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function (datas) {
            console.log(JSON.parse(datas));
        });
    });
    requests.write(jsonData);
    requests.end();
});
app.post("/failure" , function (req,res) {
    res.redirect("/");
});
app.listen(process.env.PORT || 3000, function () {
    "use strict";
    console.log("server at 3000 ");
    console.log("server is running");
});
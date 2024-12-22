const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverrride = require("method-override");
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js")

const listings = require("./routes/listing.js")
const reviews = require("./routes/review.js")

const mongoURI = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log("Connected to the database");
    })
    .catch((err) => {
        console.error("Error connecting to the database:", err);
    });

async function main(params) {
    await mongoose.connect(mongoURI)
}

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname ,"views"))
app.use(express.urlencoded({extended:true}));
app.use(methodOverrride("_method"));
app.engine("ejs" , ejsMate);
app.use(express.static(path.join(__dirname ,"public")));

app.get("/" , (req , res) =>{
    res.send("Hii");
});

app.use("/listings" , listings);
app.use("/listings/:id/reviews" , reviews );


app.all("*" , (req , res , next) => {
next(new ExpressError(404 , "Page Not Found"))
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went Wrong!" } = err;
    res.status(statusCode).render("error.ejs", { message }); 
    // res.status(statusCode).send(message);
});

app.listen(5000, () => {
    console.log("server is listening");
});

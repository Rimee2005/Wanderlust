const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverrride = require("method-override");
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js")
const session = require("express-session")
const flash = require("connect-flash")
const passport = require("passport")
const LocalStrategy = require("passport-local");
const User = require("./models/user.js")

const listings = require("./routes/listing.js")
const reviews = require("./routes/review.js");
const { createSecretKey } = require("crypto");
const user = require("./models/user.js");
const { register } = require("module");

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

const sessionOptions = { 
    secret : "mysupersecretcode" ,
    resave: false ,
    saveUninitialized : true
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/demouser", async(req , res)=>{
    let fakeUser = new User({
        email: "student@gmail.com",
        username: "delta-student"
    });

      let registeredUser = await user.register(fakeUser  , "Hello world");
    res.send(registeredUser);
})


app.use((req , res , next)=> {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    
    next();
})



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

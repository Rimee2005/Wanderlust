const express = require("express");
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listing.js")
const path = require("path");
const methodOverrride = require("method-override");
const ejsMate = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js")


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

const ValidateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body)
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

//Validation of serverside for reviews
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


// Index Route: List all listings
app.get("/listings", 
    wrapAsync (async (req, res) => {
    const allListings = await Listing.find({});
    res.render("index", { allListings });

}));

//New Route
app.get("/listing/new", (req, res) => {
    res.render("listing/new");
});

// Show Route: View a single listing by ID
app.get("/listings/:id", 
    wrapAsync (async (req, res) => {
    const { id } = req.params;
    try {
        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).send("Listing not found");
        }
        res.render("listing/show", { listing });
    } catch (err) {
        console.error("Error fetching listing:", err);
        res.status(500).send("Internal Server Error");
    }
}));

//Create Route
app.post(
    "/listings",
    ValidateListing,
     wrapAsync(async (req, res , next) => {      
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings")
}));

//Edit Route
app.get("/listings/:id/edit", 
    wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/edit", { listing });
}));

//Update Route 
app.put("/listings/:id", 
    ValidateListing,
    wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id , {...req.body.listing});
    res.redirect(`/listings/${id}`)
}));

//Delete Route 
app.delete("/listings/:id", 
    wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings")
}));

//Reviews POST Route
app.post("/listings/:id/reviews" , validateReview ,
     wrapAsync(async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);

}))

// app.get("/testListing" , async(req , res) =>{
//     let sampleListing = new Listing({
//         title : "my new villa",
//         description : "By the vilaa",
//         price : 1200 , 
//         location : "calangute , goa",
//         country : "India",
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successfull testing");
// });

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

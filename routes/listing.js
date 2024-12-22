const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js")
const Listing = require("../models/listing.js")

//Validation of serverside for listings
const ValidateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body)
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// Index Route: List all listings
router.get(
    "/",
    wrapAsync(async (req, res) => {
        const allListings = await Listing.find({});
        res.render("index", { allListings });
    })
);

//New Route
router.get("/new", (req, res) => {
    res.render("listing/new");
});

// Show Route: View a single listing by ID
router.get("/:id", 
    wrapAsync (async (req, res) => {
    const { id } = req.params;
    try {
        const listing = await Listing.findById(id).populate("reviews");
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
router.post(
    "/",
    ValidateListing,
     wrapAsync(async (req, res , next) => {      
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings")

}));

//Edit Route
router.get("/:id/edit", 
    wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/edit", { listing });
}));

//Update Route 
router.put("/:id", 
    ValidateListing,
    wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id , {...req.body.listing});
    res.redirect(`/listings/${id}`)
}));

//Delete Route 
router.delete("/:id", 
    wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings")
}));

module.exports = router;
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js")
const Listing = require("../models/listing.js")
const{isLoggedIn} = require("../middleware.js")


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
router.get("/new",
     isLoggedIn ,  ( req, res) => {
    res.render("listing/new");
});

// Show Route: View a single listing by ID
router.get("/:id", wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
    .populate("reviews")
    .populate("owner");

    if (!listing) {
       req.flash("error" , "Listing you request for doesn't exist!")
       res.redirect("/listings");
    }
   console.log(listing)
    res.render("listing/show", { listing });
}));

//Create Route
router.post(
    "/",
    isLoggedIn,
    ValidateListing, 
    wrapAsync(async (req, res, next) => {      
      const newListing = new Listing(req.body.listing);

      // Assign the owner field to the currently logged-in user's ID
     newListing.owner = req.user._id;

      await newListing.save();
  
      // Set the success flash message
      req.flash("success", "New Listing Created");
  
      // Redirect to listings page
      res.redirect("/listings");
    })
  );
  
  

//Edit Route
router.get("/:id/edit", 
    isLoggedIn,
    wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error" , "Listing you request for doesn't exist!")
        return res.redirect("/listings");
     }
 
    res.render("listing/edit", { listing });
}));

//Update Route 
router.put("/:id", 
    isLoggedIn,
    ValidateListing,
    wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id , {...req.body.listing});
    req.flash("success" , "Listing Updated")
    res.redirect(`/listings/${id}`)
}));

//Delete Route 
router.delete("/:id", 
    isLoggedIn,
    wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "listing Deleted")
    res.redirect("/listings")
}));

module.exports = router;
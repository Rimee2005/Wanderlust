const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const Listing = require("../models/listing.js")
const{isLoggedIn , isOwner , ValidateListing} = require("../middleware.js");
const { index } = require("../controllers/listings.js");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

const listingController = require("../controllers/listings.js")

 router
  .route("/")
  .get( wrapAsync(listingController.index))
//   .post(
//     isLoggedIn,
//     ValidateListing, 
//     wrapAsync(listingController.createListing),
    .post(upload.single('listing[image]') , (req , res) => {
        res.send(req.file)
    });

//New Route
router.get("/new" ,  isLoggedIn , listingController.renderNewForm );

router.route("/:id")
 .get( wrapAsync(listingController.showListing))
 .put( 
    isLoggedIn,
    isOwner,
    ValidateListing,
    wrapAsync(listingController.updateListing))
    .delete( 
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.destroyListing));


//Edit Route
router.get("/:id/edit", 
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.editListing));


module.exports = router;
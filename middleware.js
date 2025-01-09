const Listings = require("./models/listing");
const Review = require("./models/review.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js")


module.exports.isLoggedIn = (req , res , next) => {
console.log(req.path , ".." , req.originalUrl);

    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error" , "You must Logged in to create listing!");
        return res.redirect("/login");
    }
    next();
}


module.exports.saveRedirectUrl = (req , res , next ) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}


module.exports.isOwner = async(req , res , next) => {
    let { id } = req.params;
    let listing = await Listings.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not the owner of listing");
        return res.redirect(`/listings/${id}`)
    }

    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params; // Correctly use `reviewid`
    // console.log("Review ID:", reviewid);
    // console.log("Listing ID:", id);

    try {
        // Find the review by `reviewid`
        const review = await Review.findById(reviewId);

        // Handle the case where the review is not found
        if (!review) {
            req.flash("error", "Review not found!");
            return res.redirect(`/listings/${id}`);
        }

        // Check if the current user is the author of the review
        if (!review.author.equals(res.locals.currUser._id)) {
            req.flash("error", "You are not authorized to delete this review!");
            return res.redirect(`/listings/${id}`);
        }

        next(); // Allow the request to proceed
    } catch (err) {
        console.error("Error in isReviewAuthor middleware:", {
            error: err.message,
            reviewId,
            userId: res.locals.currUser ? res.locals.currUser._id : "Not Logged In",
        });
        req.flash("error", "Something went wrong. Please try again.");
        res.redirect(`/listings/${id}`);
    }
};




//Validation of serverside for listings
module.exports.ValidateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body)
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


//Validation of serverside for reviews
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};
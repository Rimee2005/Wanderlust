const Listing = require("../models/listing");
const Review = require("../models/review");


module.exports.createReview = async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
     newReview.author = req.user._id;
    listing.reviews.push(newReview);
 
    await newReview.save();
    await listing.save();
 
    req.flash("success" , "New Review Created!")
    res.redirect(`/listings/${listing._id}`);
 
 }


 module.exports.destroyReview = async (req, res, next) => {
    try {
      const { id, reviewId } = req.params;
      
      // Check if Listing and Review exist
      const listing = await Listing.findById(id);
      if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
      }
  
      const review = await Review.findById(reviewId);
      if (!review) {
        req.flash("error", "Review not found!");
        return res.redirect(`/listings/${id}`);
      }
  
      // Remove the review from the Listing's reviews array
      await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  
      // Delete the review
      await Review.findByIdAndDelete(reviewId);
  
      req.flash("success", "Review Deleted!");
      res.redirect(`/listings/${id}`);
    } catch (error) {
      next(error);
    }
  };
  



const Listing = require("../models/listing")

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("index", { allListings });
}


module.exports.renderNewForm =  ( req, res) => {
    res.render("listing/new");
}


module.exports.showListing = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews" ,
       populate: {
        path : "author",
        model: "Users"
       },
    })
    .populate("owner");

    if (!listing) {
       req.flash("error" , "Listing you request for doesn't exist!")
       res.redirect("/listings");
    }
//    console.log(listing)
    res.render("listing/show", { listing });
};

module.exports.createListing = async (req, res, next) => {    
      let url = req.file.path;
      let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);

    // Assign the owner field to the currently logged-in user's ID
   newListing.owner = req.user._id;
   newListing.image = {url , filename};
  const savedListing = await newListing.save();
  const populatedListing = await Listing.findById(savedListing._id).populate('owner');
  
//   console.log(populatedListing);
    // Set the success flash message
    req.flash("success", "New Listing Created");

    // Redirect to listings page
    res.redirect("/listings");
  }


  module.exports.editListing = (async (req, res) => {
      let { id } = req.params;
      const listing = await Listing.findById(id);
      if (!listing) {
          req.flash("error" , "Listing you request for doesn't exist!")
          return res.redirect("/listings");
       }
   
    let originalImageUrl = listing.image.url;
    originalImageUrl.replace("/upload" ,"/upload/w_250")

      res.render("listing/edit", { listing  ,
        originalImageUrl: listing.image,
      });
  });


  module.exports.updateListing = async (req, res) => {
    let { id } = req.params;

    // Update listing details
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    // Update image if a new file is uploaded
    if (typeof req.file !== "undefined") {
        console.log("Uploaded File:", req.file); // Debug log
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename }; // Save the uploaded image details
        await listing.save();
    }

    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
};



  module.exports.destroyListing = async (req, res) => {
      let { id } = req.params;
      let deletedListing = await Listing.findByIdAndDelete(id);
      console.log(deletedListing);
      req.flash("success", "listing Deleted")
      res.redirect("/listings")
  };
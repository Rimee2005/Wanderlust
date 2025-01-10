const mongoose = require("mongoose"); // Import mongoose
const Schema = mongoose.Schema;
const Review = require("./review");
const { required } = require("joi");

// Define the schema
const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true, // Title is mandatory
    },
    description: {
        type: String,
        required: true, // Description is mandatory
    },
    image: {
      url: String , 
      filename: String ,
    },
    price: {
        type: Number,
        required: true,
        min: [0, "Price must be a non-negative value."],
    },
    
    location: {
        type: String,
        required: true, 
    },
    country: {
        type: String,
        required: true, 
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review", // Referencing the Review model
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "Users" ,
        required: true
    }
});

listingSchema.post("findOneAndDelete" , async(listing) =>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}})
    }
})


// Create the model
const Listing = mongoose.model("Listing", listingSchema);

// Export the model
module.exports = Listing;

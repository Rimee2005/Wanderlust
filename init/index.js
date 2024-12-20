const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const mongoURI = "mongodb://127.0.0.1:27017/wanderlust";

// Connect to MongoDB
async function main() {
    await mongoose.connect(mongoURI);
}

// Initialize database with sample data
const initDB = async () => {
    await Listing.deleteMany({}); // Clear existing data
    await Listing.insertMany(initData.data); // Insert sample data
    console.log("Database initialized with sample data");
};

// Main execution flow
main()
    .then(() => {
        console.log("Connected to the database");
        return initDB(); // Initialize the database after connection
    })
    .catch((err) => {
        console.error("Error connecting to the database:", err);
    });

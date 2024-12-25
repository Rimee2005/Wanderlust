const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const mongoURI = "mongodb://127.0.0.1:27017/wanderlust";

// Connect to MongoDB
async function main() {
    await mongoose.connect(mongoURI);
}

// Initialize database 
const initDB = async () => {
    await Listing.deleteMany({}); 
    initData.data = initData.data.map((obj) =>({
        ...obj , 
        owner: "673f42f9f4f1f9af5b75406e"}))
    await Listing.insertMany(initData.data);
    console.log("Database initialized");
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

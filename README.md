🌍 Wanderlust ✨
Wanderlust is your gateway to discovering, sharing, and managing breathtaking travel destinations. Whether you're planning a solo adventure, a family getaway, or a dream vacation, Wanderlust helps you find the perfect spot, share your favorite places, and inspire others.

📋 Table of Contents
Features
Tech Stack
Demo
Installation Guide
How It Works
API Endpoints
Screenshots
Folder Structure
Contributing
Contact


🚀 Features
🔒 User Authentication: Secure login and account management with Passport.js.
🖼️ Image Uploads: Effortless image management with Cloudinary.
📝 CRUD Operations: Create, read, update, and delete travel listings easily.
🌐 Responsive Design: Optimized for both desktop and mobile users.
📌 Location Management: Add detailed country and location information to each listing.
💲 Price Management: Include prices for destinations and accommodations.
⚡ Form Validation: Ensure robust user inputs with form validation.
🎨 Dynamic Templates: Beautiful, reusable templates powered by EJS.
🛠️ Tech Stack
Frontend:
HTML5: Structuring the web pages.
CSS3: Custom styles for responsive design.
EJS: Dynamic templating for server-rendered views.
Backend:
Node.js: JavaScript runtime for the server-side logic.
Express.js: Web framework for routing and APIs.
Database:
MongoDB Atlas: Cloud-based NoSQL database to store listings and user data.
Tools & Services:
Multer: Middleware for handling file uploads.
Cloudinary: Cloud storage for images.
Passport.js: Authentication middleware.
Git: Version control system.
GitHub: Repository hosting platform.

🎥 Demo
Live URL: https://wanderlust-21ma.onrender.com

To run the project locally, follow the Installation Guide.

🛠️ Installation Guide
Prerequisites:
Node.js installed on your machine.
MongoDB Atlas account.
Cloudinary account for image hosting.
Steps:
Clone the Repository:
bash
Copy code
git clone https://github.com/Rimee2005/Wanderlust
cd wanderlust
Install Dependencies:

bash
Copy code
npm install
Setup Environment Variables: Create a .env file in the root directory and add the following:

bash
Copy code
MONGO_URI=your_mongodb_atlas_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
SESSION_SECRET=your_session_secret
Run the Project Locally: Start the server:

bash
Copy code
npm start
Your app will be running at http://localhost:3000.

📖 How It Works
User Authentication:

Secure user login and registration via Passport.js.
Once logged in, users can manage their travel listings.
CRUD Operations:

Users can create, update, and delete their travel listings with images, location details, and price information.
Listings are stored in MongoDB, and images are hosted on Cloudinary.
Responsive UI:

The app is designed to be mobile-friendly, ensuring a smooth experience across all devices.
Location Management:

Add and manage detailed location information like country, city, and points of interest for each listing.
🌐 API Endpoints
Authentication:
POST /login: User login.
POST /register: User registration.
Listings:
GET /listings: Fetch all travel listings.
GET /listings/:id: Fetch a single listing by ID.
POST /listings: Create a new listing.
PUT /listings/:id: Update an existing listing by ID.
DELETE /listings/:id: Delete a listing by ID.
Images:
POST /upload: Upload an image to Cloudinary.

📂 Folder Structure
wanderlust/
├── config/
│   ├── passport.js
│   └── keys.js
├── controllers/
│   ├── authController.js
│   └── listingsController.js
├── models/
│   ├── User.js
│   └── Listing.js
├── public/
│   ├── images/
│   └── styles/
├── routes/
│   ├── authRoutes.js
│   └── listingsRoutes.js
├── views/
│   ├── index.ejs
│   └── dashboard.ejs
├── .env
├── app.js
├── package.json
└── README.md


🤝 Contributing
We welcome contributions to Wanderlust! To contribute:

Fork the repository.
Create a new branch (git checkout -b feature/your-feature).
Make your changes and commit them (git commit -am 'Add new feature').
Push your changes (git push origin feature/your-feature).
Open a pull request.


📬 Contact
For any inquiries, feel free to reach out via:

Email: rimjhimjha961@gmail.com

GitHub: https://github.com/Rimee2005

LinkedIn: https://www.linkedin.com/in/rimjhim-jha-b1b86b301/




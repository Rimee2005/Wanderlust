const express = require("express");
const session = require("express-session");
const app = express();
const flash = require("connect-flash")
const path = require("path")


app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname ,"views"))


// Define session options
const sessionOptions = {
    secret: "mysupersecretstring", // Secret key for signing the session
    resave: false,                // Do not save session if unmodified
    saveUninitialized: true       // Save new sessions even if they're unmodified
  };
  
  // Use session middleware with the defined options
  app.use(session(sessionOptions));
  app.use(flash());

  app.get("/register" , (req , res ) =>{
    let {name = "anonymous"} = req.query;
    req.session.name =name;
    req.flash("success" , "user registed")
    res.redirect("/hello");
  });
 
  app.get("/hello" , (req , res ) =>{
     res.locals.messages = req.flash("success")
    res.render("page.ejs" , {name : req.session.name
    });
  });


// // Route to count user requests
// app.get("/reqcount", (req, res) => {
//   // Check if the count exists in the session, increment it if so, or initialize it
//   if (req.session.count) {
//     req.session.count++;
//   } else {
//     req.session.count = 1;
//   }

//   // Respond with the current count
//   res.send(`You have sent a request ${req.session.count} times.`);
// });

// Start the server
app.listen(3000, () => {
  console.log("Server running on 3000");
});

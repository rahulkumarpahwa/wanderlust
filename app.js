if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
// console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); //requiring ejs mate
const ExpressError = require("./utils/ExpressError.js"); //requiring ExpressError
const session = require("express-session"); //requiring express-session to create cookies and save sessions.
const flash = require("connect-flash"); //requiring flash to flash messages.
const MongoStore = require("connect-mongo"); //requiring mongoStore so as to store the session data.
const passport = require("passport"); //requiring passport for authentication
const LocalStrategy = require("passport-local"); //requiring passport-local for authentication using normal username & password.
const User = require("./models/user.js"); // requiring user model.

const listingRouter = require("./routes/listing.js"); // require the routes for listings.
const reviewRouter = require("./routes/review.js"); // require the routes for reviews.
const userRouter = require("./routes/user.js"); // require the routes for users.

app.set("view engine", "ejs"); // set the view engine to ejs
app.set("views", path.join(__dirname, "views")); //to set the path of views folder.
app.use(express.urlencoded({ extended: true })); //to parse the data passed in the request url.
app.use(methodOverride("_method")); // to tell express to override the request where "_method" keyword is applied.
app.engine("ejs", ejsMate); //statement to be defined with ejs.
app.use(express.static(path.join(__dirname, "/public"))); //to set the static folder path.




const dbUrl = process.env.ATLASDB_URL; //connect to atlas database. 

main()
  .then((res) => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
    next(err);
  });

async function main() {
  // await mongoose.connect(MONGO_URL);
   await mongoose.connect(dbUrl);
}

//mongo session store
const store = MongoStore.create({
  mongoUrl: dbUrl, //same atlas db url
  crypto: {
    secret: process.env.SECRET, 
  },
  touchAfter: 24 * 60 * 60, //24 hours in seconds
});


store.on("error", () => {
  console.log("ERROR in MONGO SESSION STORE", err);
});


const sessionOptions = {
  // store : store,
  // or
  store,

  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};


// //root route
// app.get("/", (req, res) => {
//   res.send("Hi!, I am root");
// });

app.use(session(sessionOptions));
app.use(flash());

//Passport
app.use(passport.initialize()); // it will make passport initialize for every request.
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate())); //here User is our model we created.

passport.serializeUser(User.serializeUser()); // use static serialize and deserialize of model for passport session support
passport.deserializeUser(User.deserializeUser()); // use static serialize and deserialize of model for passport session support

// defining locals with flash messages
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  // console.log(res.locals.success);
  res.locals.error = req.flash("error");
  // console.log(res.locals.error);
  res.locals.currUser = req.user;
  next(); //make sure to write next();
});

//fakeUser creation:
// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({
//     email: "student@gmail.com",
//     username: "delta-student",
//   });
//   let registeredUser =  await User.register(fakeUser, "helloworld");
//   res.send(registeredUser);
// });

//app.use() for different routes:
app.use("/listings", listingRouter); //it will redirect all the '/listings' route to routes>listing.js
app.use("/listings/:id/reviews", reviewRouter); //it will redirect all the '/listings/:id/reviews' route to routes>review.js
app.use("/", userRouter); //it will redirect all the '/' route to routes>user.js

//Page not found!
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "PAGE NOT FOUND!"));
});

//error handling middleware:
app.use((err, req, res, next) => {
  // res.send("Something went wrong!");
  let { statusCode = 500, message = "Something went Wrong!" } = err;
  // res.status(statusCode).send(message);?
  // console.log(err);
  res.status(statusCode).render("error.ejs", { message });
});

//test listings:
// app.get("/testListing", async(req,res)=>{
// let sampleListing = new Listing({
//     title:"My New Villa",
//     description: "By the Beach",
//     image:"",
//     price: 1200,
//     location: "Calangute, Goa",
//     country:"India",
// });
// await sampleListing.save();
// console.log("sample was saved");
// console.log(sampleListing);
// res.send("successful testing");
// });

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});

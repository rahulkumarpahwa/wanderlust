const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js"); //requiring ExpressError
const { listingSchema, reviewSchema } = require("./schema.js"); //require listingSchema & reviewSchema for server side.


module.exports.isLoggedIn = (req, res, next) => {
  // console.log(req.user);
  // console.log(req);
  // console.log(req.path, "...", req.originalUrl);
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;   // store the url in the session to redirect to the page we start request
    // check the req.text for originalUrl.
    req.flash("error", "You must be logged in to create listing!");
    return res.redirect("/login");
  }
  next();
};


module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl; // we will store the req.session.redirectUrl in the res.locals as passport can't access it.
  }
  // else {
  //   res.locals.redirectUrl = "/listings";
  // }
  next();
};

//to check that the user is owner of listing
module.exports.isOwner = async (req,res,next)=>{
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the owner of this listing!");
    return res.redirect(`/listings/${id}`);
  }
  next(); //make sure to call next();
};


module.exports.validateListing = (req, res, next) => {
  // let result = listingSchema.validate(req.body);
  let { error } = listingSchema.validate(req.body); 
  // console.log(result);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    // throw new ExpressError(400, error);
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};


module.exports.validateReview = (req, res, next) => {
  // let result = reviewSchema.validate(req.body);
  let { error } = reviewSchema.validate(req.body);
  // console.log(result);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    // throw new ExpressError(400, error);
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req,res,next)=>{
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the author of this review!");
    return res.redirect(`/listings/${id}`);
  }
  next(); //make sure to call next();
};
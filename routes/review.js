const express = require("express");
// const router = express.Router();
const router = express.Router({ mergeParams: true }); //mergeParams:true will pass the parameter from body to child route.
const wrapAsync = require("../utils/wrapAsync.js"); //requiring wrapAsync fxn.
// const ExpressError = require("../utils/ExpressError.js"); //requiring ExpressError
// const { listingSchema, reviewSchema } = require("../schema.js"); //require listingSchema & reviewSchema for server side.
// const Review = require("../models/review.js"); //requiring Review model
// const Listing = require("../models/listing.js"); //requiring Listing model
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js"); //requiring the validateReview & isLoggedIn & isReviewAuthor middleware fxn.
const reviewController = require("../controllers/reviews.js");


// const validateReview = (req, res, next) => {
//   // let result = reviewSchema.validate(req.body);
//   let { error } = reviewSchema.validate(req.body);
//   // console.log(result);
//   if (error) {
//     let errMsg = error.details.map((el) => el.message).join(",");
//     // throw new ExpressError(400, error);
//     throw new ExpressError(400, errMsg);
//   } else {
//     next();
//   }
// };

//Post Review Route

//post review route
router.post(  "/",  validateReview,  isLoggedIn,  wrapAsync(reviewController.createReview));

//Delete/Destroy Review Route:
router.delete(  "/:reviewId",  isLoggedIn, isReviewAuthor,  wrapAsync(reviewController.destroyReview));

module.exports = router;

const Listing = require("../models/listing");
const Review = require("../models/review");

//Post review route:
module.exports.createReview = async (req, res) => {
  console.log(req.params.id);
  let listing = await Listing.findById(req.params.id);
  // console.log(req.body.review);
  let newReview = new Review(req.body.review);

  newReview.author = req.user._id; //adding the review author
  console.log(newReview);
  listing.reviews.push(newReview); //putting the review._id in the listing.
  //or
  //listing.reviews = newReview;
  await newReview.save();
  await listing.save();
  // console.log("new review saved");
  // res.send("new review saved");
  req.flash("success", "New Review Created!"); // review added flash
  res.redirect(`/listings/${listing._id}`);
}; 


//destroy/delete review route:
module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted!"); //review deleted flash
  res.redirect(`/listings/${id}`);
};


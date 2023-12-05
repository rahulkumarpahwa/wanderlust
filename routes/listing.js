const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js"); //requiring wrapAsync fxn.
// const ExpressError = require("../utils/ExpressError.js"); //requiring ExpressError
// const { listingSchema, reviewSchema } = require("../schema.js"); //require listingSchema & reviewSchema for server side.
//const Listing = require("../models/listing.js"); //requiring Listing model
const { isLoggedIn, isOwner } = require("../middleware.js"); //requiring middleware.js for authentication & authorisation.
const { validateListing } = require("../middleware.js"); //requiring the validateListing fxn for validating update listing.
const listingController = require("../controllers/listings.js"); //requiring controller fxns for listings

const multer = require("multer"); //multer requiring to parse data of form.
const { storage } = require("../cloudConfig.js"); //requiring the storage from cloudinary.
const upload = multer({ storage }); //initialisation of multer with destination passed where to save upload files/image.

router
  .route("/")
  .get(wrapAsync(listingController.index)) //index route
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  ); //create route

//testing phase for image upload using multer.
// .post(upload.single('listing[image]'), (req, res) => {
//   res.send(req.file); //new parameter file, which contains file info.
// });

router.get("/new", isLoggedIn, listingController.renderNewForm); //new route

router
  .route("/:id")
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing)) //delete route
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  ) //update route
  .get(wrapAsync(listingController.showListing)); //show route
// note: show route must be put in the last after new route as show route will consider the /new as the id for the show route.

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
); //edit route

module.exports = router;

// const validateListing = (req, res, next) => {
//   // let result = listingSchema.validate(req.body);
//   let { error } = listingSchema.validate(req.body);
//   // console.log(result);
//   if (error) {
//     let errMsg = error.details.map((el) => el.message).join(",");
//     // throw new ExpressError(400, error);
//     throw new ExpressError(400, errMsg);
//   } else {
//     next();
//   }
// };

// router.get("/", wrapAsync(listingController.index)); //index route
// router.get("/new", isLoggedIn, listingController.renderNewForm);//new route
// router.post(  "/",  isLoggedIn,  validateListing,  wrapAsync(listingController.createListing)); //create route
// router.delete(  "/:id",  isLoggedIn,  isOwner,  wrapAsync(listingController.destroyListing)); //delete route
// router.put(  "/:id",  isLoggedIn,  isOwner,  validateListing,  wrapAsync(listingController.updateListing)); //update route
// router.get(  "/:id/edit",  isLoggedIn,  isOwner,  wrapAsync(listingController.renderEditForm)); //edit route
// // note: show route must be put in the last after new route as show route will consider the /new as the id for the show route.
// //show route:
// router.get("/:id", wrapAsync(listingController.showListing));

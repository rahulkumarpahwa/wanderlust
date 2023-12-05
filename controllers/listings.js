const Listing = require("../models/listing");

//mapbox requirements:
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


//index route
module.exports.index = async (req, res) => {
  let allListings = await Listing.find();
  // console.log(allListings); //testing
  res.render("listings/index.ejs", { allListings });
};

//new route
module.exports.renderNewForm = (req, res) => {
  //authentication code
    // console.log(req.user);
    // if (!req.isAuthenticated()) {
    //   req.flash("error", "You must be logged in to create listing!");
    //   return res.redirect("/login");
    // }
    // res.send("successful");
  res.render("listings/new.ejs");
};

//show route :
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  // const listing = await Listing.findById(id).populate("reviews").populate("owner");
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } }) //nesting populate of author for each reviews.
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for, does not exist!"); //listing error flash.
    res.redirect("/listings");
  }
  // console.log(listing); //testing.
  res.render("listings/show.ejs", { listing });
};

//create route:
module.exports.createListing = async (req, res, next) => {
  //mapbox code to do geocoding :
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      //or
      // query: req.body.listing["location"],
      limit: 1, //by-default limit is 5.
    })
    .send();
    // console.log(response.body.features[0].geometry); //body has coordinates.
    // res.send("done!");


  //taking out path and filename from req.file created by multer:
  let url = req.file.path;
  let filename = req.file.filename;
  // console.log(url, filename); //testing

  // error handling basics
  // if (!req.body.listing) {
  //   throw new ExpressError(400, "Send Valid data for listing");
  // }
  // let result = listingSchema.validate(req.body);
  // // console.log(result);
  // if (result.error) {
  //   throw new ExpressError(400, result.error);
  // }

  // other way of writing the body:
  // let {title, description, image, price,location,country}=req.body;
  // let newListing= new Listing({title, description,image,price,location,country});
  //await newListing.save();
  //or other way of writing as :
  // let listing = req.body.listing;
  // console.log(listing);
  // const newListing = new Listing({listing });
  //or
  const newListing = new Listing({ ...req.body.listing }); //we have deconstruct the req.body.listings using object literal destructuring assignment

  //field missing error handling
  // if (!newListing.title) {
  //   throw new ExpressError(400, "Title is missing!");
  // }
  // if (!newListing.description) {
  //   throw new ExpressError(400, "Description is missing!");
  // }
  // if (!newListing.location) {
  //   throw new ExpressError(400, "Location is missing!");
  // }

  //console.log(req.user);
  newListing.owner = req.user._id; // saving the current user info. in the listing created, from req.user, created by passport.
  newListing.image = { url, filename }; //saving the url(path) and filename created by multer in the image.

  newListing.geometry = response.body.features[0].geometry; //saving the map geojson data in the geometry field of the listing.
  let savedListing = await newListing.save();
  console.log(savedListing);
  req.flash("success", "New Listing Created!"); //flash message
  res.redirect("/listings");
};

//edit route:
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for, does not exist!"); //listing error flash.
    res.redirect("/listings");
  }
//creating a preview image:
let originalImageUrl = listing.image.url;
originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

//update route :
module.exports.updateListing = async (req, res) => {
  //error handling for listing
  // if (!req.body.listing) {
  //   throw new ExpressError(400, "Send Valid data for listing");
  // }

  let { id } = req.params;

  // to check the owner of listing with the user trying to access, now we will create a middleware:
  // let listing = await Listing.findById(id);
  // if (!listing.owner._id.equals(res.locals.currUser._id)) {
  //   req.flash("error", "You don't have permission to access this listing");
  //   return res.redirect(`/listings/${id}`);
  //   }

  //other way of updating the coming listing in req.body
  // let newListing = req.body.listing;
  // console.log(req.body.listing); //testing
  //await Listing.findByIdAndUpdate(id, {...newListing});
  //or

  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  
  if (typeof req.file !== "undefined") {
    //taking out url/path and filename from req.file by multer as :
    let url = req.file.path;
    let filename = req.file.filename;

    //passing the url and filename in the listing.image and saving as:
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing Updated!"); //update listing flash
  res.redirect(`/listings/${id}`);
};

//delete route or destroy route:
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted!"); //deleting flash message.
  res.redirect("/listings");
};

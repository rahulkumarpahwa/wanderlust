const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js"); //requiring Review model.

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  // image: {
  //   default:
  //     "https://th.bing.com/th/id/OIP.Rzgs0z6No7rf_2YJloW2awHaE8?pid=ImgDet&rs=1",
  //   type: String,
  //   set: (v) =>
  //     v === ""
  //       ? "https://th.bing.com/th/id/OIP.Rzgs0z6No7rf_2YJloW2awHaE8?pid=ImgDet&rs=1"
  //       : v, //v is url entered by user for image.
  // }, //because image is a url so datatype is string.
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {  //field to store the map coordinates.
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

//Post Mongoose Middleware
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;

//initialisation of sample listings

const mongoose = require("mongoose");
// const ENV  = require ("../.env");
const Listing = require("../models/listing.js"); //requiring model

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = `pk.eyJ1IjoiZGVsdGEtc3R1ZHVlbnQiLCJhIjoiY2xvMDk0MTVhMTJ3ZDJrcGR5ZDFkaHl4ciJ9.Gj2VU1wvxc7rFVt5E4KLOQ`;
// const mapToken = ENV.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// const initData = require("./data.js"); //requiring sample listings
// const initData = require("./data2.js"); //requiring sample listings 2
const initData = require("./data3.js"); //requiring sample listings 3

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"; //wanderlust is the name of our new database for major project.
const MONGO_URL = `mongodb+srv://thewittyedge:aHrRZYlExzAdsPjs@cluster0.qvciyqt.mongodb.net/?retryWrites=true&w=majority`; //wanderlust is the name of our new database for major project.

async function main() {
  await mongoose.connect(MONGO_URL);
}

main()
  .then((res) => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

const initDB = async () => {
  await Listing.deleteMany({}); //it should be empty means no condition.

  for (obj of initData.data) {
    let response = await geocodingClient
      .forwardGeocode({
        query: obj.location,
        //or
        // query: req.body.listing["location"],
        limit: 1, //by-default limit is 5.
      })
      .send();
    obj.geometry = response.body.features[0].geometry;
  }

  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "656dd5a77406cdb9921a9d0d", //new demo
  })); //adding the owner with its object id.
  //here obj represents single listing.

  await Listing.insertMany(initData.data); // inserting database.
  console.log("data was initialised");
};

initDB();
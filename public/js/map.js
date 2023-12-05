// TO MAKE THE MAP APPEAR YOU MUST // ADD YOUR ACCESS TOKEN FROM  // https://account.mapbox.com
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID

  style: "mapbox://styles/mapbox/streets-v12", // style URL // Choose from Mapbox's core styles, or make your own style with Mapbox Studio

  // center: [-74.5, 40], // starting position [lng, lat]  //example 1
  // center: [77.2, 28.61], // starting position [lng, lat] //example 2
  center: listing.geometry.coordinates, // starting position [lng, lat]  //set to the coordinates in the listing in database

  zoom: 9, // starting zoom
});

console.log(listing.geometry.coordinates); //testing //will show in the browser console.

// Create a Marker and add it to the map.
// const marker = new mapboxgl.Marker({color:"red"})
// // .setLngLat([12.554729, 55.70651]) //example 1
//   .setLngLat(coordinates)
//   .addTo(map);

// Create a Marker with marker popup and add it to the map.
const marker = new mapboxgl.Marker({ color: "red" })
  // .setLngLat([12.554729, 55.70651]) //example 1
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 })
      //   .setHTML("<h1>Hello World!</h1>")
      .setHTML(
        `<h4>${listing.location}</h4><p>Exact Location provided after booking</p>`
      )
  ) //adding a marker popup
  .addTo(map);

const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

router
  .route("/signup")
  .get(userController.renderSignupForm) //get signup route
  .post(wrapAsync(userController.signup)); //post signup route

router
  .route("/login")
  .get(userController.renderLoginForm) //get login route
  .post(
    saveRedirectUrl, //saveRedirectUrl middleware is called for saving value to res.locals.redirectUrl from res.session.redirectUrl
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  ); //post login route

router.get("/logout", userController.logout); //logout route

module.exports = router;

//get signup route
// router.get("/signup", userController.renderSignupForm);
// //post signup route:
// router.post("/signup", wrapAsync(userController.signup));
// //get login route
// router.get("/login", userController.renderLoginForm);
// //post login route
// router.post(
//   "/login",
//   saveRedirectUrl, //saveRedirectUrl middleware is called for saving value to res.locals.redirectUrl from res.session.redirectUrl
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true,
//   }),
//   userController.login
// );
// //logout route
// router.get("/logout", userController.logout);

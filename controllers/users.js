const User = require("../models/user");

//get signup route
module.exports.renderSignupForm = (req, res) => {
  //   res.send("form");
  res.render("users/signup.ejs");
};

//post signup route
module.exports.signup = async (req, res) => {
  try {
    let { email, username, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome To WanderLust!");
      return res.redirect("/listings");
    });
    // req.flash("success", "Welcome to WanderLust!");  //moved to req.login() method above
    // res.redirect("/listings");  //moved to req.login() method above
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};


//get login route
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

//post login route
module.exports.login = async (req, res) => {
  // res.send("Welcome to WanderLust! You are Logged In!");
  req.flash("success", "Welcome back to WanderLust!");
  // res.redirect("/listings");

  // console.log(res.locals.redirectUrl);
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};


//logout route:
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out now!");
    res.redirect("/listings");
  });
};
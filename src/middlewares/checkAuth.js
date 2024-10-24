const jwt = require("jsonwebtoken");
const jwtSecret = process.env.SECRET;

// This middleware attaches the username of the current user (if they are logged in) and the userLoggedIn boolean to the request object.
// It ensures the user's authentication status by verifying the presence and validity of a JSON Web Token (JWT) stored in the cookies.

function checkUserLoggedIn(req, res, next) {
  const allCookies = req.cookies;
  if (!allCookies) {
    req.userLoggedIn = false;
    return next();
  }
  const jsonWebT = allCookies["note_exchange_verification"];
  if (!jsonWebT) {
    req.userLoggedIn = false;
    return next();
  }
  try {
    const tokenIsValid = jwt.verify(jsonWebT, jwtSecret);
    req.userLoggedIn = true;
    req.user = tokenIsValid.user;
  } catch (error) {
    req.userLoggedIn = false;
    console.error("An error occurred when decoding JWT: " + error);
  }
  return next();
}

module.exports = checkUserLoggedIn;

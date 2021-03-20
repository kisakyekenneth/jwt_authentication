/**
 * This will help us to set up protected endpoints.
 *
 * Middleware is a software/ piece of code
 * that acts as a bridge between the database and the application, especially on a network.
 *
 * For the case of this project, we want to ensure that when a request is sent to the server,
 * some code(middleware) is run before the request hits the server and returns a response.
 * We want to check if a person who is trying to access a specific resource is authorized to access it.
 */

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  const data = jwt.verify(token, process.env.JWT_KEY);
  try {
    const user = await User.findOne({ _id: data._id, "tokens.token": token });
    if (!user) {
      throw new Error();
    }
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send({ error: "Not authorized to access this resource" });
  }
};
module.exports = auth;

//Notes
/**
 * An express middleware is simply a function with three parameters, the request, response and next .
 *
 * On, line 16,
 * we get the token from the "request header" and since the token comes in a format of, Bearer[space]token
 * we are replacing Bearer[space] with nothing('') so that we can have access to our token.
 *
 * Once we have the token, we use the JWT verify method to check if the token received is valid or was created using our JWT_KEY .
 * The JWT verify method returns the payload that was used to create the token.
 *
 * Now since we have the "payload from the token",
 * we can now find a "user" with that "id" and also if the token is in the user’s tokens array.
 *
 * Once we find that user, we attach the user on our request (req.user = user)
 * and then do the same for the token then call next() to go to the next middleware.
 * If next() is not called, the application will freeze at that point and won’t proceed to run the rest of the code.
 *
 * Now to use our auth middleware, we are going to go back to /routers/user.js,
 * import our auth middleware by requiring it at the top of the file just after requiring the user model.
 *
 */

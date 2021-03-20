const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/users", async (req, res) => {
  // Create a new user
  try {
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/users/login", async (req, res) => {
  //Login a registered user
  try {
    const { email, password } = req.body; //req.body contains user information
    const user = await User.findByCredentials(email, password);
    if (!user) {
      return res
        .status(401)
        .send({ error: "Login failed! Check authentication credentials" });
    }
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

/**
 * make a get and then I pass in my "auth" middleware just before the method.
 * This will ensure that the middleware is run before executing the rest of my function.
 * I will have access to the user in my request
 */
router.get("/users/me", auth, async (req, res) => {
  // View logged in user profile
  //Remember we added the user to the request in my middleware
  res.send(req.user);
});

module.exports = router;

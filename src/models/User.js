const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: value => {
      if (!validator.isEmail(value)) {
        throw new Error({ error: "Invalid Email address" });
      }
    }
  },
  password: {
    type: String,
    required: true,
    minLength: 7
  },
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ]
});

userSchema.pre("save", async function(next) {
  // Hash the password before saving the user model
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.methods.generateAuthToken = async function() {
  // Generate an auth token for the user
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  // Search for a user by email and password.
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error({ error: "Invalid login credentials" });
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error({ error: "Invalid login credentials" });
  }
  return user;
};

const User = mongoose.model("User", userSchema);

module.exports = User;

/**
 * Mongoose will convert our user schema into a document in the database
 * and those properties will be converted into fields in our document.
 *
 * The validate function helps us make some more validations on our schemas.
 *
 * We shall also store a list of tokens in our database.
 * Every time a user registers or logs in,
 * we shall create a token and append it to the existing list of tokens.
 * Having a list of tokens enables a user to be logged in on different devices
 *
 * From line 36 to 43,
 * we define a pre-save function that the mongoose schema provides us.
 * This enables us to do something before we save the created object.
 * We are using bcrypt to hash the password.
 *
 * From, line 47 to 54
 * we define an instance method called generateAuthToken .
 * This method uses the JWT to sign method to create a token.
 * The sign method expects the data that will be used to sign the token and a JWT key which can be a random string.
 * For our case, we defined one in the .env file and named it JWT_KEY .
 * Once the token is created, we add it to the user’s list of tokens, save, and return the token.
 *
 * Finally, on, line 67 ,
 * we create a model called "User" and pass it our created "user schema"
 * and we then export the module so that it can be re-used in other files.
 */

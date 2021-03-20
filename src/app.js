const express = require("express");
const userRouter = require("./routers/user_routes");
const port = process.env.PORT;
require("./db/db"); //require the db.js file that has our database connection

var app = express();

//Middlewares
app.use(express.json());
app.use(userRouter);

app.listen(port, () => {
  console.log("Server running on port", port);
});

/**
 * The express instance gives us
 * methods like get, post, delete, patch that we use to send HTTP requests to the server.
 */

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
// api routes
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

// import mongo uri from config files
const mongodb = require("./config/keys").mongoURI;

//connect to online mongodb
mongoose
  .connect(mongodb, { useNewUrlParser: true })
  .then(() => console.log("Mongodb Connnected successfully"))
  .catch(err => console.log(err));

const app = express();

app.use(passport.initialize());
require("./config/passport")(passport);

//body parser middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/users", users);
app.use("/api/posts", posts);
app.use("/api/profile", profile);

//home route
app.get("/", (req, res) => res.send("Hello World !"));

const PORT = process.env.PORT || 7000;

app.listen(PORT, console.log(`server is running on port ${PORT}`));

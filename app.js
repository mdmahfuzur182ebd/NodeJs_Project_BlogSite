require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const config = require('config')


// Import Routes.
const authRoutes = require("./routes/authRoute");
const dashboardRoutes = require("./routes/dashboardRoute");

// Import Middleware
const { bindUserWithRequest } = require("./middleware/authMiddleware");
const setLocals = require("./middleware/setLocals");

//playground Routes
//const validatorRouter = require('./playground/validator')


// Database
const MONGODB_URI = `mongodb+srv://${config.get("db-username")}:${config.get(
  "db-password"
)}@cluster0.zlpqkbc.mongodb.net/exp-blog`;

// session store
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

//console.log(process.env.NODE_ENV)//undefine

const app = express();

//config
console.log(config.get('name'))
// console.log(config.get('email'))
// console.log(config.get('contact.'))

//Setup view Engine

app.set("view engine", "ejs");
app.set("views", "views");

// Middleware Array

const middleware = [
  morgan("dev"),
  express.static("public"),
  express.urlencoded({ extended: true }),
  express.json(),
  session({
    secret: config.get('secret'),
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 2, //  2 hour
    },
    store: store,
  }),
  bindUserWithRequest(),
  setLocals(),
  flash(),
];

app.use(middleware);
app.use("/auth", authRoutes);
app.use("/dashboard", dashboardRoutes);
//app.use("/playground", validatorRouter);

app.get("/", (req, res) => {
  res.json({
    message: "Hello Project.",
  });
});

const PORT = process.env.PORT || 8080;

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log("Database Connected");
    app.listen(PORT, () => {
      console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
    });
  })
  .catch((e) => {
    return console.log(e);
  });

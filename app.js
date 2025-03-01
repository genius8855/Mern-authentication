const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const connectDB = require('./config/db');
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.set("view engine", "ejs");



// Sessions
app.use(
    session({
      secret: "secretkey",
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
      cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 day
    })
);

//Routes
app.use('/',authRoutes);

app.get('/', (req, res) => res.render("index"));
app.get('/register', (req, res) => res.render("register"));
app.get("/login", (req, res) => res.render("login"));
app.get("/dashboard", authMiddleware, (req, res) => res.render("dashboard", { user: req.session.user }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
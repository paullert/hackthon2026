import express from 'express';
import 'dotenv/config';

const app = express();

app.set("view engine", "ejs");

// Makes it so that file selection automatically starts in public folder directory
app.use("/public", express.static("public"));

// app.use(express.urlencoded({extended: true})); // Allows the use of .post routes

const PORT = process.env.PORT || 3000;

// Routes
// Home Route
app.get("/", (req, res) => {
    res.render("home.ejs");
});

// Search Page Route
app.get("/search", (req, res) => {
    res.render("search.ejs");
});


app.listen(PORT, ()=>{
    console.log(`Donation Web: Express server running on port ${PORT}`);
});
import express from 'express';
import 'dotenv/config';
import pg from 'pg';
const {Pool} = pg;

const app = express();
const PORT = process.env.PORT

app.set("view engine", "ejs");


// Makes it so that file selection automatically starts in public folder directory
app.use("/", express.static("public"));


const pool = new Pool({
    connectionString: process.env.NEON_DB_URL
});

// Routes
// Home Route
app.get("/", (req, res) => {
    res.render("home");
});

app.get("/search", (req, res) => {
    res.render("search");
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
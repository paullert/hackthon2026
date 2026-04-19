import express from 'express';
import 'dotenv/config';
import pg from 'pg';
const {Pool} = pg;

const app = express();

app.set("view engine", "ejs");

// Makes it so that file selection automatically starts in public folder directory
app.use("/", express.static("public"));

// app.use(express.urlencoded({extended: true})); // Allows the use of .post routes

const pool = new Pool({
    connectionString: process.env.NEON_DB_URL
});

const PORT = process.env.PORT || 3000;

// Routes
// Home Route
app.get("/", (req, res) => {
    res.render("home.ejs");
});

app.get("/search", (req, res) => {
    res.render("search");
// Search Page Route
app.get("/search", async (req, res) => {
    let sql = `Select Distinct item from place_items`;
    let data = await pool.query(sql).then(response => response.rows);
    let items = data.map(x => x.item);
    console.log(data);
    res.render("search.ejs", {items});
});

app.get("/about", (req, res) => {
    res.render("about");
});
app.get("/placesSearch", async (req, res) => {
    let categories = req.query.categories;
    let items = req.query.item;

    let sql = `
        Select *
        from places p
        join public.place_schedules ps
            on p.place_id = ps.place_id
        join public.place_items pi on p.place_id = pi.place_id
        where pi.item = $1;
        `;


    let data = await pool.query(sql, [items]).then(response => response.rows);
    console.log(data);
    res.render("places.ejs", {places: data});
});

app.listen(PORT, ()=>{
    console.log(`Donation Web: Express server running on port ${PORT}`);
});
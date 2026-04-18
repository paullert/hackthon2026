import express from "express";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index");
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
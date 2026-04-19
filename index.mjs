import express, {response} from 'express';
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

// Search Page Route
app.get("/search", async (req, res) => {
    let sql = `Select Distinct item from place_items`;
    let data = await pool.query(sql).then(response => response.rows);
    let items = data.map(x => x.item);

    sql = `Select Distinct type from places`;
    data = await pool.query(sql).then(response => response.rows);
    let types = data.map(x => x.type);

    sql = `Select distinct city from places`;
    data = await pool.query(sql).then(response => response.rows);
    let cities = data.map(x => x.city);

    let places = [];
    const type = (req.query.type || "").trim();
    const item = (req.query.item || "").trim();
    const city = (req.query.city || "").trim();
    const keyword = (req.query.keyword || "").trim();

    const conditions = [];
    const values = [];

    if (type) {
        values.push(type);
        conditions.push(`LOWER(p.type) = LOWER($${values.length})`);
    }

    if (item) {
        values.push(item);
        conditions.push(`
    EXISTS (
      SELECT 1
      FROM place_items pi2
      WHERE pi2.place_id = p.place_id
        AND LOWER(pi2.item) = LOWER($${values.length})
    )
  `);
    }

    if (city) {
        values.push(city);
        conditions.push(`LOWER(p.city) = LOWER($${values.length})`);
    }

    if (keyword) {
        values.push(`%${keyword}%`);
        conditions.push(`
    (
      p.name ILIKE $${values.length}
      OR p.city ILIKE $${values.length}
      OR p.address ILIKE $${values.length}
    )
  `);
    }

    const whereClause = conditions.length
        ? `WHERE ${conditions.join(" AND ")}`
        : "";

    sql = `
        SELECT
            p.place_id,
            p.name,
            p.city,
            p.type,
            p.address,
            COALESCE(s.schedules, '[]'::json) AS schedules,
            COALESCE(i.items, '[]'::json) AS items
        FROM places p
                 LEFT JOIN (
            SELECT
                ps.place_id,
                json_agg(
                        json_build_object(
                                'schedule_id', ps.schedule_id,
                                'tz', ps.tz,
                                'rrule', ps.rrule,
                                'time_start', ps.time_start,
                                'time_end', ps.time_end,
                                'valid_from', ps.valid_from,
                                'valid_to', ps.valid_to
                        )
                        ORDER BY ps.time_start
                ) AS schedules
            FROM place_schedules ps
            GROUP BY ps.place_id
        ) s ON s.place_id = p.place_id
                 LEFT JOIN (
            SELECT
                pi.place_id,
                json_agg(pi.item ORDER BY pi.item) AS items
            FROM place_items pi
            GROUP BY pi.place_id
        ) i ON i.place_id = p.place_id 
        ${whereClause}
        ORDER BY p.name
        `;

    places = await pool.query(sql, values).then(response => response.rows);
    console.log(places);


    res.render("search.ejs", {cities, items, types, places, slugify, formatLabel});
});



app.get("/about", (req, res) => {
    res.render("about.ejs");
});

app.get("/place/:id", async (req, res) => {
    const placeId = req.params.id;

    const sql = `
    SELECT
        p.place_id,
        p.name,
        p.city,
        p.type,
        p.address,
        p.website,
        p.image_url,
        COALESCE(s.schedules, '[]'::json) AS schedules,
        COALESCE(i.items, '[]'::json) AS items
    FROM places p
    LEFT JOIN (
        SELECT
            ps.place_id,
            json_agg(
                json_build_object(
                    'schedule_id', ps.schedule_id,
                    'tz', ps.tz,
                    'rrule', ps.rrule,
                    'time_start', ps.time_start,
                    'time_end', ps.time_end,
                    'valid_from', ps.valid_from,
                    'valid_to', ps.valid_to
                )
                ORDER BY ps.time_start
            ) AS schedules
        FROM place_schedules ps
        GROUP BY ps.place_id
    ) s ON s.place_id = p.place_id
    LEFT JOIN (
        SELECT
            pi.place_id,
            json_agg(pi.item ORDER BY pi.item) AS items
        FROM place_items pi
        GROUP BY pi.place_id
    ) i ON i.place_id = p.place_id
    WHERE p.place_id = $1
  `;

    const result = await pool.query(sql, [placeId]);

    if (!result.rows.length) {
        return res.status(404).send("Place not found");
    }

    let place = result.rows[0];
    place.schedules = place.schedules.map(schedule => ({
        ...schedule,
        text: scheduleToText(schedule)
    }));
    console.log(place);


    res.render("place.ejs", {
        apiKey: process.env.GOOGLE_MAPS_API_KEY,
        place,
        slugify,
        formatLabel
    });
});

app.get("/map", async (req, res) => {
    const result = await pool.query(`
    SELECT
      place_id,
      name,
      type,
      address,
      city,
      website,
      latitude,
      longitude
    FROM places
    WHERE latitude IS NOT NULL
      AND longitude IS NOT NULL
    ORDER BY name
  `);

    res.render("map.ejs", {
        places: result.rows,
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
    });
});

app.listen(PORT, ()=>{
    console.log(`Donation Web: Express server running on port ${PORT}`);
});

function formatLabel(value) {
    return value
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

function slugify(value) {
    return value.toLowerCase().trim().replace(/\s+/g, "-");
}

function formatTime(time) {
    if (!time) return "";

    const [hourStr, minute] = time.split(":");
    let hour = Number(hourStr);
    const suffix = hour >= 12 ? "PM" : "AM";

    hour = hour % 12;
    if (hour === 0) hour = 12;

    return `${hour}:${minute} ${suffix}`;
}

function formatDate(dateStr) {
    if (!dateStr) return "";

    const date = new Date(`${dateStr}T00:00:00`);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}

function parseRRule(rrule) {
    return rrule.split(";").reduce((acc, part) => {
        const [key, value] = part.split("=");
        acc[key] = value;
        return acc;
    }, {});
}

function formatByDay(byday) {
    if (!byday) return "";

    const dayMap = {
        MO: "Monday",
        TU: "Tuesday",
        WE: "Wednesday",
        TH: "Thursday",
        FR: "Friday",
        SA: "Saturday",
        SU: "Sunday"
    };

    const days = byday.split(",").map(code => dayMap[code] || code);

    const joined = days.join(",");

    if (joined === "Monday,Tuesday,Wednesday,Thursday,Friday") {
        return "weekdays";
    }

    if (joined === "Saturday,Sunday") {
        return "weekends";
    }

    if (days.length === 1) return days[0];
    if (days.length === 2) return `${days[0]} and ${days[1]}`;

    return `${days.slice(0, -1).join(", ")}, and ${days[days.length - 1]}`;
}

function scheduleToText(schedule) {
    const parts = parseRRule(schedule.rrule);

    let recurrenceText = "";

    if (parts.FREQ === "DAILY") {
        recurrenceText = "Every day";
    } else if (parts.FREQ === "WEEKLY") {
        if (parts.BYDAY) {
            const daysText = formatByDay(parts.BYDAY);

            if (daysText === "weekdays" || daysText === "weekends") {
                recurrenceText = `Every ${daysText}`;
            } else {
                recurrenceText = `Every ${daysText}`;
            }
        } else {
            recurrenceText = "Every week";
        }
    } else if (parts.FREQ === "MONTHLY") {
        recurrenceText = "Every month";
    } else if (parts.FREQ === "YEARLY") {
        recurrenceText = "Every year";
    } else {
        recurrenceText = "Recurring";
    }

    const timeText = schedule.time_start && schedule.time_end
        ? `from ${formatTime(schedule.time_start)} to ${formatTime(schedule.time_end)}`
        : "";

    let validText = "";
    if (schedule.valid_from && schedule.valid_to) {
        validText = `, valid from ${formatDate(schedule.valid_from)} through ${formatDate(schedule.valid_to)}`;
    } else if (schedule.valid_from) {
        validText = `, valid starting ${formatDate(schedule.valid_from)}`;
    } else if (schedule.valid_to) {
        validText = `, valid through ${formatDate(schedule.valid_to)}`;
    }

    let tzText = "";
    if (schedule.tz) {
        tzText = ` (${schedule.tz})`;
    }

    return `${recurrenceText} ${timeText}${validText}${tzText}`.trim();
}
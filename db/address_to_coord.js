const { Pool } = require("pg");

const pool = new Pool({
    connectionString: "postgresql://neondb_owner:npg_Cv6Hkfdb4Les@ep-billowing-credit-akljwz06-pooler.c-3.us-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
});

async function geocodeAddress(address) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyDwOAckSrPA6VZD0YS4iJ4I1xFblV0FbFw`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.results || !data.results.length) {
        return null;
    }

    const location = data.results[0].geometry.location;
    return {
        lat: location.lat,
        lng: location.lng
    };
}

async function main() {
    const { rows } = await pool.query(`
    SELECT place_id, address, city
    FROM places
    WHERE latitude IS NULL OR longitude IS NULL
  `);

    for (const place of rows) {
        const fullAddress = `${place.address}, ${place.city}`;
        const coords = await geocodeAddress(fullAddress);

        if (!coords) {
            console.log(`No coordinates found for place_id=${place.place_id}`);
            continue;
        }

        await pool.query(
            `
      UPDATE places
      SET latitude = $1, longitude = $2
      WHERE place_id = $3
      `,
            [coords.lat, coords.lng, place.place_id]
        );

        console.log(`Updated place_id=${place.place_id} -> ${coords.lat}, ${coords.lng}`);
    }

    await pool.end();
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
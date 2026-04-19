DROP TABLE IF EXISTS places;
create table places (
    place_id SERIAL PRIMARY KEY,
    name VARCHAR(40),
    city VARCHAR(30),
    google_place_id text,
    type VARCHAR(20),
    address VARCHAR(60),
    website text,
    image_url text,
    time_start TIMESTAMP,
    time_end TIMESTAMP
);
create table resources(
    resource_id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    description text,
    contact_info text,
    email text,
    phone text,
    website text
);

DROP TABLE IF EXISTS place_items;
create table place_items (
    place_item_id SERIAL PRIMARY KEY,
    place_id INTEGER REFERENCES places(place_id),
    item varchar(20)
);

create table place_schedules (
    schedule_id serial primary key,
    place_id int references places(place_id),
    tz text not null,
    rrule text not null,           -- iCal RRULE string
    time_start time not null,
    time_end time not null,
    valid_from date,
    valid_to date
);

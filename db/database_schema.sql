DROP TABLE IF EXISTS places;
create table places (
    place_id SERIAL PRIMARY KEY,
    name text,
    city text,
    description text,
    type text,
    address text,
    website text,
    image_url text,
    latitude double precision,
    longitude double precision
);

drop table if exists resources;
create table resources(
    resource_id SERIAL PRIMARY KEY,
    name text,
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

Drop table if exists place_schedules;
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

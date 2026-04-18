-- Weekly: Mon/Wed/Fri 9:00–17:00, Pacific time
insert into place_schedules
  (place_id, tz, rrule, time_start, time_end, valid_from, valid_to)
values
  (1, 'America/Los_Angeles', 'FREQ=WEEKLY;BYDAY=MO,WE,FR', '09:00', '17:00', '2026-01-01', null);

-- Bi-weekly: every other Saturday 10:00–14:00
insert into place_schedules
  (place_id, tz, rrule, time_start, time_end, valid_from, valid_to)
values
  (2, 'America/Los_Angeles', 'FREQ=WEEKLY;INTERVAL=2;BYDAY=SA', '10:00', '14:00', '2026-02-01', null);

-- Monthly: first Tuesday 18:00–21:00
insert into place_schedules
  (place_id, tz, rrule, time_start, time_end, valid_from, valid_to)
values
  (3, 'America/Los_Angeles', 'FREQ=MONTHLY;BYDAY=TU;BYSETPOS=1', '18:00', '21:00', '2026-01-01', null);

-- Monthly: 15th and 30th 08:00–12:00
insert into place_schedules
  (place_id, tz, rrule, time_start, time_end, valid_from, valid_to)
values
  (4, 'America/Los_Angeles', 'FREQ=MONTHLY;BYMONTHDAY=15,30', '08:00', '12:00', '2026-01-01', null);

-- Bi-monthly: every 2 months on the 1st 11:00–15:00
insert into place_schedules
  (place_id, tz, rrule, time_start, time_end, valid_from, valid_to)
values
  (5, 'America/Los_Angeles', 'FREQ=MONTHLY;INTERVAL=2;BYMONTHDAY=1', '11:00', '15:00', '2026-01-01', null);


INSERT
    (1, 'Blanket'),
    (1, 'Canned Food'),
    (2, 'Water Bottle'),
    (2, 'Sleeping Bag'),
    (3, 'Soap'),
    (3, 'Toothbrush'),
    (4, 'Jacket'),
    (4, 'Socks'),
    (5, 'First Aid Kit'),
    (5, 'Hygiene Kit');
-- Finding Schedule
Select *
from places p
join public.place_schedules ps
    on p.place_id = ps.place_id;
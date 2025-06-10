DROP TABLE IF EXISTS "light_novels";

CREATE TABLE light_novels (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    is_real_title INTEGER NOT NULL
);

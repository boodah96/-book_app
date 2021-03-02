DROP TABLE IF EXISTS books;

CREATE TABLE books(
    id SERIAL PRIMARY KEY,
    img VARCHAR(255),
    title VARCHAR(255),
    authors VARCHAR(255),
    description TEXT
);

INSERT INTO books(description,authors,title,img)
VALUES ('heredis','me','ana','picture');


INSERT INTO books(img,title,authors,description)
VALUES ('new img','boodah96','abdalrhman','discription');


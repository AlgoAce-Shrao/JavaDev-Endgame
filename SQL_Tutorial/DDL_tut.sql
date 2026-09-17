-- Create a new table called persons with columns: id, person name, birth date, and phone
CREATE TABLE persons(
	id INT NOT NULL ,
	person_name VARCHAR(50) NOT NULL,
	birth_date DATE,
	phone VARCHAR(10) NOT NULL,
	CONSTRAINT pk_persons PRIMARY KEY(ID)  -- THIS IS HOW U ACTUALLY DEFINE A PRIMARY KEY
)


-- add a new column called email to the persons table
ALTER TABLE persons
ADD email VARCHAR(50) NOT NULL;

-- new columns by default gets added to the end..but if we want to put it in the middle ..there is not other option rather than dropping the table and creating it again

--remove the column phone from the persons table
ALTER TABLE persons
DROP COLUMN phone;

--DELETE the table persons from the database
DROP TABLE persons;

SELECT * FROM persons;  -- will throw error after dropping
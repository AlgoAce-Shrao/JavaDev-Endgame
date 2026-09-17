INSERT INTO customers (id,first_name,country,score)
VALUES  
	(6,'Shrao','India',NULL),
	(7,'Debi','India',69);

select * from customers;

--copy data from table customers into persons table

INSERT INTO persons(id,person_name,birth_date,phone)
SELECT 
id,
first_name,
NULL,
'Unknown'
FROM customers;

SELECT * FROM persons;

-- change the score of customer with id 6 to zero
UPDATE customers
SET score=0
WHERE id=5;

select * from customers;

-- change the score of customer with id 10 to 0 and update the country to 'Uganda'

UPDATE customers
SET country ='Uganda',
	score=0
WHERE id=7;

-- update all customers with score 0 by setting their score to NULL
UPDATE customers
SET score=NULL
WHERE score=0;



-- reverse this

UPDATE customers 
SET score=0
WHERE score IS NULL;

--Delete all customers with an ID > 5

DELETE FROM customers
WHERE id>5;

-- Delete all data from the persons table
DELETE FROM persons;


select * from customers;

select * from persons;

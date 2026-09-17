-- we know everything about Comparison operators
-- we know everything about logical operators [AND || OR  || NOT]
-- same with RANGE operator[BETWEEN--> for it we need lower boundary and upper boundary both inclusive]
-- same with membership operators ..as in python data analysis
-- LIKE --> used to search for a pattern in a text
-- this is used to filter data on text based data in patterns
USE MyDatabase;

--find all the customers whose firstname starts with M
SELECT * 
FROM customers
WHERE first_name
LIKE 'M%';

--find all the customers whose firstname ends with 'n'
SELECT * 
FROM customers
WHERE first_name LIKE '%n';


--find all the customers whose firstname contains 'r'

SELECT *
FROM customers
WHERE first_name LIKE '%R%';    -- R or r..both interpreted as same...

-- find all the customers whose first name has 'r'  in the third position

SELECT *
FROM customers
WHERE first_name LIKE '__r%';
-- Concatenate first name and country into one column
USE MyDatabase;

--concat implementation

SELECT 
	first_name,
	country,
	CONCAT(first_name,' ',country) as name_country
FROM customers;

-- convert first name to lowercase
--lower implementation

SELECT
	first_name,
	LOWER(first_name) as name_lower
FROM Customers;

-- upper implementation
SELECT
	first_name,
	UPPER(first_name) as name_upper
FROM Customers;

-- Find customers whose first name contains leading or trailing spaces

SELECT 
	first_name
FROM customers
WHERE TRIM(first_name) != first_name;

-- more easier and other implementation

SELECT 
	first_name,
	LEN(first_name) as length_of_original_name,
	LEN(TRIM(first_name)) as length_of_trimmed_name,
	LEN(first_name)-LEN(TRIM(first_name)) as diff
FROM customers
WHERE LEN(first_name) != LEN(TRIM(first_name));

-- remove dashes (-) from a phone number

SELECT 
	'123-456-7890' AS phone,
	REPLACE('123-456-7890','-','') as clean_phone

-- replace file extension from txt to csv

SELECT 
	'report.txt' as txtfile,
	REPLACE('report.txt','txt','csv') as csvfile

-- Retrieve the first two characters of each first name

SELECT 
	first_name,
	LEFT(TRIM(first_name),2) as first_2chars   -- edge case..if trailing and leading spaces present...trim them first
FROM customers;


-- Retrieve the first two characters of each first name


SELECT 
	first_name,
	RIGHT(first_name,2) as first_2chars   -- edge case..if trailing and leading spaces present...trim them first
FROM custOmers;


--  Retrieve a list of customers' first names removing the first character

SELECT 
	first_name,
	SUBSTRING(TRIM(first_name),2,LEN(first_name)) as sub_name
FROM customers;
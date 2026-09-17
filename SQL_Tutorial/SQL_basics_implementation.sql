USE MyDatabase;
SELECT first_name,score,country FROM customers;
-- retrieve customers whose score !=0
select * from customers where score!=0;

-- retrieve customers from germany
select * from customers where country ='Germany';


-- retrieve all customers and sort the results by the highest score first
select * from customers ORDER BY score DESC;

-- retrieve all customers and sort the results by the highest score first
select * from customers ORDER BY score ASC;

-- Nested sorting
SELECT * from customers order by country asc,score desc;

-- find total score by country
select 
	country as customer_by_country,
	sum(score) as total_score   -- naming by using aliases
from customers 
group by country
order by total_score desc;

--find the total score and total number of customers of each country
select 
	country,
	sum(score) as total_score,
	count(id) as num_of_customers
from customers group by country;

select sum(score) from customers;

--Find the average score for each country considering only customers 
--with a score not equal to O (before aggreation..so use where clause)
--And return only those countries with an average score greater than 430 (use having since we need it after aggregation)
 SELECT
	country,
	avg(score) as avg_scr_of_eachCountry
from customers 
where score !=0 
group by country 
having avg(score)>430;

--follow the sequence from the above sequence as well;

-- return unique list of all countries

SELECT DISTINCT country 
FROM customers;

--retrieve only 3 customers

SELECT TOP 3 *
FROM customers;

--retrieve the top 3 customers with the highest scores
SELECT TOP 3 * 
FROM customers 
ORDER BY score DESC;

--- retrieve the lowest 2 customers based on score

SELECT TOP 2 *
FROM customers
ORDER BY score ASC;

-- get the 2 most recent orders
SELECT TOP 2 * 
FROM orders 
ORDER BY order_date DESC;
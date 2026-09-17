-- here we will learn about combining two table data	

USE MyDatabase;

-- 1. implementation of NO JOIN
-- retrieve all data from customers and orders as  separate  results

SELECT * FROM customers;
SELECT * FROM orders;

-- 2. implementation of INNER JOIN
--Get all customers along with their orders, but only for customers who have placed an order
SELECT 
	c.id,
	c.first_name,
	o.order_id,
	c.score,
	o.sales
FROM customers AS c
INNER JOIN orders AS o
ON c.id=o.customer_id;

-- implementation of left join
-- Get all customers along with their orders including those without orders
-- This means left table is the customers table ..while the right table is the orders table

SELECT 
	c.id,
	c.first_name,
	c.score,
	o.sales,
	o.order_date
FROM  orders AS o
LEFT JOIN customers AS c  -- check by swaping the table positions
ON c.id=o.customer_id;

-- implementation of right join

-- Get all customers along with their orders, 
-- including orders without matching customers --> means we need orders that too those which also dont even have valid customers from customers table

SELECT 
	c.id,
	c.first_name,
	c.score,
	o.sales,
	o.order_date
FROM  customers AS c
RIGHT JOIN   orders AS o 
ON c.id=o.customer_id;


-- implementation of full join
-- get all the customers and all orders , even if there's no match 
SELECT * 
FROM customers  as c
FULL JOIN orders as o
on c.id=o.customer_id;

-- Advanced Join commands;
-- LEFT ANTI JOIN:
-- Get all customers who haven't placed any order
-- means get the customers who don't have any matching data in the orders table

SELECT * 
FROM customers as c
LEFT JOIN orders as o
ON c.id=o.customer_id
WHERE o.customer_id IS NULL;


SELECT * FROM customers;
SELECT * FROM ORDERS;

-- righ anti join
-- get all orders without matching customers
-- means get all the orders whose customer entry is null

SELECT * 
FROM  customers as c
RIGHT JOIN orders as o
ON c.id=o.customer_id
WHERE c.id IS NULL;


SELECT * 
FROM   orders as o
LEFT JOIN customers as c
ON c.id=o.customer_id
WHERE c.id IS NULL;


-- Full anti join
-- Find customers without orders and orders without 

SELECT * 
FROM customers as c
FULL JOIN orders as o
ON c.id=o.customer_id
WHERE c.id IS NULL OR  o.customer_id IS NULL;


-- Challenge:

-- Get all customers along with their orders, but only for customers who have placed an order 

SELECT * 
FROM customers as c
INNER JOIN orders as o
ON c.id=o.customer_id;

-- without using inner join

SELECT *
FROM customers as c
FULL JOIN orders as o
ON c.id=o.customer_id
WHERE c.id IS NOT NULL AND  o.customer_id IS NOT  NULL;

-- WITH LEFT JOIN

SELECT * 
FROM customers as c
LEFT JOIN orders as o
ON c.id=o.customer_id
WHERE  o.customer_id IS NOT  NULL;


-- CROSS JOIN
-- generate all possible combinations of customers and orders 
SELECT *
FROM customers
CROSS JOIN orders;


-- Multi join implementations
-- Using SalesDB, Retrieve a list of all orders, along with the related customer, product, and employee details.
-- For each order, display: Order ID, Customer's name, Product name, Sales, Price, Sales person's name 

-- This means Orders table is the main table and the rest are the lookup table


USE SalesDB;

SELECT * FROM Sales.Customers;

SELECT * FROM Sales.Employees;

SELECT * FROM Sales.Orders;

SELECT * FROM Sales.OrdersArchive;

SELECT * FROM Sales.Products;

SELECT 
	o.OrderID as order_id,
	c.FirstName as Customer_first_name,
	c.LastName as Customer_last_name,
	p.Product as product_name,
	o.Sales as sales,
	p.Price as price,
	e.FirstName as sales_person_first_name,
	e.LastName as sales_person_last_name
FROM Sales.Orders as o
LEFT JOIN Sales.Customers as c
ON o.CustomerID=c.CustomerID
LEFT JOIN Sales.Products as p
ON o.ProductID=p.ProductID
LEFT JOIN Sales.Employees as e
ON o.SalesPersonID=e.EmployeeID;

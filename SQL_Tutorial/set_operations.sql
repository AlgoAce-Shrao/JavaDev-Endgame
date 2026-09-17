-- here we will learn about combining data [rows] by using SET oprator
use SalesDB;

SELECT 
	FirstName,
	LastName
FROM Sales.Customers

UNION ALL

SELECT 
	FirstName,
	LastName
FROM Sales.Employees;


-- FIND THE EMPLOYEES WHO ARE NOT THE CUSTOMERS AT THE SAME TIME

SELECT 
	FirstName,
	LastName
FROM Sales.Employees

EXCEPT

SELECT 
	FirstName,
	LastName
FROM Sales.Customers;

--Orders are stored in separate tables (Orders and OrdersArchive).Combine all orders into one report without duplicates.
SELECT * 
FROM Sales.Orders

UNION 

SELECT * 
FROM Sales.OrdersArchive;


-- Orders are stored in separate tables (Orders and OrdersArchive).
--Combine all orders into one report without duplicates.
-- 💡Following best practices

SELECT
    'Orders' as SourceTable, 
	    [OrderID]
      ,[ProductID]
      ,[CustomerID]
      ,[SalesPersonID]
      ,[OrderDate] 
      ,[ShipDate]
      ,[OrderStatus]
      ,[ShipAddress]
      ,[BillAddress]
      ,[Quantity]
      ,[Sales]
      ,[CreationTime]
FROM Sales.Orders as o

UNION

SELECT 
    'OrdersArchive' as SourceTable,
        [OrderID]
      ,[ProductID]
      ,[CustomerID]
      ,[SalesPersonID]
      ,[OrderDate]
      ,[ShipDate]
      ,[OrderStatus]
      ,[ShipAddress]
      ,[BillAddress]
      ,[Quantity]
      ,[Sales]
      ,[CreationTime]
FROM Sales.OrdersArchive
ORDER BY OrderID;
-- Data Formatting
USE SalesDB;

SELECT OrderID,
       CreationTime,
       FORMAT(CreationTime, 'd') AS d,
       -- gets the day
FORMAT(CreationTime, 'dd') AS dd,
       FORMAT(CreationTime, 'ddd') AS ddd,
       FORMAT(CreationTime, 'dddd') AS dddd
FROM   Sales.Orders; -- for month -- NOTE: M is for month , m is for minutes

SELECT OrderID,
       CreationTime,
       FORMAT(CreationTime, 'MM-dd-yyyy') AS USA_format,
       FORMAT(CreationTime, 'dd-MM-yyyy') AS Euro_format,
       FORMAT(CreationTime, 'M') AS M,
       FORMAT(CreationTime, 'MM') AS MM,
       FORMAT(CreationTime, 'MMM') AS MMM,
       FORMAT(CreationTime, 'MMMM') AS MMMM
FROM   Sales.Orders; -- Show CreationTime using the following format: -- Day Wed Jan Q1 2025 12:34:56 PM

SELECT OrderID,
       CreationTime,
       'Day ' + FORMAT(CreationTime, 'ddd MMM') + ' Q' + DATENAME(quarter, CreationTime) + FORMAT(CreationTime, ' yyyy HH:mm:ss tt') AS customFormat
FROM   Sales.Orders; -- aggregate the orders based on the month in the format Jan 25

SELECT   FORMAT(CreationTime, 'MMM yy') AS month,
         COUNT(*) AS orders
FROM     Sales.Orders
GROUP BY FORMAT(CreationTime, 'MMM y'); -- use of convert -- string to integer

SELECT CONVERT (INT, '123') AS [String to Integer CONVERT],
       CONVERT (DATE, '2025-07-08') AS [String to Date CONVERT],
       CreationTime,
       CONVERT (DATE, CreationTime) AS [DateTime to Date CONVERT],
       CONVERT (VARCHAR, CreationTime, 32) AS [USA Std.Style :32],
       CONVERT (VARCHAR, CreationTime, 34) AS [EURO Std.Style :34]
FROM   Sales.Orders; 

 -- USE OF CAST

SELECT CAST ('123' AS INT) AS [string to int],
       CAST (123 AS VARCHAR) AS [int  to varchar],
       CAST('2025-07-08' AS DATE) AS [string to date],
       CAST('2025-07-08' AS datetime2) AS [string to datetime];


-- use of date calculations
-- 1. Dateadd

SELECT 
    OrderID,
    OrderDate,
    DATEADD(year,3,OrderDate) AS [Orders +3 years],
    DATEADD(month,3,OrderDate) AS [Orders +3 months],
    DATEADD(DAY,3,OrderDate) AS [Orders +3 days],
    DATEADD(DAY,-10,OrderDate) AS TenDaysBefore
FROM Sales.Orders;


-- 2.DATEDIFF

SELECT
    OrderID,
    OrderDate,
    ShipDate,
    DATEDIFF(DAY,OrderDate,ShipDate) as TimeSpan
FROM Sales.Orders;

-- calculate the age of the employees

SELECT
    EmployeeID,
    BirthDate,
    CAST(DATEDIFF(year,BirthDate,CAST(GETDATE() AS DATE)) AS VARCHAR) AS AGE
FROM Sales.Employees;

-- find the average shipping duration in days for each month

SELECT 
    DATENAME(month,OrderDate) AS months,
    AVG(DATEDIFF(day,OrderDate,ShipDate)) AS AvgShippingDuration
FROM Sales.Orders
GROUP BY DATENAME(month,OrderDate);

-- find the number of days between each order and the previous order
SELECT
    OrderID,
    OrderDate CurrentOrderDate,
    LAG(OrderDate) OVER (ORDER BY OrderDate) PreviousOrderDate,
    DATEDIFF(day,LAG(OrderDate) OVER (ORDER BY OrderDate),OrderDate) NumberOfDays
FROM Sales.Orders;

-- isdate

SELECT 
    ISDATE('123') datecheck2,
    ISDATE('2025-08-09') datecheck1,
    ISDATE('20-08-2025') datecheck3,   -- since std order not followed
    ISDATE(2025) datecheck4,
     ISDATE(2025) datecheck5,
      ISDATE('08') datecheck6;

-- use of isdate

/*SELECT 
    OrderDate
    isdate(OrderDate),
    CASE WHEN ISDATE(OrderDate)=1 THEN CAST(OrderDate as DATE)
        ELSE '9999-01-01'
    END NewOrderDate
FROM (
SELECT '2025-08-09' AS OrderDate UNION
SELECT '2025-08-01' UNION
SELECT '2025-08-03'  UNION
SELECT '2025-08' 

)

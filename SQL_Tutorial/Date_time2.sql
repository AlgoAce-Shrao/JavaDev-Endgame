USE SalesDB;

SELECT 
	s.OrderDate,
	s.CreationTime,
	YEAR(s.CreationTime) as year ,
	MONTH(s.CreationTime) as month,
	DAY(s.CreationTime) as day,

-- datepart examples

	DATEPART(month,s.CreationTime) as month_dp,
	DATEPART(year,s.CreationTime) as year_dp,
	DATEPART(day,s.CreationTime) as day_dp,
	DATEPART(hour,s.CreationTime) as hour_dp,
	DATEPART(quarter,s.CreationTime) as quarter_dp,
	DATEPART(WEEKDAY,s.CreationTime) as weekDay_dp,
	DATEPART(week,s.CreationTime) as week_dp,

	-- Datename examples

	DATENAME(month,s.CreationTime) as month_dn,
	DATENAME(weekday,s.CreationTime) as weekday_dn,
	DATENAME(week,s.CreationTime) as week_dn,

	-- DateTrunc examples
	DATETRUNC(MINUTE,s.CreationTime) as minute_dt,
	DATETRUNC(MILLISECOND,s.CreationTime) as millisec_dt,
	DATETRUNC(hour,s.CreationTime) as hour_dt,
	DATETRUNC(DAY,s.CreationTime) as day_dt
FROM Sales.Orders as s; 


-- use of datetrunc..

SELECT 
	DATETRUNC(month,CreationTime) as creation,
	Count(*)
FROM Sales.Orders
GROUP BY DATETRUNC(month,CreationTime);


SELECT 
	OrderID,
	CreationTime,
	-- eomonth--> end of month
	EOMONTH(CreationTime) as EndOfMonth,
	CAST(DATETRUNC(month,CreationTime) as DATE) StartOfMonth
FROM Sales.Orders;

-- Need for using dateparts and part extraction 
-- 1. Data Aggreagtion

-- how many orders were places every year?

SELECT 
	DATETRUNC(year,CreationTime) as year_Dt,
	SUM(Sales)
FROM Sales.Orders
GROUP BY DATETRUNC(year,CreationTime);



-- how many orders were places every month?

SELECT 
	CAST(DATETRUNC(month,CreationTime) AS DATE )as month_Dt,
	SUM(Sales)
FROM Sales.Orders
GROUP BY DATETRUNC(month,CreationTime);

-- or 

SELECT 
	MONTH(CreationTime) as month_Dt,
	SUM(Sales)
FROM Sales.Orders
GROUP BY MONTH(CreationTime);

-- DATA FILTERING

-- show all the orders that were placed during the month of february


SELECT 
	DATENAME(month,CreationTime) month_dn,
	OrderId,
	OrderDate,
	Quantity,
	Sales
FROM Sales.Orders
WHERE DATENAME(month,CreationTime) = 'February';

-- or

SELECT 
	*
FROM Sales.Orders
WHERE MONTH(CreationTime) =2;
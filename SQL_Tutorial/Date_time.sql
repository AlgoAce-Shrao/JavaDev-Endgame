Use SalesDB;


SELECT 
	OrderID,
	OrderDate,
	ShipDate,
	CreationTime,
	GETDATE() today
FROM Sales.Orders;
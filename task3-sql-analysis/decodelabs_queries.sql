-- Decode Labs Internship | Task 3: SQL Analysis
-- Author: Favour Secondus
-- Database: PostgreSQL 18 | Table: decodelabs (1,200 e-commerce orders, Jan 2023 - Jun 2025)

-- Query 1: Orders above 1,000 (highest first)

SELECT orderid, date, product, quantity, unitprice, orderstatus, totalprice, paymentmethod
FROM decodelabs
WHERE totalprice > 1000
ORDER BY totalprice DESC;


-- Query 2: Total revenue by product
SELECT product, SUM(totalprice) AS total_revenue
FROM decodelabs
GROUP BY product
ORDER BY total_revenue DESC;


-- Query 3: Total revenue by month (all years combined)
SELECT EXTRACT(MONTH FROM date) AS month,
       SUM(totalprice) AS total_revenue
FROM decodelabs
GROUP BY month
ORDER BY total_revenue DESC;


-- Query 4: Realized revenue by month (Delivered orders only)
SELECT EXTRACT(MONTH FROM date) AS month,
       SUM(totalprice) AS realized_revenue
FROM decodelabs
WHERE orderstatus = 'Delivered'
GROUP BY month
ORDER BY realized_revenue DESC;


-- Query 5: Five months with the lowest revenue
SELECT EXTRACT(MONTH FROM date) AS month,
       SUM(totalprice) AS total_revenue
FROM decodelabs
GROUP BY month
ORDER BY total_revenue ASC
LIMIT 5;


-- Query 6: Number of orders by status
SELECT orderstatus, COUNT(*) AS total_orders
FROM decodelabs
GROUP BY orderstatus
ORDER BY total_orders DESC;

-- Query 7: Total revenue, average order value and order count
SELECT SUM(totalprice) AS total_revenue,
       AVG(totalprice) AS avg_order_value,
       COUNT(*)        AS total_orders
FROM decodelabs;


-- Query 8: Products with total revenue above 150,000
SELECT product, SUM(totalprice) AS total_revenue
FROM decodelabs
GROUP BY product
HAVING SUM(totalprice) > 150000
ORDER BY total_revenue DESC;

-- Query 9: Top 3 products by Delivered revenue
SELECT product, SUM(totalprice) AS delivered_revenue
FROM decodelabs
WHERE orderstatus = 'Delivered'
GROUP BY product
ORDER BY delivered_revenue DESC
LIMIT 3;


-- Query 10: Outlier orders (above the IQR upper bound of 3,333.53 from Task 2)
SELECT orderid, date, product, quantity, unitprice, orderstatus, totalprice
FROM decodelabs
WHERE totalprice > 3333.53
ORDER BY totalprice DESC;


-- Query 11: Cancelled orders by month
SELECT EXTRACT(MONTH FROM date) AS month,
       COUNT(*) AS cancelled_orders
FROM decodelabs
WHERE orderstatus = 'Cancelled'
GROUP BY month
ORDER BY cancelled_orders DESC;


-- Query 12: Revenue by year and month (the data covers Jan 2023 - Jun 2025, so months are not equally represented 
-- in a month-only view; this shows each month in each year)
SELECT EXTRACT(YEAR FROM date)  AS year,
       EXTRACT(MONTH FROM date) AS month,
       SUM(totalprice)          AS total_revenue
FROM decodelabs
GROUP BY year, month
ORDER BY year, month;
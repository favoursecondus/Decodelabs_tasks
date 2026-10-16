
-- Decode Labs Internship | Task 3: Table Setup
-- Author: Favour Secondus
-- Database: PostgreSQL 18 | Table: decodelabs (1,200 e-commerce orders, Jan 2023 - Jun 2025)


-- Table definition
-- ------------------------------------------------------------
DROP TABLE IF EXISTS decodelabs;
CREATE TABLE decodelabs (
    orderid         VARCHAR(15) PRIMARY KEY,
    date            DATE,
    customerid      VARCHAR(15),
    product         VARCHAR(15),
    quantity        INTEGER,
    unitprice       NUMERIC(10,2),
    shippingaddress VARCHAR(50),
    paymentmethod   VARCHAR(15),
    orderstatus     VARCHAR(15),
    trackingnumber  VARCHAR(15),
    itemsincart     INTEGER,
    couponcode      VARCHAR(15),
    referralsource  VARCHAR(15),
    totalprice      NUMERIC(10,2)
);

-- Data was loaded from decodelabs_insert.sql (cleaned dataset from Task 1).
-- Check after loading: expect 1200 rows and total revenue of 1,264,761.96
SELECT 
	COUNT(*) AS total_rows,
	SUM(totalprice) AS total_revenue
FROM decodelabs;

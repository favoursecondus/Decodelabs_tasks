# Task 3: SQL Data Analysis

**Decode Labs Data Analytics Internship | Favour Secondus**

## Overview
I used PostgreSQL to analyze 1,200 e-commerce orders (January 2023 to June 2025). The goal was to find the top-performing products, monthly revenue patterns, the order status mix, and unusually large orders. This task uses the cleaned dataset from [Task 1](../task1-data-cleaning), and the outlier threshold (3,333.53) comes from the EDA in [Task 2](../task2-eda).

## Files in this folder
| File | What it is |
|---|---|
| `DecodeLabs_Task_3_Report.pdf` | Full report: findings, each query with its result, recommendations and limitations |
| `decodelabs_queries.sql` | All 12 queries, commented |
| `decodelabs_table_setup.sql` | Table definition (`CREATE TABLE`) |

## SQL skills used
`SELECT`, `WHERE`, `GROUP BY`, `HAVING`, `ORDER BY`, `LIMIT`, `SUM()`, `AVG()`, `COUNT()`, `EXTRACT()` (month and year)

## Key findings
- Total revenue is **1,264,762** across **1,200 orders**, with an average order value of **1,053.97**.
- **Chair** (195,620) and **Printer** (195,613) are the top two products by revenue and are almost tied.
- **June** is the highest-revenue month (170,616) and **September** is the lowest (69,322).
- Only **231 of 1,200 orders (19.2%)** were delivered, and **41.4%** were cancelled or returned. The five order statuses are close to each other (231 to 250 orders each).
- Among delivered orders only, **Laptop** (40,714) is the top product and **February** is the weakest month (7,592).
- **8 orders** are above the outlier threshold of 3,333.53, and they come from 8 different customers.

## Limitations
- The data runs January 2023 to June 2025, so January to June include three years and July to December only two. Query 12 shows revenue by year and month to account for this.
- The delivered-only monthly ranking is less stable: in 2023 and 2024 alone, October overtakes June.
- There is no repeat-purchase history, so the 8 large orders show large orders only, not loyal customers.

## How to reproduce
1. Create a PostgreSQL database.
2. Run `decodelabs_table_setup.sql` to create the table.
3. Load the cleaned dataset from Task 1 into the `decodelabs` table.
4. Run the queries in `decodelabs_queries.sql` one at a time.

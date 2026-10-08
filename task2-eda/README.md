# Task 2: Exploratory Data Analysis (EDA)

Part of the DecodeLabs Data Analytics Internship.

## Objective
Analyse the cleaned orders dataset (1,200 orders, Jan 2023 – Jun 2025) to find purchasing patterns, trends and outliers.

## Tool
Microsoft Excel (descriptive statistics, IQR outlier detection, pivot tables and pivot charts, correlation)

## Files
- `[your Week 2 file name]`: workbook with the Executive Summary report, pivot tables and charts, the cleaned data and a change log

## Questions explored
- What is the average order size and value?
- Which months generate the most revenue, year by year?
- Are there high-value orders, and what are they like?
- Which factors (Quantity, UnitPrice, ItemsInCart) affect revenue most?

## Key findings
- Mean order value is 1,053.97 and the median is 823.62, so the distribution is right-skewed.
- The IQR method (upper bound 3,333.53) found 8 high-value outliers: all bulk orders of 5 items, from 8 different customers. 4 of the 8 were cancelled or returned, against 41.4% of all orders.
- June was the top revenue month in 2024 and 2025 (May in 2023). There is no consistent slow season.
- Revenue is declining year on year: January–June fell from 286,502 (2023) to 257,059 (2024) to 231,883 (2025), about 10% a year.
- UnitPrice has the strongest correlation with revenue (0.72), ahead of Quantity (0.62) and ItemsInCart (0.39).

## Recommendations
Investigate the revenue decline and order cancellations/returns, test whether high-value customers repeat-buy before building a loyalty program, and stock up before June.

## Limitations
Only 8 outliers; 2025 covers January to June only; no repeat-purchase or demographic data; correlation does not imply causation.

## Skills demonstrated
EDA, outlier detection, pivot tables, correlation analysis, data storytelling, and checking findings year by year.

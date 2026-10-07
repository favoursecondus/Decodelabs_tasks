# Task 1: Data Cleaning & Preparation
Part of the DecodeLabs Data Analytics Internship.

## Objective
Clean and validate a raw e-commerce orders dataset so it is accurate, consistent and ready for analysis.

## Tool Used
Microsoft Excel

## Dataset
- 1,200 orders, January 2023 to June 2025
- 14 columns: OrderID, Date, CustomerID, Product, Quantity, UnitPrice, ShippingAddress, PaymentMethod, OrderStatus, TrackingNumber, ItemsInCart, CouponCode, ReferralSource, TotalPrice

## Files
- `Week_1_decodelabs_data_cleaning_project.xlsx` with three sheets:
  - **Dirty Dataset:** the original raw data
  - **Cleaned Dataset:** the data after cleaning and validation
  - **Change Log:** every change made, its impact, and the verification check
## What I did
1. **Checked for duplicates:** no duplicate OrderIDs found (1,200 unique orders).
2. **Standardised dates** to YYYY-MM-DD.
3. **Set correct data types:** text columns as Text, Quantity as a whole number, UnitPrice and TotalPrice to 2 decimal places.
4. **Handled missing values:** 309 blank CouponCode cells (about 26% of orders) were filled with "NIL" so that orders with no coupon are explicit. No rows were lost.
5. **Checked text consistency** with TRIM and PROPER across the text columns. No inconsistencies were found.
6. **Validated TotalPrice** by recalculating Quantity × UnitPrice with a helper column. All 1,200 rows matched.

## Result
A validated, analysis-ready dataset of 1,200 rows with a fully documented cleaning process.

## Notes
- The TotalPriceCheck helper column is kept in the Cleaned Dataset so the validation can be re-run.
- The raw data was already fairly clean, so the main work was validation, handling the missing coupon codes, and documentation.

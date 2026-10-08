### Task2: Exploratory Data Analysis (EDA)
**Folder:** `task2-eda/`
**Tool:** Microsoft Excel (descriptive statistics, IQR outlier detection, pivot tables, correlation, charts)
**Dataset:** the cleaned 1,200-order dataset from Task 1

**Questions explored**
- What is the typical order value, and how is it distributed?
- Which orders are outliers?
- Which months generate the most revenue?
- Which factors drive revenue most?

**Key findings**
- Mean order value is 1,053.97 and the median is 823.62, so the distribution is right-skewed
- The IQR method (upper bound 3,333.53) flagged 8 high-value outliers, all 5-unit orders priced above 666 each
- 4 of those 8 were cancelled or returned, which is close to the 41% cancellation/return rate across all orders
- June had the highest revenue; September the lowest
- UnitPrice has the strongest correlation with revenue (0.72), ahead of Quantity (0.62) and ItemsInCart (0.39)

**Limitations**
- Only 8 outliers, so conclusions about them are indicative, not conclusive
- Data covers Jan 2023 to Jun 2025, so Jan–Jun are over-represented in monthly totals
- No repeat-purchase or customer demographic data; correlation does not imply causation

**Deliverables:** Excel workbook with pivot tables and charts, plus an Executive Summary report

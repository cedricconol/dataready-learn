/**
 * Sample data for the Python playground and exercises.
 *
 * These CSV strings are the single source of truth for the Python track:
 * they are written to Pyodide's virtual filesystem (so `pd.read_csv("orders.csv")`
 * works in a lesson) and also parsed into the preloaded `customers`, `products`
 * and `orders` DataFrames.
 *
 * They intentionally mirror the SQL track's tables so learners who did SQL first
 * recognise the data, with a few extra rows and missing values that pandas
 * lessons need (a customer with no orders, a missing city, a missing status,
 * a missing amount).
 */

export const CUSTOMERS_CSV = `customer_id,name,email,city,country,signup_date
1,Alice Johnson,alice@example.com,New York,USA,2023-11-02
2,Bob Smith,bob@example.com,London,UK,2023-12-15
3,Carol White,carol@example.com,Sydney,Australia,2024-01-08
4,Dave Brown,dave@example.com,Toronto,Canada,2024-01-20
5,Eve Davis,eve@example.com,New York,USA,2024-02-03
6,Frank Lee,frank@example.com,,USA,2024-01-30
7,Grace Kim,grace@example.com,Seoul,South Korea,2024-02-01
8,Henry Cruz,henry@example.com,Manila,Philippines,2024-02-10
9,Ivy Nakamura,ivy@example.com,Tokyo,Japan,2024-04-02
`;

export const PRODUCTS_CSV = `product_id,name,category,price
1,Laptop,Electronics,999.00
2,Mouse,Electronics,29.99
3,Desk,Furniture,349.00
4,Chair,Furniture,199.00
5,Notebook,Stationery,4.99
6,Monitor,Electronics,249.00
`;

export const ORDERS_CSV = `order_id,customer_id,product_id,order_date,quantity,total_amount,status
1,1,1,2024-01-05,1,999.00,completed
2,1,2,2024-01-10,2,59.98,completed
3,2,3,2024-01-15,1,349.00,completed
4,3,4,2024-01-18,4,796.00,completed
5,4,5,2024-01-22,10,49.90,
6,2,6,2024-01-28,2,498.00,completed
7,1,3,2024-02-01,1,349.00,cancelled
8,5,2,2024-02-04,3,89.97,completed
9,3,1,2024-02-09,1,999.00,pending
10,6,5,2024-02-14,5,24.95,completed
11,2,1,2024-02-18,1,999.00,completed
12,7,6,2024-02-23,1,249.00,completed
13,4,4,2024-02-27,2,398.00,completed
14,8,2,2024-03-02,4,119.96,completed
15,1,6,2024-03-06,1,249.00,completed
16,5,3,2024-03-11,1,349.00,cancelled
17,3,5,2024-03-15,20,99.80,completed
18,7,1,2024-03-19,1,999.00,completed
19,2,4,2024-03-24,1,199.00,completed
20,6,2,2024-03-29,2,59.98,
21,8,3,2024-04-02,1,349.00,completed
22,1,1,2024-04-07,1,999.00,completed
23,4,6,2024-04-12,2,498.00,pending
24,5,5,2024-04-16,15,74.85,completed
25,3,2,2024-04-21,1,29.99,completed
26,7,4,2024-04-26,3,597.00,completed
27,2,5,2024-05-02,8,39.92,completed
28,1,4,2024-05-08,1,199.00,completed
29,8,1,2024-05-14,1,,completed
30,6,6,2024-05-20,1,249.00,completed
`;

/** Column reference shown in the collapsible "Data" panel. */
export const DATASETS = [
  {
    frame: "customers",
    rows: 9,
    columns: [
      { name: "customer_id", type: "int64", note: "key" },
      { name: "name", type: "str" },
      { name: "email", type: "str" },
      { name: "city", type: "str", note: "has NaN" },
      { name: "country", type: "str" },
      { name: "signup_date", type: "datetime64[us]" },
    ],
  },
  {
    frame: "products",
    rows: 6,
    columns: [
      { name: "product_id", type: "int64", note: "key" },
      { name: "name", type: "str" },
      { name: "category", type: "str" },
      { name: "price", type: "float64" },
    ],
  },
  {
    frame: "orders",
    rows: 30,
    columns: [
      { name: "order_id", type: "int64", note: "key" },
      { name: "customer_id", type: "int64", note: "fk" },
      { name: "product_id", type: "int64", note: "fk" },
      { name: "order_date", type: "datetime64[us]" },
      { name: "quantity", type: "int64" },
      { name: "total_amount", type: "float64", note: "has NaN" },
      { name: "status", type: "str", note: "has NaN" },
    ],
  },
];

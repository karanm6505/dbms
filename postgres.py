import psycopg2

conn = psycopg2.connect(
    dbname="karan",
    user="karan",
    password="",
    host="localhost",
    port="5432"
)

# Open a cursor to perform database operations
cur = conn.cursor()

# Example: Create table
cur.execute("""
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name TEXT,
    price NUMERIC
)
""")

# Example: Insert data
cur.execute("""
INSERT INTO products (name, price) VALUES (%s, %s)
""", ("Laptop", 799.99))

# Commit the transaction
conn.commit()

# Example: Fetch data
cur.execute("SELECT * FROM products")
rows = cur.fetchall()
for row in rows:
    print(row)

# Clean up
cur.close()
conn.close()


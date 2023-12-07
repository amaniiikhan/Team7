import sqlite3 as db

conn = db.connect('user_login.db')

cursor = conn.cursor()

# creates table for username, password, then email
cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
    )
''')

# adding a user to the database
def add_user(username, password, email):
    try:
        cursor.execute('INSERT INTO users (username, password) VALUES (?, ?, ?)', (username, password, email))
        conn.commit()
        print("User added successfully!")
    except db.IntegrityError as e:
        print(f"Failed to add user: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")

# verifies it's correct
def verify_user(username, password):
    cursor.execute('SELECT * FROM users WHERE username = ? AND password = ?', (username, password))
    user = cursor.fetchone()
    if user:
        print("Login successful!")
    else:
        print("Invalid username or password")

conn.close()
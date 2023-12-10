import sqlite3

def create_user_table(conn):
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL
        )
    ''')
    conn.commit()

def create_database():
    conn = sqlite3.connect('user_login.db')
    create_user_table(conn)
    conn.close()

if __name__ == "__main__":
    create_database()
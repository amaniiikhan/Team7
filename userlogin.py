from flask import Flask, render_template, request, redirect, url_for
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

# function that connects to the database (user_login.db will be created)from create_db.py
def get_db_connection():
    conn = sqlite3.connect('user_login.db')
    conn.row_factory = sqlite3.Row 
    return conn

# function that creates the user in the database
def create_user(username, password, email):
    conn = get_db_connection()
    cursor = conn.cursor()

    # not storing passwrod in database, but hashing it for security
    hashed_password = generate_password_hash(password)

    try:
        cursor.execute('INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
                       (username, hashed_password, email))
        conn.commit()
        return True
    except sqlite3.IntegrityError as e:
        conn.rollback()
        return False
    finally:
        conn.close()

# routes the signup process, & handles errors like username taken
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    error_message = None

    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        email = request.form['email']

        if create_user(username, password, email):
            return redirect(url_for('aftersignup'))  # redirects to aftersignup.html

        else:
            error_message = 'Username or email already exists'

    return render_template('homepage.html', error=error_message)

# helper func; gets user data by the username
def get_user_by_username(username):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
    user = cursor.fetchone()
    conn.close()
    return user

# routes the login process; 
@app.route('/login', methods=['GET', 'POST'])
def login():
    error_message = None

    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        # uses get_user func to receive data
        user = get_user_by_username(username)

        if user and check_password_hash(user['password'], password):
            # successful login:
            return redirect(url_for('afterlogin'))  # goes to after login page
        else:
            error_message = 'Incorrect username or password'

    return render_template('login.html', error=error_message)

# route to after sign up page
@app.route('/aftersignup')
def aftersignup():
    return render_template('aftersignup.html')

# routes to after login page
@app.route('/afterlogin')
def afterlogin():
    return render_template('afterlogin.html')

if __name__ == '__main__':
    app.run(debug=True)



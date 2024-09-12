from flask import Flask, render_template, redirect, url_for, request, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin, LoginManager, login_user, login_required, logout_user, current_user

# Initialize Flask app and config
app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'

# Initialize database and login manager
db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# Define User model
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)
    age = db.Column(db.Integer)
    interest = db.Column(db.String(150))

# Load user for login management
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Home page with Sign Up and Sign In buttons
@app.route('/')
def home():
    return render_template('home.html', site_name="PairNest")

# Sign up route
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        age = request.form['age']
        interest = request.form['interest']

        new_user = User(username=username, password=password, age=age, interest=interest)
        db.session.add(new_user)
        db.session.commit()

        login_user(new_user)
        return redirect(url_for('profiles'))

    return render_template('signup.html')

# Login route
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        user = User.query.filter_by(username=username).first()

        if user and user.password == password:
            login_user(user)
            return redirect(url_for('profiles'))
        else:
            flash('Invalid username or password')

    return render_template('login.html')

# Profiles route to display all users
@app.route('/profiles')
@login_required
def profiles():
    users = User.query.all()
    return render_template('profiles.html', users=users)

# Individual profile page
@app.route('/profile/<int:user_id>')
@login_required
def profile(user_id):
    user = User.query.get_or_404(user_id)
    return render_template('profile.html', user=user)

# Logout route
@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('home'))

# Main function to run the app and create database
if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Creates the database and tables
    app.run(debug=True)

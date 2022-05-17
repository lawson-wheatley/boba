import flask
from flask import Flask, render_template

app = Flask(__name__, template_folder='templates', static_folder='static')

@app.route("/login")
def signin():
    return render_template("login.html")

@app.route("/register")
def login():
    return render_template("register.html")

@app.route("/")
def home():
    return render_template("home.html")

@app.route("/notifications")
def notifications():
    return render_template("notifications.html")

@app.route("/us/<id>")
def user_profile(id):
    return render_template("profile.html")

@app.route("/profile")
def profile():
    return render_template("profile.html")

@app.route("/search", methods=["GET"])
def search():
    return render_template("search.html")

@app.route("/p/<id>")
def post():
    return render_template("viewpost.html")

@app.route("/upload")
def upload():
    return render_template("upload.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
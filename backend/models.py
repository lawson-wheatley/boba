from datetime import datetime
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

from sqlalchemy.sql import func

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key = True)
    
    username = db.Column(db.String(40), unique=True, nullable=False)
    displayName = db.Column(db.String(40), unique=False, nullable=False)
    
    email = db.Column(db.String(80), unique=True, nullable=False)
    # validated = db.Column(db.Boolean, default=False, server_default = 'f', nullable = False)
    password = db.Column(db.String(128), unique=False, nullable=False)
    salt = db.Column(db.String(32), unique=False, nullable=False)
    
    joined = db.Column(db.DateTime(timezone=True), server_default=func.now())
    lastlogin = db.Column(db.DateTime(timezone=True), server_default=func.now())
    
    posts = db.relationship('Post', backref = 'userp', lazy = True)
    comments = db.relationship('Comment', backref = 'userc', lazy = True)
    likes = db.relationship('Like', backref = 'userl', lazy = True)
    
    picture = db.Column(db.String, nullable = True)
    
    
class Followers(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    user = db.Column(db.Integer, db.ForeignKey('user.id'))
    followers = db.Column(db.Integer, db.ForeignKey('user.id'))

class Following(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    user = db.Column(db.Integer, db.ForeignKey('userfolg.id'))
    follower = db.Column(db.Integer, db.ForeignKey('user'))
    
class Post(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    poster = db.Column(db.Integer, db.ForeignKey('userp.id'))
    flocation = db.Column(db.String(120), unique=True, nullable=False)
    timestamp = db.Column(db.DateTime(timezone=True), server_default=func.now())
    comments = db.relationship('Comments', backref = "postc", lazy = True)
    likes = db.relationship('Likes', backref = "postl", lazy = True)
    
class Comments(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    db.Column(db.Integer, db.ForeignKey('postc.id'))
    comment_indiv = db.relationship('Comment', backref = "comments", lazy = True)

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    text = db.Column(db.String(140), nullable=False)
    db.Column(db.Integer, db.ForeignKey('comments.id'))
    db.Column(db.Integer, db.ForeignKey('userc.id'))
    timestamp = db.Column(db.DateTime(timezone=True), server_default=func.now())
    
class Likes(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    db.Column(db.Integer, db.ForeignKey('postl.id'))
    comment_indiv = db.relationship('Like', backref = "likes", lazy = True)

class Like(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    text = db.Column(db.String(140), nullable=False)
    db.Column(db.Integer, db.ForeignKey('likes.id'))
    db.Column(db.Integer, db.ForeignKey('userl.id'))
    timestamp = db.Column(db.DateTime(timezone=True), server_default=func.now())
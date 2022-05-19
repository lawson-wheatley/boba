from datetime import datetime
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

from sqlalchemy.sql import func

db = SQLAlchemy()




class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key = True)
    
    username = db.Column(db.String(40), unique=True, nullable=False)
    displayName = db.Column(db.String(40), unique=False, nullable=False)
    
    email = db.Column(db.String(80), unique=True, nullable=False)
    # validated = db.Column(db.Boolean, default=False, server_default = 'f', nullable = False)
    password = db.Column(db.String(128), unique=False, nullable=False)
    salt = db.Column(db.String(32), unique=False, nullable=False)
    
    joined = db.Column(db.DateTime(timezone=True), server_default=func.now())
    lastlogin = db.Column(db.DateTime(timezone=True), server_default=func.now())
    following = db.relationship(
        'User', lambda: user_following,
        primaryjoin=lambda: User.id == user_following.c.user_id,
        secondaryjoin=lambda: User.id == user_following.c.following_id,
        backref='followers'
    )
    
    picture = db.Column(db.String, nullable = True)

user_following = db.Table(
    'user_following', db.metadata,
    db.Column('user_id', db.Integer, db.ForeignKey(User.id), primary_key=True),
    db.Column('following_id', db.Integer, db.ForeignKey(User.id), primary_key=True)
)

class community(db.Model):
    __tablename__ = "community"
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(40), unique=True, nullable=False)

    
class Post(db.Model):
    __tablename__ = "posts"
    id = db.Column(db.Integer, primary_key = True)
    community = db.Column(db.String(80), nullable = True)
    posttitle = db.Column(db.String(80), nullable = False)
    poster = db.Column(db.Integer, db.ForeignKey('users.id'))
    isText = db.Column(db.Boolean, nullable = False)
    flocation = db.Column(db.String(120), nullable = True)
    content = db.Column(db.String(500), nullable = True)
    timestamp = db.Column(db.DateTime(timezone=True), server_default=func.now())
    comments = db.relationship('Comments', back_populates="post", uselist=False)
    likes = db.relationship('Likes', back_populates="post", lazy = True)
    
class Comments(db.Model):
    __tablename__ = "comments"
    id = db.Column(db.Integer, primary_key = True)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'))
    post = db.relationship("Post", back_populates="comments")
    coms = db.relationship("Comment", back_populates="comments")

class Comment(db.Model):
    __tablename__ = "comment"
    id = db.Column(db.Integer, primary_key = True)
    comments_id = db.Column(db.Integer, db.ForeignKey('comments.id'))
    comments = db.relationship("Comments", back_populates="coms")
    text = db.Column(db.String(140), nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    timestamp = db.Column(db.DateTime(timezone=True), server_default=func.now())
    
class Likes(db.Model):
    __tablename__ = "likes"
    id = db.Column(db.Integer, primary_key = True)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'))
    post = db.relationship("Post", back_populates="likes")
    likm = db.relationship("Like")

class Like(db.Model):
    __tablename__ = "like"
    id = db.Column(db.Integer, primary_key = True)
    text = db.Column(db.String(140), nullable=False)
    owner = db.Column(db.Integer, db.ForeignKey('users.id'))
    timestamp = db.Column(db.DateTime(timezone=True), server_default=func.now())
    likes_id = db.Column(db.Integer, db.ForeignKey('likes.id'))
    
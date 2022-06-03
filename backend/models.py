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
    moderating = db.relationship("Community",
                    secondary="user_moderating")
    
    comm_following = db.relationship("Community",
                    secondary="user_following_community")
    
    picture = db.Column(db.String, nullable = True)


user_following = db.Table(
    'user_following', db.metadata,
    db.Column('user_id', db.Integer, db.ForeignKey(User.id), primary_key=True),
    db.Column('following_id', db.Integer, db.ForeignKey(User.id), primary_key=True)
)

class Community(db.Model):
    __tablename__ = "community"
    id = db.Column(db.Integer, primary_key = True)
    color = db.Column(db.String(6), unique = False, nullable = True, default="9e9e9e")
    name = db.Column(db.String(40), unique=True, nullable=False)
    picture = db.Column(db.String, nullable = True)
    
user_moderating = db.Table(
    "user_moderating", db.metadata,
    db.Column('user_id', db.Integer, db.ForeignKey(User.id), primary_key=True),
    db.Column('community_id', db.Integer, db.ForeignKey(Community.id), primary_key=True)
)
user_following_community = db.Table(
    "user_following_community", db.metadata,
    db.Column('user_id', db.Integer, db.ForeignKey(User.id), primary_key=True),
    db.Column('community_id', db.Integer, db.ForeignKey(Community.id), primary_key=True)
)

class Notification(db.Model):
    __tablename__ = "notification"
    id = db.Column(db.Integer, primary_key = True)
    post = db.Column(db.Integer, db.ForeignKey("posts.id"))
    action = db.Column(db.String(7), nullable= False)
    like = db.Column(db.Integer, db.ForeignKey("like.id"))
    comment = db.Column(db.Integer, db.ForeignKey("posts.id"))
    notifies = db.Column(db.Integer, db.ForeignKey("users.id"))
    notifier = db.Column(db.Integer, db.ForeignKey("users.id"))
    timestamp = db.Column(db.DateTime(timezone=True), server_default=func.now())

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
    likes = db.relationship('Like', lazy = True)
    commes = db.relationship('Post', order_by='Post.timestamp.desc()')
    parent = db.Column(db.Integer, db.ForeignKey("posts.id"))

class Like(db.Model):
    __tablename__ = "like"
    id = db.Column(db.Integer, primary_key = True)
    text = db.Column(db.String(140), nullable=False)
    owner = db.Column(db.Integer, db.ForeignKey('users.id'))
    timestamp = db.Column(db.DateTime(timezone=True), server_default=func.now())
    post = db.Column(db.Integer, db.ForeignKey('posts.id'))
    
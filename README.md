# 
This project is intended to be a basic photo sharing social media platform akin to instagram, facebook, and others. This is a fairly lightweight platform that can be expanded upon significantly to include many more features. The project uses a RESTful API, React.JS, and Flask.

## Table of Contents
- [Installation](#installaton)
  - [Requirements](#requirements)
  - [Database setup](#database)
- [How to Use](#how-to-use)
  - [Sign In](#sign-in)
  - [Navigation Bar](#Navigation-bar)
  - [Home Page](#home)
  - [Profile Page](#profile)
  - [Followers and Following Pages](#Followers-and-Following)

## Installation
This document is for the instaswatch release 1.0

### Requirements
This project was written with Python 3.8, latest packages.
- requests
- flask
- flask-jwt-extended
- flask-sqlalchemy
- hashlib

These can each be installed via pip.

This project also runs with Node.JS, React.JS, Recoil, and Yarn. Install the latest versions of those.

## How to Use
This website is fairly easy to use, with many design cues taken from other social media websites

### Sign In
Signing in is straight forward, there are only two inputs, email and password. This form also generates a cookie for session storage and passes it to the browser for further authentication purposes.

### Navigation Bar
The navigation bar has the search bar, which searches via a trie that updates with react. It also has buttons for the home page, notifications, posting, and the profile page of the currently signed in user. This element is present on every page besides login, register, and reset password.

### Home
The home page contains the timeline of most recent posts by users the currently signed in user follows. Posts are sorted by latest.

### Profile
The profile page can be accessed by /us/(username). It has the followers amount, following amount, and post amount, along with a time line of the posts that the user posted, again sorted by latest.

### Followers and Following
The followers and following pages are identical and can be accessed by /us/(uID)/followers or /us/(uID)/following), save for what they are querying. The followers queries the user followers, the following queries the user following.



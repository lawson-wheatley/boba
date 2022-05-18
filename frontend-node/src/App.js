import React from "react";
import logo from './logo.svg';
import Notifications from './Notifications';
import Post from './Post';
import Home from './Home';
import Login from './Login';
import Followers from './Followers';
import Following from './Following';
import { BrowserRouter, useState, Routes, Route } from "react-router-dom";
//import Upload from './Upload'

import Profile from './Profile'
function App() {
  return (
  <BrowserRouter>
    <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/" element={<Home />} />
    <Route path="/profile/:id" element={<Profile />} />
    <Route path="/profile/:id:/followers" element={ <Followers /> }/>
    <Route path="/profile/:id:/following" element={ <Following /> }/>
    <Route path="/notifications" element={<Notifications/> }/>
    <Route path="/post/:id" element={<Post />} />
    <Route path="/upload" element={<Upload />} />
    </Routes>
  </BrowserRouter>)
}
export default App;
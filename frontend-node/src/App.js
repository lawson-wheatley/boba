import React from "react";
import logo from './logo.svg';
import Notifications from './Notifications';
import Post from './Post';
import Home from './Home';
import Login from './Login';
import Upload from './Upload';
import Followers from './Followers';
import { RecoilRoot } from "recoil";
import Following from './Following';
import Community from "./Community";
import { BrowserRouter, useState, Routes, Route } from "react-router-dom";
//import Upload from './Upload'

import Profile from './Profile'
import PrivateRoute from "./PrivateRoute";
import CreateCommunity from "./CreateCommunity";
import Bubbles from "./Bubbles";
function App() {
  return (
  <RecoilRoot>
  <BrowserRouter>
    <Routes>
    <Route path="/bubbles/" element={<Bubbles/>} />
    <Route path="/login" element={<Login />} />
    <Route path="/bubble/:id" element={<Community />} />
    <Route path="/createcommunity" element={<CreateCommunity />} />
    <Route path="/" element={<Home />} />
    <Route path="/upload" element={<Upload />} />
    <Route path="/profile/:id" element={<Profile />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/profile/:id:/followers" element={ <Followers /> }/>
    <Route path="/profile/:id:/following" element={ <Following /> }/>
    <Route path="/notifications" element={<Notifications/> }/>
    <Route path="/post/:id" element={<Post />} />

    </Routes>
  </BrowserRouter>
  </RecoilRoot>)
}
export default App;
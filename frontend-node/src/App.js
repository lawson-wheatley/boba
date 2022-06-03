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
import Register from "./Register";
function App() {
  return (
  <RecoilRoot>
  <BrowserRouter>
    <Routes>
    <Route path="/bubbles/" element={<Bubbles/>} />
    <Route path="/login" element={<Login />} />
    <Route path="/bubble/:id" element={<Community />} />
    <Route path="/" element={<Home />} />
    <Route path="/profile/:id" element={<Profile />} />
    <Route path="/profile/:id:/followers" element={ <Followers /> }/>
    <Route path="/profile/:id:/following" element={ <Following /> }/>
    <Route path="/register" element={<Register />} />
    <Route path="/createcommunity" element={<PrivateRoute/> }>
      <Route path="/createcommunity" element={<CreateCommunity />} />
    </Route>
    <Route path="/notifications" element={<PrivateRoute/> }>
      <Route path="/notifications" element={<Notifications/> }/>
    </Route>
    <Route path="/upload" element={<PrivateRoute/>}>
      <Route path="/upload" element={<Upload />} />
    </Route>
    <Route path="/profile" element={<PrivateRoute/>}>
      <Route path="/profile" element={<Profile />} />
    </Route>
    <Route path="/post/:id" element={<Post />} />

    </Routes>
  </BrowserRouter>
  </RecoilRoot>)
}
export default App;
import React from "react";
import logo from './logo.svg';

function Profile() {
  const item = fetchWrapper.get("api.instaswatch.com/post/"+);
    return (
        <div class="center">
            <div class="pad">
            <div class="profile">
                <div id = "profile-pic"></div>
                <img src ={item.picture}></img>
                <div id = "profile-username"></div>
                {item.username}
                <div id = "profile-displayname"></div>
                {item.displayName}
                <div id = "profile-bio"></div>
                {item.bio}
                <div id = "profile-followers"></div>
                <a href = {item.username + "/followers"}></a>
                <div id = "profile-following"></div>
                <a href = {item.username + "/following"}></a>
            </div>
            <div class="profile-posts">
                <div class="feed"></div>
            </div>
        </div>
        </div>
        );
  }
  
export default Profile;
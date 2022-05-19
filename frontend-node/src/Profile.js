import React, { useState } from "react";
import logo from './logo.svg';
import { useFetchWrapper } from "./_helpers";
import { useParams } from "react-router-dom";
import postFeed from "./Post-feed";

function Profile() {
  const fetchWrapper = useFetchWrapper();
  const {id} = useParams();
  const [loaded, finishedLoading] = useState(false);
  const [iid, setId] = useState(id);
  const [userData, setUserdata] = useState([]);
  const [items, setItems] = useState([]);

  if(!iid){
      iid = fetchWrapper.get("http://127.0.0.1:80/current-uid")
      .then(result =>
      {setId(result);})
  }
  else{
  if(!userData){
    fetchWrapper.get("http://127.0.0.1:80/profile/"+id)
    .then(result =>
    {setUserdata(result);})
  } else{
  if(!loaded){
        fetchWrapper.get("http://127.0.0.1:80/profile/"+id+"/feed").then(result => {
          delete result.access_token;
          finishedLoading(true);
          console.log(result);
          setItems(result);
        });
  } else{
    return (
        <div class="center">
            <div class="pad">
            <div class="profile">
                <div id = "profile-pic"></div>
                <img src ={userData.picture}></img>
                <div id = "profile-username"></div>
                {userData.username}
                <div id = "profile-displayname"></div>
                {userData.displayName}
                <div id = "profile-bio"></div>
                {userData.bio}
                <div id = "profile-followers"></div>
                <a href = {"/profile/" + userData.username + "/followers"}></a>
                <div id = "profile-following"></div>
                <a href = {userData.username + "/following"}></a>
            </div>
            <div class="profile-posts">
                <div class="feed">
                {items.map(item => postFeed(item))}
                </div>
            </div>
        </div>
        </div>
        );
    }
  }
}
}
  
export default Profile;
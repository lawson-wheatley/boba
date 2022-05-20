import React, { useState } from "react";
import Home, {likeContent} from "./Home";
import logo from './logo.svg';
import { useFetchWrapper } from "./_helpers";
function PostFeed(item, likeContent) {
  var comment = "";
  console.log(item);
    return (
      <div className="post">
        <div className="post-top"><div><a href={"/profile/"+item.poster}><img className = "post-profile-pic" src={process.env.REACT_APP_API_URL+item.postppic}></img></a></div><div>{item.poster} on <a href={"/bubble/"+item.community}>{item.community}</a></div></div>
        <div className = "ptext">
          <p>
              {item.content}</p>
            </div>
            <div className="image">
            <img className = "post-image" src={process.env.REACT_APP_API_URL+item.flocation}></img>
        </div>
        <div className="bottom">
            <div className ="likes">
              {item.likes}
            </div>
            <div className ="comments">
            </div>
            <button onClick={e => likeContent(item.id)}>why</button>
        </div>
      </div>
    );
  }
  
export default PostFeed;
import React, { useState } from "react";
import Home, {likeContent} from "./Home";
import logo from './logo.svg';
import { useFetchWrapper } from "./_helpers";
function PostFeed(item, likeContent) {
  var comment = "";
  console.log(item);
    return (
      <div className="post">
        <div className="post-top"><div><a href={"/profile/"+item.poster}><img className = "post-profile-pic" src={"http://127.0.0.1:80"+item.postppic}></img></a></div><div>{item.poster} on <a href={"/community/"+item.community}>{item.community}</a></div></div>
        <div className = "ptext">
          <p>
              {item.content}</p>
            </div>
            <div className="image">
            <img className = "post-image" src={"http://127.0.0.1:80"+item.flocation}></img>
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
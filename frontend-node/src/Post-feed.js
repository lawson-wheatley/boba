import React from "react";
import logo from './logo.svg';
import Comment from './Comment';

function postFeed(item) {
  console.log(item);
    return (
      <div className="post">
        <div className="post-top"><a href={"/profile/"+item.poster}><img className = "post-profile-pic" src={"http://127.0.0.1:80"+item.postppic}></img></a>{item.poster} </div>
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
        </div>
      </div>
    );
  }
  
export default postFeed;
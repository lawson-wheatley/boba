import React from "react";
import logo from './logo.svg';
import Comment from './Comment';

function postFeed(item) {
  console.log(item);
    return (
      <div className="post">
        <div className="post-top"><span className="post-title">{item.title}</span> by <a href={"/profile/"+item.poster}>{item.poster}</a></div>
        <div className="image post-image">
            <img className = "post-image" src={"http://127.0.0.1:80"+item.flocation}></img>
        </div>
        <div className="bottom">
            <div className = "ptext">
              Content: {item.content}
            </div>
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
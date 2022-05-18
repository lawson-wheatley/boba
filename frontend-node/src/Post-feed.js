import React from "react";
import logo from './logo.svg';
import Comment from './Comment';

function postFeed(item) {
    const comments = item.comments;
    return (
      <div className="post">
        <div className="image">
            <img src={item.location}></img>
        </div>
        <div className="bottom">
            <div className = "username">
              {item.poster}
            </div>
            <div className = "ptext">
              {item.posttext}
            </div>
            <div className ="likes">
              {item.likes}
            </div>
            <div className ="comments">
              {comments.map(cm => Comment(cm))}
            </div>
        </div>
      </div>
    );
  }
  
export default postFeed;
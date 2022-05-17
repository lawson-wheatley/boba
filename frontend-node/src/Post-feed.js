import React from "react";
import logo from './logo.svg';

function postFeed(item) {
  const fetchWrapper = useFetchWrapper();
  const comments = fetch("api.instaswatch.com/post-comments/"+item.url, {"num":"5"})
    return (
      <div className="post">
        <div className="image">
            <img src={item.location}>

            </img>
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
              {comments.map(cm => comment(cm))}
            </div>
        </div>
      </div>
    );
  }
  
export default postFeed;
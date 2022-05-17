import React from "react";
import logo from './logo.svg';

function Post() {
  const item = fetchWrapper.get("api.instaswatch.com/post/"+);
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
              {comments.map(item => comment(item))}
            </div>
        </div>
      </div>
    );
  }
  
export default Post;
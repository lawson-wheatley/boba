import * as React from "react";
import logo from './logo.svg';
import { useFetchWrapper } from "./_helpers";
import { useParams } from 'react-router-dom';
import Comment from './Comment';

function Post() {
  const fetchWrapper = useFetchWrapper();
  const { id } = useParams();
  const item = fetchWrapper.get("api.instaswatch.com/post/"+id);
    return (
      
      <div className="post">
         <span className="post-title">{item.title}</span>
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
  
export default Post;
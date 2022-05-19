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

            </div>
        </div>
      </div>
    );
  }
  
export default Post;
import * as React from "react";
import logo from './logo.svg';
import { useFetchWrapper } from "./_helpers";
import { useParams } from 'react-router-dom';
import Comment from './Comment';

function Post() {
  const fetchWrapper = useFetchWrapper();
  const { id } = useParams();
  const item = fetchWrapper.get("api.instaswatch.com/post/"+id);
  var comment = "";
  function sub() {
    return fetchWrapper.post(process.env.REACT_APP_API_URL+"/makecomment", {"comment":comment, "id":item.id});
  }
    return (
      <div className="post">
        <div className="post-top"><div><a href={"/profile/"+item.poster}><img className = "post-profile-pic" src={process.env.REACT_APP_API_URL+item.postppic}></img></a></div><div>{item.poster} on <a href={"/community/"+item.community}>{item.community}</a></div></div>
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
            <form onSubmit={sub}>
            <input className="in cl si" type="text" name="title" placeholder="Title" onChange={e => comment = e}></input>
            <input type="submit" style="display:none"></input>
            </form>
        </div>
      </div>
    );
  }
  
export default Post;
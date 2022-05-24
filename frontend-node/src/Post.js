import * as React from "react";
import { useState, useEffect } from "react";
import logo from './logo.svg';
import { useFetchWrapper } from "./_helpers";
import { useParams } from 'react-router-dom';
import Comment from './Comment';
import {useNavigate} from "react-router-dom";



function Post() {
  const history = useNavigate();
  const fetchWrapper = useFetchWrapper();
  const { id } = useParams();
  const [item, setItem] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [getItem, seter] =  useState(false);

  var comment = "";
  function likeContent(id){
    if(item.isLiked){
      item.likes -= 1;
      document.getElementById(id+"like").src = "/img/nolike.svg";
      item.isLiked = false;
    } else{
      item.likes  += 1;
      document.getElementById(id+"like").src = "/img/liked.svg";
      item.isLiked = true;
    }
    fetchWrapper.post(process.env.REACT_APP_API_URL+"/like", {"id":id})
  }
  function sub() {
    return fetchWrapper.post(process.env.REACT_APP_API_URL+"/makecomment", {"comment":comment, "id":item.id});
  }


  if(!getItem){
    seter(true);
  }
  useEffect(() => {fetchWrapper.get(process.env.REACT_APP_API_URL+"/post/"+id).then(result => {setItem(result)});}, [getItem])
  useEffect(() => { setLoaded(true); }, [item]);
    if(loaded){
      console.log(item);
      var likeText = "likes";
      if(item.likes == 1){
        likeText = "like";
      }
      if(!item.isliked){
        var isLikedContent = (<img id={item.id+"like"} className="likeContent" src="/img/nolike.svg"/>);
        var isLiked = false;
      }else{
        isLiked = true;
        isLikedContent = (<img id={item.id+"like"} className="likeContent" src="/img/liked.svg"/>);
      }
      if(item.flocation != null){
        var pinfo = (
          <div className = "pinfo">
            <div className="image">
              <div className="post-image">
            <img className = "pimg" src={process.env.REACT_APP_API_URL+item.flocation}></img></div>
            </div>
            <div className = "ptext"><p>{item.content}</p></div>
            </div>
        );
      }
      else{
        var pinfo = (
        <div className = "pinfo">
          <div className = "ptext">
          <p>
              {item.content}</p>
            </div>
            </div>
        );
      }
      return (
        <div className="postsolopage">
      <div className="postsolo">
        <div className = "back">
        <button className = "backButton" onClick={() => history(-1)}><img className="cbut backContent" src="/img/back.svg"></img></button>
        </div>
        <div className="post-top"><div><a href={"/profile/"+item.poster}><img className = "post-profile-pic" src={process.env.REACT_APP_API_URL+item.postppic}></img></a></div><div>{item.poster} on <a href={"/bubble/"+item.community}>{item.community}</a></div></div>
        <div className="ptitleWrapper"><a className="post-title" href ={"/post/"+item.id}>{item.title}</a></div>
        {pinfo}
        <div className="bottom">
        <button className="cbut" onClick={e => likeContent(item.id)}>{isLikedContent}</button>
          <a className="" href ={"/post/"+item.id}><img className="cbut likeContent" src="/img/comment.svg" /></a>
  
            <div className ="likes">
              {item.likes} {likeText}
            </div>
  
            <div className ="comments">
            </div>
        </div>
        <div className= "makeComment">
              <textarea className="mccomment" rows="1" placeholder="Make a comment..."></textarea>
            </div>
      </div>
      <button className = "postback" onClick={() => history(-1)}></button>
      </div>
    );
    }
}
  
export default Post;
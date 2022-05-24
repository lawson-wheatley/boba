import React, { useState } from "react";
import Home from "./Home";
import logo from './logo.svg';
import { useFetchWrapper } from "./_helpers";
function PostFeed(item, likeContent, commentContent) {
  var comment = "";
  console.log(item);
  var isLikedContent = (<img id={item.id+"like"} lassName="likeContent" src="/img/nolike.svg"/>);
  var isLiked = false;
  if(item.isliked){
      isLiked = true;
      isLikedContent = (<img id={item.id+"like"} className="likeContent" src="/img/liked.svg"/>);
    }
  function setLike(v){
    likeContent(v);
    if (isLiked == true){
      isLiked = false;
      document.getElementById(v+"like").src = "/img/nolike.svg";
      item.likes -= 1;
      if(item.likes == 1){
        likeText = "like";
      }else{
        likeText = "likes"
      }
      document.getElementById(v+"lt").innerHTML = item.likes + " " + likeText;
    } else{
      isLiked = true;
      item.likes += 1;
      if(item.likes == 1){
        likeText = "like";
      } else{
        likeText = "likes"
      }
      document.getElementById(v+"like").src = "/img/liked.svg";
      document.getElementById(v+"lt").innerHTML = item.likes + " " + likeText;
    }
    return render;
  }
  var likeText = "likes";
  if(item.likes == 1){
    likeText = "like";
  }
  if(item.flocation != null){
    var pinfo = (
      <div className = "pinfo">
      <div className = "ptext">
        </div>
        <div className="image">
          <div className="post-image">
        <img className = "pimg" src={process.env.REACT_APP_API_URL+item.flocation}></img></div>
        </div>
        <p>
          {item.content}</p>
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
    var render = (
      <div className="post">
        <div className="post-top"><div><a href={"/profile/"+item.poster}><img className = "post-profile-pic" src={process.env.REACT_APP_API_URL+item.postppic}></img></a></div><div>{item.poster} on <a href={"/bubble/"+item.community}>{item.community}</a></div></div>
        <div className="ptitleWrapper"><a className="post-title" href ={"/post/"+item.id}>{item.title}</a></div>
        {pinfo}
        <div className="bottom">
        <button className="cbut" onClick={e => setLike(item.id)}>{isLikedContent}</button>
          <a className="" href ={"/post/"+item.id}><img className="cbut likeContent" src="/img/comment.svg" /></a>

            <div className ="likes" id = {item.id + "lt"}>
              {item.likes} {likeText}
            </div>

            <div className ="comments">
            </div>
        </div>
        <div className= "makeComment">
              <textarea className="mccomment" rows="1" placeholder="Make a comment..."></textarea>
            </div>
      </div>
    );
    return render;
  }
  
export default PostFeed;
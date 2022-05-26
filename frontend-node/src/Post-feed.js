import React, { useState } from "react";
import Home from "./Home";
import logo from './logo.svg';
import { useFetchWrapper } from "./_helpers";
function PostFeed(item, likeContent, commentContent) {
  var comment = "";
  var isButton = false;
  var pinfo = "";
  var likeText = "likes";
  var isLikedContent = (<img id={item.id+"like"} className="likeContent" src="/img/nolike.svg"/>);
  var isLiked = false;

  function setComment(e){
    comment = e;
    console.log(comment);
    if(comment.length > 0){
      if(!isButton){document.getElementById(item.id + "subm").innerHTML = "<button onClick={commentContent}>Comment</button>"
    isButton = true;}
      document.getElementById(item.id + "cmcounter").innerHTML = comment.length + "/280";
    } else{
      isButton = false;
      document.getElementById(item.id + "cmcounter").innerHTML = "";
      document.getElementById(item.id + "subm").innerHTML = "";
    }
    if(comment.length > 280){document.getElementById(item.id + "cmcounter").classList.add("redText");} else{document.getElementById(item.id + "cmcounter").classList.remove("redText");}
  }
  function keyPress(e){
    if (e.keyCode == 13 && !e.shiftKey) {
      commentContent(comment);
      return true;
    }
  }

  function setLike(v){
    likeContent(v);
    var inter = "";
    if (isLiked == true){
      inter = "/img/nolike.svg";
      isLiked = false;
      item.likes -= 1;
      if(item.likes == 1){likeText = "like"}else{likeText = "likes"}
    } else{
      inter = "/img/liked.svg";
      isLiked = true;
      item.likes += 1;
      if(item.likes == 1){likeText = "like"} else{likeText = "likes"}
    }
    document.getElementById(v+"like").src = inter;
    document.getElementById(v+"lt").innerHTML = item.likes + " " + likeText;
    return render;
  }

  if(item.isliked){
      isLiked = true;
      isLikedContent = (<img id={item.id+"like"} className="likeContent" src="/img/liked.svg"/>);
    }

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
        
        </div>
    );
  }
  else{
    var pinfo = (
    <div className = "pinfo">
      <div className = "ptext">
        </div>
        </div>
    );
  }
    var render = (
      <div className="post" key={"post"+item.id}>
        <div className="post-top"><div><a href={"/profile/"+item.poster}><img className = "post-profile-pic" src={process.env.REACT_APP_API_URL+item.postppic}></img></a></div><div>{item.poster} in <a href={"/bubble/"+item.community}>{item.community}</a> {item.timestamp}</div></div>
        <div className="ptitleWrapper"><a className="post-title" href ={"/post/"+item.id}>{item.title}</a></div>
        {pinfo}
        <div className="bottom">
        <p>{item.content}</p>
        <button className="cbut" onClick={e => setLike(item.id)}>{isLikedContent}</button>
          <a className="" href ={"/post/"+item.id}><img className="cbut likeContent" src="/img/comment.svg" /></a>

            <div className ="likes" id = {item.id + "lt"}>
              {item.likes} {likeText}
            </div>

            <div className ="comments">
            </div>
        </div>
        <div className= "makeComment">
              <span className="mccomment textarea" role="textbox" id ={item.id + "cm"} onInput={e => setComment(e.target.textContent)} contentEditable></span>
              <div id={item.id + "cmcounter"}></div>
              <div id={item.id + "subm"}></div>
            </div>
      </div>
    );
    return render;
  }
  
export default PostFeed;
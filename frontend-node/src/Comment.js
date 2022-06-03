import React from "react";
import logo from './logo.svg';
import { useFetchWrapper } from "./_helpers";


function Comment(item, likeContent, commentContent) {
  var isDisplayed = false;
  var comment = "";
  var isButton = false;
  function displayRep(){
    if(!isDisplayed){
      isDisplayed = true;
      document.getElementById(item.id+"cmrp").style.display = "block";
  } else{
    isDisplayed = false;
    document.getElementById(item.id+"cmrp").style.display = "none";
  }
  
  }
  function setComment(e){
    comment = e;
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

  function comme(){
    if(comment.length != 0){
      commentContent(item.id, comment);
    }
  }
  function unDisp(){
    document.getElementById(item.id+"cmrp").style.display = "none";
  }
  if(!item.isliked){
    var isLikedContent = (<img id={item.id+"like"} className="likeComment" src="/img/nolike.svg"/>);
    var isLiked = false;
  }else{
    isLiked = true;
    isLikedContent = (<img id={item.id+"like"} className="likeComment" src="/img/liked.svg"/>);
  }
    return (
      <div className="comm" key={item.id}>
        <div className="commtop">
          <a href={"/profile/"+item.author}><img className="post-profile-pic" src={process.env.REACT_APP_API_URL +item.authorpic}></img></a>
          <div className="authorName">{item.author} · <div className="tsasdf">{item.tsince}</div></div>

        </div>
        <div className="commLine">
        <div className="commcontent">
        {item.content}
        </div>
        <div className="inputs">
          <button className="xbut likeComment" type="button" onClick={e => likeContent(item.id)}>{isLikedContent}</button>
          <button className="xbut" type="button" onClick={e => displayRep()}><img class="likeComment" src="/img/comment.svg"/></button>
        </div>
        <div className="rep" style={{display:"none"}} id={item.id + "cmrp"}>
          <div className= "makeReply" onBlur={e=> unDisp()}>
              <span className="mcreply textarea" role="textbox" onInput={e => setComment(e.target.textContent)} contentEditable></span>
              <div id={item.id + "cmcounter"}></div>
              <input type="button" id={item.id + "subm"} onClick={e => comme()} value="reply" />
            </div>
        </div>
        <div className="replies">
          {item.replies.map(comment => Comment(comment, likeContent, commentContent))}
        </div>
        </div>
      </div>
    );
  }
export default Comment;
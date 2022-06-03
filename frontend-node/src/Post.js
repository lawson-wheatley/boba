import * as React from "react";
import { useState, useEffect } from "react";
import logo from './logo.svg';
import { useFetchWrapper } from "./_helpers";
import { useParams } from 'react-router-dom';
import Comment from './Comment';
import {useNavigate} from "react-router-dom";



function Post() {
  var isButton = false;
  const history = useNavigate();
  const fetchWrapper = useFetchWrapper();
  const { id } = useParams();
  const [item, setItem] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [getItem, seter] =  useState(false);
  const [comm, setComm] = useState(false);
  const [butto, setButto] = useState("");
  const [commo, setCommo] = useState("");
  const [comments, setComments] = useState([])
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

  function commentContent(id, val){
    fetchWrapper.post(process.env.REACT_APP_API_URL+"/comment", {"comment":val, "post":id}).then(result => {console.log(result)});
  }

  function setComment(e){
    comment = e;
    console.log(comment);
    if(comment.length > 0){
      if(!isButton){
        setButto(<input type="button" onClick={e => setComm(true)} value="Comment"></input>);
    isButton = true;}
      document.getElementById(item.id + "cmcounter").innerHTML = comment.length + "/280";
      setCommo(comment);
    } else{
      isButton = false;
      document.getElementById(item.id + "cmcounter").innerHTML = "";
      setButto("");
    }
    if(comment.length > 280){document.getElementById(item.id + "cmcounter").classList.add("redText");} else{document.getElementById(item.id + "cmcounter").classList.remove("redText");}
  }
  useEffect(() => {if(comm){fetchWrapper.post(process.env.REACT_APP_API_URL+"/comment", {"comment":commo, "post":item.id}).then(result => {console.log(result)});}}, [comm])
  if(!getItem){
    seter(true);
  }
  useEffect(() => {fetchWrapper.get(process.env.REACT_APP_API_URL+"/post/"+id).then(result => {setItem(result)});}, [getItem])
  useEffect(() => {}, [butto]);
  useEffect(() => { fetchWrapper.get(process.env.REACT_APP_API_URL+"/post/"+id+"/comments").then(result => setComments(result)); setLoaded(true); }, [item]);
  useEffect(() => {}, [comments])
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
          <div className="postholder">
            <div className="px">
      <div className="postsolo">
        <div className = "back">
        <button className = "backButton" onClick={() => history(-1)}><img className="cbut backContent" src="/img/back.svg"></img></button>
        </div>
        <div className="post-top"><div><a href={"/profile/"+item.poster}><img className = "post-profile-pic" src={process.env.REACT_APP_API_URL+item.postppic}></img></a></div><div>{item.poster} on <a href={"/bubble/"+item.community}>{item.community}</a></div></div>
        <div className="ptitleWrapper"><a className="post-title" href ={"/post/"+item.id}>{item.title}</a></div>
        {pinfo}
        <div className="bottom">
        <button className="cbut likeContent" onClick={e => likeContent(item.id)}>{isLikedContent}</button>
          <a className="" href ={"/post/"+item.id}><img className="cbut likeContent" src="/img/comment.svg" /></a>
  
            <div className ="likes">
              {item.likes} {likeText}
            </div>
  
        </div>
        <div className= "makeComment">
              <span className="mccomment textarea" role="textbox" id ={item.id + "cm"} onInput={e => setComment(e.target.textContent)} contentEditable></span>
              <div id={item.id + "cmcounter"}></div>
              <div id={item.id + "subm"}>{butto}</div>
            </div>
      </div>
        <div className ="comments">
            {comments.map(comment => Comment(comment, likeContent, commentContent))}
      </div>
      </div>
      </div>
      <button className = "postback" onClick={() => history(-1)}></button>
      </div>
    );
    }
}
  
export default Post;
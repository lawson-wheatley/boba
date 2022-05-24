import React, { useState, useEffect } from "react";
import logo from './logo.svg';
import { useFetchWrapper } from "./_helpers";
import { useParams } from "react-router-dom";
import PostFeed from "./Post-feed";
function Community() {
  const fetchWrapper = useFetchWrapper();
  const {id} = useParams();
  const [loaded, finishedLoading] = useState(false);
  const [communityData, setCommunityData] = useState([]);
  const [iid, setIid] = useState(id);
  const [items, setItems] = useState([]);
  const [file, setFile] = useState("");
  const [upload, setUpload] = useState(false);
  const [filename, setFilename] = useState ("");
  const [color, setColor] = useState("");
  const [changeColor, setChangecolor] = useState(false);
  var vala = "";

  function getBase64(gfile) {
    var reader = new FileReader();
    reader.readAsDataURL(gfile);
    reader.onload = function () {
      var base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
      setFile(base64String);
      setFilename(gfile.name);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
 }
 function likeContent(id){
  fetchWrapper.post(process.env.REACT_APP_API_URL+"/like", {"id":id})
}
  function changeFileEvent(e){
    getBase64(e.target.files[0]);
  }

  function uploa() {
    setUpload(true);
  }
  function coloa(){
    console.log(color);
    setChangecolor(true);
  }

  useEffect(() => { if(upload){fetchWrapper.post(process.env.REACT_APP_API_URL+"/modify-community-pic", {"community":id, "file":file,"filename": filename})} }, [file, filename, upload]);
  useEffect(() => { if(changeColor){fetchWrapper.post(process.env.REACT_APP_API_URL+"/modify-community-color", {"community":id, "color":color}).then(result=>console.log(result))} }, [color, changeColor]);
  useEffect(() => { fetchWrapper.get(process.env.REACT_APP_API_URL+"/get-community/"+iid).then(result =>{setCommunityData(result);}) }, [iid]);

  if(iid && communityData && !loaded){
        fetchWrapper.get(process.env.REACT_APP_API_URL+"/community/"+id+"/feed").then(result => {
          delete result.access_token;
          finishedLoading(true);
          setItems(result);
        });

  } else{
    if (communityData.isMod == 'True'){
      console.log(communityData);
      vala = (
        <div>
        <form className="ch" onSubmit={uploa}>
        <label htmlFor="fiafpa" className="chp cpha">File</label>
        <input style={{visibility:"hidden", display: "none"}} value="" type="file" name="fiafpa" id = "fiafpa" onChange={e => changeFileEvent(e)}/>
        <input className="chp" type="submit"></input>
      </form>
      <form className ="ch" onSubmit={coloa}>
        <input className="chp" title="" type="color" name="file" value={"#"+communityData.color} onChange={e => setColor(e.target.value)}/>
        <input className="chp" type="submit"></input>
        </form>
        </div>

      );
      console.log("HUH");
    }else{}
    return (
        <div className="center">
            <div className="pad">
            <div className="profile" style={{backgroundColor:"#"+communityData.color}}>
                <div className = "profile-pic-div"><img className = "profile-pic" src ={process.env.REACT_APP_API_URL + communityData.picture}></img></div>
                <div className = "pInfo">
                <div className = "profile-username">{communityData.name}</div>
                {vala}
                </div>
            </div>
            <div className="profile-posts centerPos">
                <div className="feed">
                {items.map(item => PostFeed(item, likeContent))}
                </div>
                <div className="create">
    <div className="createpost">
      <img class="mob-navimg moba" src="/img/logo.svg"/>
      <a href="/upload" class="abutton">Create a Post</a>
      <a href="/createcommunity" class="abutton">Create a Community</a>
      </div>
    </div>
            </div>
        </div>
        </div>
        );
  }
}
  
export default Community;
import React, { useState, useEffect } from "react";
import logo from './logo.svg';
import { useFetchWrapper } from "./_helpers";
import { useParams } from "react-router-dom";
import PostFeed from "./Post-feed";
import { Feed } from "./Feed";
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

  function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }
  function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
     ] : [0,0,0];
  }
  
  

  useEffect(() => { if(upload){fetchWrapper.post(process.env.REACT_APP_API_URL+"/modify-community-pic", {"community":id, "file":file,"filename": filename})} }, [file, filename, upload]);
  useEffect(() => { if(changeColor){fetchWrapper.post(process.env.REACT_APP_API_URL+"/modify-community-color", {"community":id, "color":color}).then(result=>console.log(result))} }, [color, changeColor]);
  useEffect(() => { fetchWrapper.get(process.env.REACT_APP_API_URL+"/get-community/"+iid).then(result =>{setCommunityData(result);}) }, [iid]);

  if(iid && communityData){
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
    var loca = "/community/"+id;
    console.log(communityData.color);
    console.log(hexToRgb("#"+communityData.color));
    var vx = hexToRgb("#"+communityData.color);
    var ya = 0.2126*vx[0] + 0.7152*vx[1] + 0.0722*vx[2];
    var caola = ya < 128 ? "#ffffff" : "#000000";
    console.log(caola);
    return (
        <div className="center">
            <div className="pad">
            <div className="profile" style={{backgroundColor:"#"+communityData.color}}>
                <div className = "profile-pic-div"><img className = "profile-pic" src ={process.env.REACT_APP_API_URL + communityData.picture}></img></div>
                <div className = "pInfo">
                <div className = "profile-username" style={{color:caola}}>{communityData.name}</div>
                {vala}
                </div>
            </div>
            <div className="profile-posts centerPos">
                <Feed location={loca}/>
                <div className="create">
    <div className="createpost">
      <img className="mob-navimg moba" src="/img/logo.svg"/>
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
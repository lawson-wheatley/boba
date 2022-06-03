import React, { useState, useEffect } from "react";
import logo from './logo.svg';
import { useFetchWrapper } from "./_helpers";
import { useParams } from "react-router-dom";
import { Feed } from "./Feed";
import PostFeed from "./Post-feed";
import { setLocale } from "yup";
import { render } from "react-dom";

function Profile() {
  const fetchWrapper = useFetchWrapper();
  const {id} = useParams();
  const [loaded, finishedLoading] = useState(false);
  const [iid, setId] = useState(id);
  const [userData, setUserdata] = useState([]);
  const [items, setItems] = useState([]);
  const [file, setFile] = useState("");
  const [upload, setUpload] = useState(false);
  const [filename, setFilename] = useState ("");
  const [vala, setVal] = useState(false);
  const [loca, setLoca] = useState("");
  const [xa, setXA] = useState("");
  let profile = "";

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
  console.log(process.env.REACT_APP_API_URL+"/modifyppic");
  useEffect(() => { 
    if(upload){
      fetchWrapper.post(process.env.REACT_APP_API_URL+"/modifyppic",{"file":file,"filename": filename})
    }
  }, [file, filename, upload]);
  if(!iid){
      fetchWrapper.get(process.env.REACT_APP_API_URL+"/get-username")
      .then(result =>
      {setId(result.username);
        console.log(result.username);
    })
  }
  useEffect(() => { if(iid){fetchWrapper.get(process.env.REACT_APP_API_URL+"/get-profile/"+iid).then(result =>{
    setLoca("/profile/"+result.username); setUserdata(result);})}}, [iid]);
  useEffect(() => {if(loca!= ""){setXA(<Feed location={loca}/>)}}, [loca]);
  useEffect(() => {}, [xa]);
  if(iid && userData){
    console.log(userData);
    if (!id && !vala){
      setVal(
        <form className="ch" onSubmit={uploa}>
        <label htmlFor="fiafpa" className="chp cpha">File</label>
        <input style={{visibility:"hidden", display: "none"}} value="" type="file" name="fiafpa" id = "fiafpa" onChange={e => changeFileEvent(e)}/>
        <input className="chp" type="submit"></input>
        </form>
      );
    }
    console.log(loca);
    return (
      <div className="center">
        <div className="pad">
          <div className="profile">
            <div className = "profile-pic-div"><img className = "profile-pic" src ={process.env.REACT_APP_API_URL + userData.picture}></img></div>
            <div className = "pInfo">
              <div className = "profile-username">{userData.username}</div>
                {vala}
              <form className="lf" ></form>
                <div id = "profile-displayname"></div>
                {userData.displayName}
                <div id = "profile-bio"></div>
                {userData.bio}
                <div id = "profile-followers"></div>
                <a href = {"/profile/" + userData.username + "/followers"}></a>
                <div id = "profile-following"></div>
                <a href = {"/"+ userData.username + "/following"}></a>
              </div>
            </div>
            <div className="profile-posts centerPos">
              {xa}
            </div>
        </div>
        </div>
        );
  }
}
  
export default Profile;
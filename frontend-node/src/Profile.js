import React, { useState, useEffect } from "react";
import logo from './logo.svg';
import { useFetchWrapper } from "./_helpers";
import { useParams } from "react-router-dom";
import postFeed from "./Post-feed";

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
  const [vala, setVal] = useState("");
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
  function changeFileEvent(e){
    getBase64(e.target.files[0]);
  }
  function uploa() {
    setUpload(true);
  }
  useEffect(() => { if(upload){fetchWrapper.post("http://127.0.0.1:80/modifyppic", {"file":file,"filename": filename})} }, [file, filename, upload]);
  if(!iid){
      fetchWrapper.get("http://127.0.0.1:80/get-username")
      .then(result =>
      {setId(result.username);
        console.log(result.username);
    })
  }
  if(iid && !userData){
    fetchWrapper.get("http://127.0.0.1:80/profile/"+iid)
    .then(result =>
    {setUserdata(result);})
  }
  if(iid && userData && !loaded){
        fetchWrapper.get("http://127.0.0.1:80/profile/"+iid+"/feed").then(result => {
          delete result.access_token;
          finishedLoading(true);
          setItems(result);
        });
  } else{
    if (!id && !vala){
      setVal(
        <form className="lf" onSubmit={uploa}>
        <input className="bt in" type="file" name="file" onChange={e => changeFileEvent(e)}/>
        <input className="bt in" type="submit"></input>
      </form>
      );
      console.log("Form loaded...");
    }
    return (
        <div className="center">
            <div className="pad">
            <div className="profile">
                <div id = "profile-pic"><img src ={"http://127.0.0.1:80/" + userData.picture}></img></div>
                {vala}
                <form className="lf" ></form>
                <div id = "profile-username"></div>
                {userData.username}
                <div id = "profile-displayname"></div>
                {userData.displayName}
                <div id = "profile-bio"></div>
                {userData.bio}
                <div id = "profile-followers"></div>
                <a href = {"/profile/" + userData.username + "/followers"}></a>
                <div id = "profile-following"></div>
                <a href = {userData.username + "/following"}></a>
            </div>
            <div className="profile-posts centerPos">
                <div className="feed">
                {items.map(item => postFeed(item))}
                </div>
            </div>
        </div>
        </div>
        );
    }
}
  
export default Profile;
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

  function changeFileEvent(e){
    getBase64(e.target.files[0]);
  }

  function uploa() {
    setUpload(true);
  }

  useEffect(() => { if(upload){fetchWrapper.post("http://127.0.0.1:80/modify-community-pic", {"community":id, "file":file,"filename": filename})} }, [file, filename, upload]);
  useEffect(() => { fetchWrapper.get("http://127.0.0.1:80/get-community/"+iid).then(result =>{setCommunityData(result);}) }, [iid]);

  if(iid && communityData && !loaded){
        fetchWrapper.get("http://127.0.0.1:80/community/"+id+"/feed").then(result => {
          delete result.access_token;
          finishedLoading(true);
          setItems(result);
        });

  } else{
    if (communityData.isMod == 'True'){
      vala = (
        <form className="ch" onSubmit={uploa}>
        <input className="chp" title="" value="" type="file" name="file" onChange={e => changeFileEvent(e)}/>
        <input className="chp" type="submit"></input>
      </form>
      );
      console.log("HUH");
    }else{}
    return (
        <div className="center">
            <div className="pad">
            <div className="profile">
                <div className = "profile-pic-div"><img className = "profile-pic" src ={"http://127.0.0.1:80/" + communityData.picture}></img></div>
                <div className = "pInfo">
                <div className = "profile-username">{communityData.name}</div>
                {vala}
                </div>
            </div>
            <div className="profile-posts centerPos">
                <div className="feed">
                {items.map(item => PostFeed(item))}
                </div>
            </div>
        </div>
        </div>
        );
  }
}
  
export default Community;
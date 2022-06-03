import React, {useEffect, useState} from "react";

import logo from './logo.svg';
import { useFetchWrapper } from "./_helpers";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

function Upload(item) {
  const fetchWrapper = useFetchWrapper();
  const [community, setCommunity] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState("");
  const [text, setText] = useState("");
  const [filename, setFilename] = useState ("");
  const [items, setItems] = useState([]);
  const [upload, setUpload] = useState(false);
  function getBase64(file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      var base64String = reader.result.replace("data:", "")
      .replace(/^.+,/, "");
      setFile(base64String);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
 }

  function changeFileEvent(e){
    console.log("WHAT");
    setFilename(e.target.files[0].name);
    getBase64(e.target.files[0]);
  }
  function uploa() {
    return fetchWrapper.post(process.env.REACT_APP_API_URL+"/upload", {"file":file,"filename": filename, "title":title,"community":community, "text":text}).then(result=> {console.log(result);});
  }

  useEffect(()=>{if(upload){uploa()}}, [upload])
  function seCommunity(e){
    setCommunity(e);
    if(e.length == 0){
      document.getElementById("searchAutocomplete").style = "display: none;"
    } else{
      document.getElementById("searchAutocomplete").style = "display: block;"
    }
    fetchWrapper.get(process.env.REACT_APP_API_URL+"/search-communities?query="+e).then(result => {if(result.length != 0){setItems(result)} else{ setItems(["No results found."])}});

  }
  function settCommunity(v){
    seCommunity(v);
    document.getElementById("community").value = v;
    document.getElementById("searchAutocomplete").style = "display: none;"
  }
  useEffect(()=>{}, [items]);
  return (

      <div className="login-containerv">
          <div className = "login-containerh">
    <div className="container-bubble">
          <div className="loginform lf">
              <form className="lf">
                  <input className="in cl si" type="text" name="title" placeholder="Title" onChange={e => setTitle(e.target.value)}></input>

                  <input className="in cl si" autocomplete="off" id="community" type="text" name="community" placeholder="Community" onChange={e => seCommunity(e.target.value)}></input>
                  <div className="searchAutocomplete">
                  <div id = "searchAutocomplete" style={{display: "none"}}className="searchAutocomplete-content cl si">{items.map(item => {return (<input className="autoButton" type="button" onClick={e => settCommunity(item)} value={item}></input>)})}</div>
                  </div>
                  <textarea className="in cl si" rows="4" cols="25" name="posttext" placeholder="Post text" onChange={e => setText(e.target.value)}></textarea>
                  <input className="bt in" type="file" name="file" onChange={e => changeFileEvent(e)}/>
                  <input className="bt in" type="button" value="Submit" onClick={e=> setUpload(true)}></input>
              </form>
          </div>
      </div>
      </div>
      </div>
  );
  }
export default Upload;
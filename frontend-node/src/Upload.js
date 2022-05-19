import React, {useState} from "react";

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
    setFilename(e.target.files[0].name);
    getBase64(e.target.files[0]);
  }
  function uploa() {
    return fetchWrapper.post("http://127.0.0.1:80/upload", {"file":file,"filename": filename, "title":title,"community":community, "text":text});
  }
  return (

      <div className="login-containerv">
          <div className = "login-containerh">
    <div className="container-bubble">
          <div className="loginform lf" onSubmit={uploa}>
              <form className="lf" >
                  <input className="in cl si" type="text" name="title" placeholder="Title" onChange={e => setTitle(e.target.value)}></input>
                  <input className="in cl si" type="text" name="community" placeholder="Community" onChange={e => setCommunity(e.target.value)}></input>
                  <input className="in cl si" type="textbox" name="posttext" placeholder="Post text" onChange={e => setText(e.target.value)}></input>
                  <input className="bt in" type="file" name="file" onChange={e => changeFileEvent(e)}/>
                  <input className="bt in" type="submit"></input>
              </form>
              <span className="fp" > Forgot password? </span>
          </div>
      </div>
      </div>
      </div>
  );
  }
export default Upload;
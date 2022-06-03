import React, { useState, Navigate } from "react";
import logo from './logo.svg';
import { authAtom } from './_state';
import { useUserActions } from './_actions';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRecoilValue } from 'recoil';
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import * as Yup from 'yup';
import { useNavigate } from "react-router-dom";


function Login({ setToken }) {
    const history = useNavigate();
    const auth = useRecoilValue(authAtom);
    const userActions = useUserActions();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [nav, setNav] = useState("");

  function onSubmit() {
      var pr = userActions.login(email, password);
      pr.then(result => { setNav("/")}).catch(error => {setError("Incorrect email or Password")})
  }
  function handleEnter(event) {
    if (event.keyCode === 13) {
        const form = event.target.form;
        const index = Array.prototype.indexOf.call(form, event.target);
        if(event.target.name == "email"){
            
        }
        form.elements[index + 1].focus();
        event.preventDefault();
    }
  }

  function animate(){

  }
  useEffect(() => {history(nav)}, [nav]);
  useEffect(() => {if(error!=""){document.getElementById("error").style.display="block"}}, [error])
    return (<div>
        <div className="login-containerv">
            <div className = "login-containerh">
      <div className="container-bubble">
            <div className="loginform lf">
                <img className= "logologin" src="/img/logo.svg"></img>
                <form className="lf" >
                    <input className="in cl si" type="email" name="email" placeholder="Email" onKeyDown={handleEnter} onChange={e => setEmail(e.target.value)}></input>
                    <input className="in cl si" type="password" name="password" placeholder="Password" onKeyDown={handleEnter} onChange={e => setPassword(e.target.value)}></input>
                    <input className="bt in" id="sub" type="button" value="Submit" onClick={onSubmit}></input>
                    <div id="error" style={{display: "none"}} className="errorMsg">{error}</div>
                </form>
                <span className="fp" > Forgot password? </span>
            </div>
        </div>
        </div>
        </div>
        </div>
    );
  }
export default Login;
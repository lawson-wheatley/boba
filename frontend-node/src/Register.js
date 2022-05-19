import React from "react";
import logo from './logo.svg';
import { authAtom } from './_state';
import { useUserActions } from './_actions';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRecoilValue } from 'recoil';
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import * as Yup from 'yup';


function Register({ setToken }) {
  const auth = useRecoilValue(authAtom);
  const userActions = useUserActions();

  // form validation rules 
  const validationSchema = Yup.object().shape({
      email: Yup.string().required('Email is required'),
      password: Yup.string().required('Password is required')
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, setError, formState } = useForm(formOptions);
  const { errors, isSubmitting } = formState;

  function onSubmit({ email, password }) {
      return userActions.login(email, password)
          .catch(error => {
              setError('apiError', { message: error });
          });
  }
    return (
        <div className="login-containerv">
            <div className = "login-containerh">
      <div className="container-bubble">
            <div className="loginform lf" onSubmit={handleSubmit(onSubmit)}>
                <img className= "logologin" src="/img/logo.svg"></img>
                <form className="lf" >
                    <input className="in cl si" type="email" name="email" placeholder="Email" {...register('email')}></input>
                    <input className="in cl si" type="password" name="password" placeholder="Password" {...register('password')}></input>
                    <input className="bt in" type="submit"></input>
                </form>
                <span className="fp" > Forgot password? </span>
            </div>
        </div>
        </div>
        </div>
    );
  }
export default Login;
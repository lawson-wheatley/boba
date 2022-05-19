import React from "react";
import logo from './logo.svg';
import { useFetchWrapper } from "./_helpers";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

function Upload(item) {
  const fetchWrapper = useFetchWrapper();
  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    community: Yup.string().required('Community is required'),
    posttext: Yup.string(),
    file: Yup.mixed(),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, setError, formState } = useForm(formOptions);
  const { errors, isSubmitting } = formState;
  function fucker({ email, password, file, title, community}) {
    return fetchWrapper.post("http://34.85.215.122/upload", {email,password,file,title,community})
      .catch(error => {
        setError('apiError', { message: error });
    }
  );
  }
  return (
    
      <div className="login-containerv">
          <div className = "login-containerh">
    <div className="container-bubble">
          <div className="loginform lf" onSubmit={handleSubmit(fucker)}>
              <form className="lf" >
                  <input className="in cl si" type="text" name="title" placeholder="Title" {...register('title')}></input>
                  <input className="in cl si" type="text" name="community" placeholder="Community" {...register('community')}></input>
                  <input className="in cl si" type="textbox" name="posttext" placeholder="Post text" {...register('posttext')}></input>
                  <input className="bt in" type="file" name="file" {...register('file')}/>
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
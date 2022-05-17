import React from "react";
import logo from './logo.svg';
import { authAtom } from '../_state';
import { useUserActions } from '../_actions';


function Login({ setToken }) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const auth = useRecoilValue(authAtom);
  const userActions = useUserActions();

  useEffect(() => {
      // redirect to home if already logged in
      if (auth) history.push('/');

      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // form validation rules 
  const validationSchema = Yup.object().shape({
      username: Yup.string().required('Username is required'),
      password: Yup.string().required('Password is required')
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, setError, formState } = useForm(formOptions);
  const { errors, isSubmitting } = formState;

  function onSubmit({ username, password }) {
      return userActions.login(username, password)
          .catch(error => {
              setError('apiError', { message: error });
          });
  }
    return (
      <div className="container">
            <div className="loginform lf" onSubmit={handleSubmit(onSubmit)}>
                <img className= "logologin" src="/img/logo.svg"></img>
                <form className="lf" >
                    <input className="in cl si" type="email" name="email" placeholder="Email" {...register('username')} className={`form-control ${errors.username ? 'is-invalid' : ''}`}></input>
                    <input className="in cl si" type="password" name="password" placeholder="Password" {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`}></input>
                    <input className="bt in" type="submit"></input>
                </form>
                <span className="fp" > Forgot password? </span>
            </div>
        </div>
    );
  }
Login.propTypes = {
    setToken: PropTypes.func.isRequired
  }  
export default Login;
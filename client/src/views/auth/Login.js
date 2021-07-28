import React from "react";
import Cookies from "js-cookie"
import { useState } from "react";
import { Link } from "react-router-dom";
import {useHistory} from 'react-router-dom';
import { css } from "@emotion/react";
import SyncLoader from "react-spinners/SyncLoader";
import '../../assets/styles/alert.css';

import { useSelector, useDispatch } from 'react-redux';
import { userAction } from '../../Reducer/actions/user'
export default function Login() {
  const useremail = useSelector(state => state.user.email)
  const dispatch = useDispatch(); 
  const history= useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, seterror] = useState([]);
  const [errorbox, seterrorbox] = useState(false);
  const [successalert, setSuccessalert] = useState(false);
  const [erroralert, setErroralert] = useState(false);
  const [alertstate, setAlertState] = useState(false);
  const [alerterrortype, setAlerterrortype] = useState('');
  const [credentialerror,getCredentialerror]=useState('Error')
  let [loading, setLoading] = useState(false);
  let [color, setColor] = useState("#ffffff");
  

  const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const validate=()=>
  {
    let errors = [];
    let isValid = true;
    seterrorbox(false);
 
   if (!email) {
     isValid = false;
     errors.push('Please enter your email Address.')
   }

  if (email !== "undefined") {
    var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
      if (!pattern.test(email)) {
        isValid = false;
        errors.push("Please enter valid email address.");
      }
    }

    if (!password) {
      isValid = false;
      errors.push('Please enter your Password.')
    }



    if (typeof password !== "undefined") {
      if(password.length < 6){
        isValid = false;
          errors.push("Password must be atleast 6 character long.");
       
      }
    }

    seterror(errors);
    if (!isValid)
    {
      seterrorbox(true);
      setTimeout(() => {
        setLoading(false)
      }, 500);
  
setColor("#ffffff");
      }
    
    return isValid;
  }

  var submitForm = async (e) => {
    e.preventDefault()
    
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 5000);

    if (validate()) {
      const signIn = {  email, password };
      var host = process.env.REACT_APP_NODE_API;
  
    await  fetch(host + '/api/login', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signIn)
      }).then(response => response.json()).then((result) => {
        setAlertState(true);
        console.log(result)
      
      
        if (result.success)
        {
          Cookies.set('token', result.token, { expires: 1 });
          // alert( Cookies.get('name'));
          dispatch(userAction.setemail({ email: email }))
          setSuccessalert(true);
          setAlerterrortype("alert-success");
          history.push('/admin/dashboard');

        }
        else
        {
          getCredentialerror(result.message);
          setErroralert(true);
          setAlerterrortype("alert-error")
        }
        setEmail('');
        setPassword('');
        setTimeout(() =>
        {
          setAlertState(false);
          setErroralert(false);
          setSuccessalert(false);
        }, 3000);

      })

    }
   
}

var alertbox = {
     color: "white",
     fontSize: "1.45em",
};

  return (
    <>
      <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-4/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
              <div className="rounded-t mb-0 ">
              <div className="text-center mb-3">
                
                {alertstate && <div className={`text-sm alert ${alerterrortype}`} role="alert">
                  {successalert && <div className=" text-sm font-bold  inline-flex items-center " style={{ alertbox }}>
                   Waiting for signin to Dashboard...<pre > </pre>
                    <img
                      alt="..."
                      className="w-5 mr-1"
                      src={require("assets/img/thumbs-up.svg").default}
                    /></div>}
                  
                  {erroralert && <div className=" text-sm font-bold  inline-flex items-center " style={{ alertbox }}>
                   {credentialerror}
                    
                    <pre ></pre>
                  </div>}


                </div>}
              </div>
                <div className="text-center mb-3">
                  <h6 className="text-blueGray-500 text-sm font-bold">
                    Sign in with
                  </h6>
                </div>
                <div className="btn-wrapper text-center">
                  <button
                    className="bg-white active:bg-blueGray-50 text-blueGray-700 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-2 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150"
                    type="button"
                  >
                    <img
                      alt="..."
                      className="w-5 mr-1"
                      src={require("assets/img/github.svg").default}
                    />
                    Github
                  </button>
                  <button
                    className="bg-white active:bg-blueGray-50 text-blueGray-700 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150"
                    type="button"
                  >
                    <img
                      alt="..."
                      className="w-5 mr-1"
                      src={require("assets/img/google.svg").default}
                    />
                    Google
                  </button>
                </div>
                <hr className="mt-6 border-b-1 border-blueGray-300" />
              </div>
              <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <div className="text-blueGray-400 text-center mb-3 font-bold">
                  <small>Or sign in with credentials</small>
                </div>


                { errorbox && <div className="alert alert" style={{ border: "1px solid red" }}>
                  <div className="block text-blueGray-600 text-xs font-bold mb-2"
                  >
                    <ol>

                      {error.map((n) => (
                        
                        <li key={n} style={{ color: "red" }}>{n}</li>
                      ))}


                    </ol>
                  </div>
                </div>}
                <form onSubmit={submitForm}>
                  <div className="relative w-full mb-3" >
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Email
                    </label>
                    <input
                      type="email" required
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)}
                    />
                  </div>

                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Password
                    </label>
                    <input
                      type="password" required
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        id="customCheckLogin"
                        type="checkbox"
                        className="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                      />
                      <span className="ml-2 text-sm font-semibold text-blueGray-600">
                        Remember me
                      </span>
                    </label>
                  </div>

                  <div className="text-center mt-6">
                    <button type="submit"
                      className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                      
                    >
                          {loading && <SyncLoader color={color} loading={loading} css={override} size={11} />}
                      {!loading && <div> Sign In</div>}
                   
                     
                    </button>
                  </div>
                </form>
                <div className="btn-wrapper text-center mt-6 ">
                  <Link to="login"
                    className="bg-white active:bg-blueGray-50 text-blueGray-700 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-2 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150"
                    type="button"
                  >
                    <img
                      alt="..."
                      className="w-5 mr-1"
                      src={require("assets/img/login.svg").default}
                    />
                    Login
                  </Link>
                  <Link to="register"
                    className="bg-white active:bg-blueGray-50 text-blueGray-700 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150"
                    type="button"
                  >
                    <img
                      alt="..."
                      className="w-5 mr-1"
                      src={require("assets/img/add-user.svg").default}
                    />
                    Register
                  </Link>
                </div>
              </div>
              
            </div>
            
            <div className="flex flex-wrap mt-6 relative">
              <div className="w-1/2">
                <a
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                  className="text-blueGray-200"
                >
                  <small>Forgot password?</small>
                </a>
              </div>
              <div className="w-1/2 text-right">
                <Link to="/auth/register" className="text-blueGray-200">
                  <small>Create new account</small>
                </Link>
              </div>
            </div>
          </div>

          
        </div>
      </div>
    </>
  );
}

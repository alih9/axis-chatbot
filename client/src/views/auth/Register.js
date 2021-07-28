import React from "react";
import { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import {useHistory} from 'react-router-dom';
import { css } from "@emotion/react";
import SyncLoader from "react-spinners/SyncLoader";
import '../../assets/styles/alert.css';
export default function Register() {


  const history= useHistory();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successalert, setSuccessalert] = useState(false);
  const [erroralert, setErroralert] = useState(false);
  const [alertstate, setAlertState] = useState(false);
  const [alerterrortype, setAlerterrortype] = useState('');
  const [confirm_password, setConfirmpassword] = useState('');
  const [signupbuttonstatus, setSignupbuttonstatus] = useState(true);
  const [policycheckboxStatus, setpolicycheckboxStatus] = useState(false);
  const [error, seterror] = useState([]);
  const [errorbox, seterrorbox] = useState(false);

  const [credentialerror,getCredentialerror]=useState('Error')
  let [loading, setLoading] = useState(false);
  let [color, setColor] = useState("#ffffff");


  const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

  useEffect(() => { setSignupbuttonstatus(!policycheckboxStatus); }, [policycheckboxStatus])

  const validate=()=>
  {

    let errors = [];
    let isValid = true;
   
    seterrorbox(false);
    
    
    if (!name) {
      isValid = false;
      errors.push("Please enter your username.");
    }

    if (typeof name !== "undefined") {
      

      if(name.length < 6 ){
        isValid = false;
        errors.push("Please enter valid username.");
     
      }
    }

    if (!email) {
      errors.push('Please enter your email Address.')
      isValid = false;

    
    }

    if (email !== "undefined") {
        
      var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
      if (!pattern.test(email)) {
        isValid = false;
        errors.push("Please enter valid email address." );
        
       
      }
    }

    if (!password) {
      errors.push('Please enter your password.')
      isValid = false;

      
    }

    if (!confirm_password) {
      
      errors.push('Please enter your confirm password.')
      isValid = false;

    
    }

    if (typeof password !== "undefined") {
      if(password.length < 6){
        isValid = false;
          errors.push("Password must be atleast 6 character long.");
       
      }
    }

    if (typeof password !== "undefined" && typeof confirm_password !== "undefined") {
        
      if (password !== confirm_password) {
        
        isValid = false;
        errors.push("Passwords & Confirm password don't match.");
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

  var submitForm = (e) => {
    e.preventDefault()
    
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 5000);
    if (validate()) {
      const signup = { name, email, password };
      var host = process.env.REACT_APP_NODE_API;
  
      fetch(host + '/api/register', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signup)
      }).then(response => response.json()).then((result) => {
        setAlertState(true);
        // console.log(result)
        setEmail('');
        setPassword('');
        setConfirmpassword('')
        setName('');
        if (result.success) {
          setSuccessalert(true);
          setAlerterrortype("alert-success");


          setTimeout(() => {
  
history.push('/auth/login');
},1000)
        }
        else {
          getCredentialerror(result.message);
          setErroralert(true);
          setAlerterrortype("alert-error")
        }
      
        setTimeout(() => {
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
          
          <div className="w-full lg:w-6/12 px-4">
        
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
            
              <div className="rounded-t mb-0 ">
              <div className="text-center mb-3">
                
                  {alertstate && <div className={`text-sm alert ${alerterrortype}`} role="alert">
                    {successalert && <div className=" text-sm font-bold  inline-flex items-center " style={{ alertbox }}>
                      Successfully register<pre > </pre>
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
                    Sign up with
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
                  <small>Or sign up with credentials</small>
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
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Name
                    </label>
                    <input
                      type="text" required
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)}
                    />
                  </div>

                  <div className="relative w-full mb-3">
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
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Confirm Password
                    </label>
                    <input
                      type="password" required
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Password" value={confirm_password} onChange={(e)=>setConfirmpassword(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        id="customCheckLogin"
                        type="checkbox" value={policycheckboxStatus} onChange={(e)=>setpolicycheckboxStatus(e.target.checked)}
                        className="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                      />
                      <span className="ml-2 text-sm font-semibold text-blueGray-600">
                        I agree with the{" "}
                        <a
                          href="#pablo"
                          className="text-lightBlue-500"
                          onClick={(e) => e.preventDefault()}
                        >
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                  </div>

                  <div className="text-center mt-6">
                     <button type="submit" disabled={signupbuttonstatus}
                      className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                      
                    >
                      
                      {loading && <SyncLoader color={color} loading={loading} css={override} size={11} />}
                      {!loading && <div> Create Account</div>}
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
          </div>
        </div>
      </div>
    </>
  );
}


import React from 'react'
import { GoogleLogin } from 'react-google-login';
import { useNavigate } from "react-router-dom";
import PocListing from './PocListing';
import { useState } from "react";
import { BsGoogle } from 'react-icons/bs';
const clientId = "397652735982-dfhilu4dql1al5bei6mi8tb170hphk30.apps.googleusercontent.com";

const Login = () => {
   const [isSignedIn, setIsSignedIn] = useState(false);
   const navigate = useNavigate();
   const onSuccess = (res) => {
      console.log("Login Successfull! Current user: ", res.profileObj);
      localStorage.setItem("user-name", res.profileObj.name);
      localStorage.setItem("user-email", res.profileObj.email)
      setIsSignedIn(true);

   }

   const onFailure = (res) => {
      console.log("Login Failed! res ", res);
   }

   return (
      <>


         {isSignedIn ? (
            <div>
               <PocListing />
            </div>
         ) :
            (
               <section form="vh-100" style={{marginTop: '15vh'}}>
                  <div className="container-fluid h-custom">
                     <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-md-9 col-lg-6 col-xl-5">
                           <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                              className="img-fluid" alt="Sample image" />
                        </div>
                        <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                           <div style={{ textAlign: 'left' }}><h4>POC / POV Request Form</h4></div>
                           <form>
                              <div className="d-flex flex-row align-items-center justify-content-center justify-content-lg-start">
                                 <p className="lead fw-normal mb-0 me-3">Sign in with</p>
                                 <GoogleLogin
                                    clientId={clientId}
                                    buttonText="Login"
                                    onSuccess={onSuccess}
                                    onFailure={onFailure}
                                    cookiePolicy={'sign_host_origin'}
                                    isSignedIn={true}
                                 />
                              </div>
                           </form>
                        </div>
                     </div>
                  </div>

               </section>
            )}


      </>
      //     <div id="signInButton">
      //       <h2>POV/POC Request Form</h2>        
      //      {isSignedIn ? (


      //        <div>

      //          <PocListing /></div>

      //       ) : 
      //      (<GoogleLogin 
      //      clientId={clientId}
      //      buttonText="Login"
      //      onSuccess={onSuccess}
      //      onFailure={onFailure}
      //      cookiePolicy={'sign_host_origin'}
      //      isSignedIn={true}
      //      />

      //   )}
      //   </div>
   )
}

export default Login
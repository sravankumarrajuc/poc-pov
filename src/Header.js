/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import logo from "./images/factspan-logo.png";

import { useGoogleLogout } from 'react-google-login';
import { FaSignOutAlt } from 'react-icons/fa';
import { BsEscape } from "react-icons/bs";

const header = () => {
  const clientId = "776418814053-ft86q5rp1dq4l27vjjshh07k0cnsmk84.apps.googleusercontent.com";





  const onLogoutSuccess = (res) => {
    console.log('Logged out Success');
    alert('Logged out Successfully');
    window.location.href = '/';
  };

  const onFailure = () => {
    console.log('Handle failure cases');
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { signOut } = useGoogleLogout({
    clientId,
    onLogoutSuccess,
    onFailure,
  });
  return (
    <div>
      <nav className="navbar navbar-light bg-light">
        <a className="navbar-brand" style={{ paddingLeft: '10px' }}>
          <img src={logo} alt="logo" style={{ height: '30px' }} />
          <h4 style={{ paddingLeft: '20px' }}>POV/POC Request Form</h4>
        </a>
        <form className="form-inline">
          {/* <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button> */}
          <div style={{display:'flex', gap:'1em'}}>
            <div style={{display:'grid'}}>
              <span>{localStorage.getItem("user-name")}</span>
              <span>{localStorage.getItem("user-email")}</span>
            </div>
            <Link to="/logout"><button onClick={signOut} className="btn button-logout button">
              <span className="buttonText"></span>
              <FaSignOutAlt size={20} />

            </button></Link>
          </div>
        </form>
      </nav>
    </div>
  )
}

export default header
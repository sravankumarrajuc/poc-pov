import React from 'react'
import { useGoogleLogout } from 'react-google-login';

const Logout = () => {
    const clientId = "776418814053-ft86q5rp1dq4l27vjjshh07k0cnsmk84.apps.googleusercontent.com";
    const onLogoutSuccess = (res) => {
        console.log('Logged out Success');
        alert('Logged out Successfully ✌');
      };
    
      const onFailure = () => {
        console.log('Handle failure cases');
      };
    
      const { signOut } = useGoogleLogout({
        clientId,
        onLogoutSuccess,
        onFailure,
      });
    
      return (
        <button onClick={signOut} className="button">
          <img src="icons/google.svg" alt="google login" className="icon"></img>
    
          <span className="buttonText">Sign out</span>
        </button>
      );
 
}

export default Logout
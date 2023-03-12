import React from 'react'
import { useGoogleLogout } from 'react-google-login';

const Logout = () => {
    const clientId = "397652735982-dfhilu4dql1al5bei6mi8tb170hphk30.apps.googleusercontent.com";
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
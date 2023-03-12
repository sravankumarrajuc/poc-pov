import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PocListing from './PocListing';
import PocCreate from './PocCreate';
import PocDetail from './PocDetail';
import PocEdit from './PocEdit';
import { gapi } from 'gapi-script';
import { useEffect } from 'react';
import Header from './Header';

import Login from './Login';

function App() {
  const clientId = "776418814053-ft86q5rp1dq4l27vjjshh07k0cnsmk84.apps.googleusercontent.com";
  useEffect(() => {
    function start() {
      gapi.auth2.init({
        clientId:clientId,
        scope:""
      })
    };
    gapi.load('client:auth2',start);
  })
  return (
    <div className="App">
      {/* <h1>POV/POC Request Form</h1> */}
      {/* <Header></Header> */}
      
        <Routes>
          <Route path='/' element={<Login />}></Route>
          <Route path='/poclist' element={<PocListing />}></Route>
          <Route path='/poc/create' element={<PocCreate />}></Route>

          <Route path='/poc/detail/:empid' element={<PocDetail />}></Route>
          <Route path='/poc/edit/:empid' element={<PocEdit />}></Route>
        </Routes>
      
    </div>
  );

}

export default App;

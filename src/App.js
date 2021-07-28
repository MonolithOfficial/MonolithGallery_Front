import logo from './logo.svg';
import './App.css';
import Signup from "./components/Signup/Signup";
import Login from "./components/Login/Login";
import Base from "./components/Base/Base";
import Albums from "./components/Albums/Albums";
import Album from "./components/Albums/Album";
import React, { Component } from "react";
import { BrowserRouter, Route, NavLink } from "react-router-dom";

class App extends Component {
  render (){
    let navLink = (
      <div className="Tab">
        <NavLink to="/login" activeClassName="activeLink" className="login">
          Sign In
        </NavLink>
        <NavLink exact to="/" activeClassName="activeLink" className="signUp">
          Sign Up
        </NavLink>
      </div>
    );
    const login = localStorage.getItem("isLoggedIn");
    return (
      // <p>eeee</p>
      <div className="App">
        {login ? (

          <BrowserRouter>
            <Route exact path="/" component={Signup}></Route>
            <Route path="/login" component={Login}></Route>
            <Route path="/home" component={Base}></Route>
            <Route path="/albums" component={Albums}></Route>
            <Route path="/album/" component={Album}></Route>
          </BrowserRouter>
        ) : (
          <BrowserRouter>
            {/* {navLink} */}
            <Route exact path="/" component={Signup}></Route>
            <Route path="/login" component={Login}></Route>
            <Route path="/home" component={Base}></Route>
          </BrowserRouter>
        )}
      </div>
    );
  }
  
}

export default App;

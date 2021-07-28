import React, { Component } from "react";
import axios from "axios";
import { Link, Redirect } from "react-router-dom";
import '../../styles/login.css';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      msg: "",
      isLoading: false,
      redirect: false,
      emailErr: "",
      passwordErr: "",
    };
  }
  onChangehandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    let data = {};
    data[name] = value;
    this.setState(data);
    console.log(this.state)
  };

  onSignInHandler = (e) => {
      e.preventDefault();
    this.setState({ isLoading: true });
    axios
      .post("http://localhost:8000/api/v1/login", {
        email: this.state.email,
        password: this.state.password,
      })
      .then((response) => {
        this.setState({ isLoading: false });
        if (response.data.status === "successful") {
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("userData", JSON.stringify(response.data.data));
            console.log(localStorage.getItem('userData'));
          this.setState({
            msg: response.data.OPERATION_MESSAGE,
            redirect: true,
          });      
        }
        if (
          response.data.status === "failed"
        ) {
          console.log(response.data.validation_error.email[0])

          if (response.data.validation_error.email){
              this.setState({ emailErr: response.data.validation_error.email[0] });
              setTimeout(() => {
                this.setState({ emailErr: "" });
              }, 10000);
            }
          if (response.data.validation_error.password){
              this.setState({ passwordErr: response.data.validation_error.password[0] });
              setTimeout(() => {
                this.setState({ passwordErr: "" });
              }, 10000);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to="/home" />;
    }
    const login = localStorage.getItem("isLoggedIn");
    if (login) {
      return <Redirect to="/home" />;
    }
    const isLoading = this.state.isLoading;
    return (
      <div className="pageHolder loginPage">
        <h1>Sign-In</h1>
        <form method="post" className="form">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={this.state.email}
              onChange={this.onChangehandler}
            />
            {/* <span className="text-danger">{this.state.msg}</span>
            <span className="text-danger">{this.state.errMsgEmail}</span> */}
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={this.state.password}
              onChange={this.onChangehandler}
            />
            {/* <span className="text-danger">{this.state.errMsgPwd}</span> */}
          {/* <p className="text-danger">{this.state.errMsg}</p> */}
          <p className="textError">{this.state.emailErr}</p>
          <p className="textError">{this.state.passwordErr}</p>
          <button
            className="button signInBtn"
            onClick={this.onSignInHandler}
          >
            Sign In
            
          </button>
          <Link to="/" className="button" id="alreadyAMember">Don't have an account? Sign-up</Link>
          {isLoading ? (
              <h1 className="loadingPrompt">PLEASE WAIT, SIR</h1>
            ) : (
              <span></span>
            )}
        </form>
      </div>
    );
  }
}
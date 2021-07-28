import React, { Component } from "react";
import axios from "axios";
import { Link, Redirect } from "react-router-dom";
import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies';
import '../../styles/signup.css';

export default class Signup extends Component {
  userData;
  constructor(props) {
    super(props);
    this.state = {
      signupData: {
        name: "",
        email: "",
        password: "",
        isLoading: "",
      },
      nameErr: "",
      emailErr: "",
      passwordErr: "",
    };
  }

  onChangehandler = (e, key) => {
    const { signupData } = this.state;
    signupData[e.target.name] = e.target.value;
    this.setState({ signupData });
    console.log(signupData)
  };
  onSubmitHandler = (e) => {
    const cookie_key = 'statusMessage';
    e.preventDefault();
    this.setState({ isLoading: true });
    axios
      .post("http://localhost:8000/api/v1/registration", this.state.signupData)
      .then((response) => {
        console.log(response.data)

        this.setState({ isLoading: false });
        if (response.data.status === "successful") {
          this.setState({
            msg: response.data.OPERATION_MESSAGE,
            signupData: {
              name: "",
              email: "",
              password: "",
            },
          });
          this.props.history.push('/login')
          setTimeout(() => {
            this.setState({ msg: "" });
          }, 10000);
        }

        if (response.data.status === "failed") {
          if (response.data.errors.name){
              this.setState({ nameErr: response.data.errors.name });
              setTimeout(() => {
                this.setState({ nameErr: "" });
              }, 10000);
          }
          if (response.data.errors.email){
              this.setState({ emailErr: response.data.errors.email });
              setTimeout(() => {
                this.setState({ emailErr: "" });
              }, 10000);
          }
          if (response.data.errors.password){
              this.setState({ passwordErr: response.data.errors.password });
              setTimeout(() => {
                this.setState({ passwordErr: "" });
              }, 10000);
          }
          
        }
        // bake_cookie(cookie_key, response.data);
        // this.props.history.push('/login')
      });
  };
  render() {
    const isLoading = this.state.isLoading;
    return (
      
      <div className="pageHolder signUpPage">
        <h1>Registration</h1>
        <form method="post" className="form registration">
            <input
              type="name"
              name="name"
              placeholder="Enter name"
              value={this.state.signupData.name}
              onChange={this.onChangehandler}
            />
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={this.state.signupData.email}
              onChange={this.onChangehandler}
            />
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={this.state.signupData.password}
              onChange={this.onChangehandler}
            />
          <p className="textError">{this.state.nameErr}</p>
          <p className="textError">{this.state.emailErr}</p>
          <p className="textError">{this.state.passwordErr}</p>
          <button
            className="button signupBtn"
            onClick={this.onSubmitHandler}
          >
            Sign Up
            
          </button>
          
          <Link to="/login" className="button" id="alreadyAMember">Got an account? Sign-in</Link>
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
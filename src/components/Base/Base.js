import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies';
import { Redirect } from "react-router-dom";
import '../../styles/base.css';

export default class Base extends Component {
    constructor(props) {
        super(props);
        this.state = {
            navigate: false,
            content: [],
            deleteStatus: "",
            makeAdminStatus: "",
          };
      }
    
    
    onLogoutHandler = () => {
        localStorage.clear();
        this.setState({
            navigate: true,
        });
    };

    fetchAllUsers = (identifier) => {
        console.log(identifier)
        const params = {
            id: identifier
          };
        axios
            .get("http://localhost:8000/api/v1/users", {params}).
            then((response) => {
                this.setState({
                    content: response.data.allUsers
                });
                console.log(response.data.allUsers)
            })

    }

    makeAdmin = (e, identifierMaker, identifierReceiver) => {
        console.log(identifierMaker, identifierReceiver)
        const params = {
            id_maker: identifierMaker,
            id_receiver: identifierReceiver
        };
        axios
            .put(`http://localhost:8000/api/v1/make-admin?id_maker=${params.id_maker}&id_receiver=${params.id_receiver}`)
            .then((response) => {
                console.log(response)
                this.setState({ makeAdminStatus: response.data.OPERATION_MESSAGE });
                let makeAdminStatusEl = e.target.nextElementSibling;
                makeAdminStatusEl.innerText = this.state.makeAdminStatus;
                this.fetchAllUsers(identifierMaker);

                // this.forceUpdate();
                setTimeout(() => {
                    this.setState({ makeAdminStatus: "" });
                    makeAdminStatusEl.innerText = this.state.makeAdminStatus;
                }, 3000);
            })
    }

    removeAdmin = (e, identifierMaker, identifierReceiver) => {
        console.log(identifierMaker, identifierReceiver)
        const params = {
            id_maker: identifierMaker,
            id_receiver: identifierReceiver
        };
        axios
            .put(`http://localhost:8000/api/v1/remove-admin?id_maker=${params.id_maker}&id_receiver=${params.id_receiver}`)
            .then((response) => {
                this.setState({ makeAdminStatus: response.data.OPERATION_MESSAGE });
                let makeAdminStatusEl = e.target.nextElementSibling;
                makeAdminStatusEl.innerText = this.state.makeAdminStatus;
                this.fetchAllUsers(identifierMaker);
                // this.forceUpdate();
                setTimeout(() => {
                    this.setState({ makeAdminStatus: "" });
                    makeAdminStatusEl.innerText = this.state.makeAdminStatus;
                }, 3000);
            })
    }

    deleteUser = (e, delInit, delSub) => {
        console.log(delInit, delSub)
        const params = {
            deleteInitiator: delInit,
            deleteSubject: delSub
        };
        axios
            .delete(`http://localhost:8000/api/v1/delete-user?deleteInitiator=${params.deleteInitiator}&deleteSubject=${params.deleteSubject}`)
            .then((response) => {
                console.log(response)
                this.setState({ makeAdminStatus: response.data.OPERATION_MESSAGE });
                this.fetchAllUsers(delInit);
            })
    }

    render(){
        const userLoggedIn = JSON.parse(localStorage.getItem("userData"));
        const { navigate } = this.state;
        const { content } = this.state;
        const renderedContent = content.length? (
            content.map((user, index) => {
                return (
                    <div key={user.id} className="card userCard">
                        <img src="images/yellow_inc.png"/>
                        <p>{user.name}</p>
                        <button className="button deleteUserBtn" onClick={(e) => {this.deleteUser(e, userLoggedIn.id, user.id)}}>Delete</button>
                        {(
                            () => {
                                if (user.admin == 0){
                                    return <button className="button makeAdminBtn" onClick={(e) => {this.makeAdmin(e, userLoggedIn.id, user.id)}}>Grant Admin</button>
                                }
                                else {
                                    // return <button>Remove Admin</button>
                                    return <button className="button removeAdminBtn" onClick={(e) => {this.removeAdmin(e, userLoggedIn.id, user.id)}}>Remove Admin</button>
                                }
                            }
                        )()}
                        
                        <p></p>
                    </div>
                )
            })
        ) : (
            ""
        )
        
        if (navigate) {
        return <Redirect to="/" push={true} />;
        }
        return(
            <div>
                    <div className="pageHolder basePage">
                    <div><p>Logged in as {userLoggedIn.name}</p></div>

                    <div id="navbar">
                        {(() => {
                            if (userLoggedIn.admin == 1){
                                return <button className="button" id="users" onClick={() => {this.fetchAllUsers(userLoggedIn.id)}}>Users</button>
                            }
                        })()
                            
                        }
                        <Link to="/albums" id="albumsLink"><button id="albums" className="button albumsBtn">Albums</button></Link>

                    </div>
                    <button
                    className="button logoutBtn"
                    onClick={this.onLogoutHandler}
                    >
                    LOGOUT
                    </button>
                    
                </div>
                <div className="usersHolder">
                {   renderedContent}

                </div>
            </div>
            
            
        )
    }
}
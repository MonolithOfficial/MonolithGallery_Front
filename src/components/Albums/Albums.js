import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies';
import { Redirect } from "react-router-dom";
import '../../styles/albums.css';

export default class Albums extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            description: "",
            cover_image: {},
            content: [],
            deleteStatus: "",
            makeAdminStatus: "",
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
    imageHandler = (e) => {
        const file = e.target.files[0];
        this.setState({
            cover_image: file
        })
    }
    onLogoutHandler = () => {
        localStorage.clear();
        this.setState({
            navigate: true,
        });
        this.props.history.push('/login')
    };
    onSubmitHandler = (e, identifier) => {
        e.preventDefault();
        console.log(identifier)
        const params = {
            name: this.state.name,
            description: this.state.description,
            userId: identifier,
            cover_image: this.state.cover_image,
          };
        const formdata = new FormData();
        formdata.append("name", this.state.name);
        formdata.append("description", this.state.description);
        formdata.append("userId", identifier);
        formdata.append("cover_image", this.state.cover_image);
        axios
            .post("http://localhost:8000/api/v1/add-album", formdata).
            then((response) => {
                
                if (response.data.status == "successful"){
                    window.location.reload();
                }
            })

    }

    fetchAlbums = (identifier) => {
        const params = {
            userId: identifier
          };
        axios
            .get("http://localhost:8000/api/v1/albums", {params}).
            then((response) => {
                this.setState({
                    content: response.data.albums
                });
            })
    }

    deleteAlbum = (albumIdentification) => {
        let userIdentification = JSON.parse(localStorage.getItem("userData")).id;
        const params = {
            userId: userIdentification
          };
        axios
            .delete(`http://localhost:8000/api/v1/delete-album/${albumIdentification}`, {params}).
            then((response) => {
                if (response.data.status == "successful"){
                    window.location.reload();
                }
            })
    }
    componentDidMount(){
        const userLoggedIn = JSON.parse(localStorage.getItem("userData"));

        this.fetchAlbums(userLoggedIn.id)
    }

    displayAlbumCreationForm = () => {
        document.getElementById('albumCreationForm').classList.toggle('invisible');
    }
    
    render(){
        const userLoggedIn = JSON.parse(localStorage.getItem("userData"));
        // this.fetchAlbums(userLoggedIn.id)
        const renderedAlbumContent = this.state.content.length? (
            this.state.content.map((album, index) => {
                return ( 
                        <div className="album card" key={album.id}>
                            <a href={`/album/${album.id}`}>
                                <img src={`http://localhost:8000/albums/${album.cover_image}`}/>
                                <h1>{album.name}</h1>
                                <p>{album.description}</p>
                                <p id="createdBy">Created By {userLoggedIn.name}</p>
                            </a>

                            <button className="button deleteAlbumBtn" onClick={() => {this.deleteAlbum(album.id)}}>Delete</button>
                        </div>
                    
                )
                
            })
        ) : (
            <h4>Loading, please stand by...</h4>
        )
        return (
            <div className="pageHolder albumsPage">
                <button className="button addAlbumBtn" onClick={() => {this.displayAlbumCreationForm()}}>&#43; Add Album</button>
                <form encType="multipart/form-data" method="post" id='albumCreationForm' className=" form invisible">
                    <input type="text" placeholder="Name" name="name" value={this.state.name}
                   onChange={this.onChangehandler}/>

                    <input type="text" placeholder="Description" name="description" value={this.state.description}
                    onChange={this.onChangehandler}/>

                    <input type="file" name="cover_image" onChange={this.imageHandler}/>
                    <input type="hidden" name="userId" value={userLoggedIn.id}/>
                    <button className="button" onClick={(e) => {this.onSubmitHandler(e, userLoggedIn.id)}}>Submit</button>
                </form>

                <div className="albumsHolder">
                    {renderedAlbumContent}

                </div>
                <button
                    className="button logoutBtn"
                    onClick={this.onLogoutHandler}
                    >
                    LOGOUT
                </button>
            </div>
            
        )
    }
}
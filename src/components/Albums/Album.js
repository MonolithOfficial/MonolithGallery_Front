import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies';
import { Redirect } from "react-router-dom";
import '../../styles/albums.css';

export default class Album extends Component {
    constructor(props) {
        super(props);
        this.state = {
            album_id: 0,
            name: "",
            description: "",
            cover_image: {},
            content: [],
            images: [],
            image: {},
            deleteStatus: "",
            makeAdminStatus: "",
          };
      }
    // onChangehandler = (e) => {
    //     let name = e.target.name;
    //     let value = e.target.value;
    //     let data = {};
    //     data[name] = value;
    //     this.setState(data);
    //     console.log(this.state)
    // };
    // imageHandler = (e) => {
    //     const file = e.target.files[0];
    //     this.setState({
    //         cover_image: file
    //     })
    // }
    // onSubmitHandler = (e, identifier) => {
    //     e.preventDefault();
    //     console.log(identifier)
    //     const params = {
    //         name: this.state.name,
    //         description: this.state.description,
    //         userId: identifier,
    //         cover_image: this.state.cover_image,
    //       };
    //     const formdata = new FormData();
    //     formdata.append("name", this.state.name);
    //     formdata.append("description", this.state.description);
    //     formdata.append("userId", identifier);
    //     formdata.append("cover_image", this.state.cover_image);
    //     axios
    //         .post("http://localhost:8000/api/v1/add-album", formdata).
    //         then((response) => {
                
    //             console.log(response.data)
    //         })

    // }

    fetchAlbum = (identifier) => {
        const pathName = this.props.location.pathname;
        const id = pathName.substr(pathName.lastIndexOf('/') + 1, pathName.length - 1);
        console.log(id)
        
        const params = {
            userId: identifier
        };
        axios
        .get(`http://localhost:8000/api/v1/album/${id}`, {params}).
        then((response) => {
                this.setState({
                    content: response.data.album,
                    images: response.data.album.images,
                })
                console.log(this.state.content.images)
        })
        

    }
    componentDidMount(){
        const userLoggedIn = JSON.parse(localStorage.getItem("userData"));

        this.fetchAlbum(userLoggedIn.id)
    }

    onChangehandler = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        let data = {};
        data[name] = value;
        this.setState(data);
        console.log(this.state)
    };

    onLogoutHandler = () => {
        localStorage.clear();
        this.setState({
            navigate: true,
        });
        this.props.history.push('/login')

    };  

    imageHandler = (e) => {
        const file = e.target.files[0];
        this.setState({
            image: file
        })
    }

    onSubmitHandler = (e, identifier) => {
        e.preventDefault();
        const pathName = this.props.location.pathname;
        var album_id = pathName.substr(pathName.lastIndexOf('/') + 1, pathName.length - 1);
        const formdata = new FormData();
        formdata.append("description", this.state.description);
        formdata.append("userId", identifier);
        formdata.append("image", this.state.image);
        formdata.append("album_id", album_id);
        axios
            .post("http://localhost:8000/api/v1/add-image", formdata).
            then((response) => {
                
                if (response.data.status == "successful"){
                    window.location.reload();
                }
            })

    }

    deleteImage = (imageIdentification) => {
        let userIdentification = JSON.parse(localStorage.getItem("userData")).id;
        const params = {
            userId: userIdentification
          };
        axios
            .delete(`http://localhost:8000/api/v1/delete-image/${imageIdentification}`, {params}).
            then((response) => {
                if (response.data.status == "successful"){
                    window.location.reload();
                }
            })
    }

    displayImageCreationForm = () => {
        document.getElementById('imageCreationForm').classList.toggle('invisible');
    }

    // displayAlbumCreationForm = () => {
    //     document.getElementById('albumCreationForm').classList.toggle('invisible');
    // }
    
    render(){
        const userLoggedIn = JSON.parse(localStorage.getItem("userData"));
        const renderedAlbumHeader = this.state.content? (
                <div className="album header">
                    <img src={`http://localhost:8000/albums/${this.state.content.cover_image}`}/>
                    <h1>{this.state.content.name}</h1>
                    <p>{this.state.content.description}</p>
                    <p>Created By {userLoggedIn.name}</p>
                </div>
                    
                
        ) : (
            <h4>Loading, please stand by...</h4>
        )
        const renderedAlbumContent = this.state.images.length? (
            // <div className="album header">
            //         <img src={`http://localhost:8000/albums/${this.state.content.cover_image}`}/>
            //         <h1>{this.state.content.name}</h1>
            //         <p>{this.state.content.description}</p>
            //         <p>Created By {userLoggedIn.name}</p>
            //     </div>
            this.state.content.images.map((image, index) => {
                return (
                    <div className="imageThumb" key={image.id}>
                        <div title={image.description} className="imageFrame" style={{backgroundImage:`url('http://localhost:8000/images/${image.image}')`}}></div>

                        {/* <img src={`http://localhost:8000/images/${image.image}`} title={image.description}/> */}
                        <button className="button deleteImageBtn" onClick={() => {this.deleteImage(image.id)}}>Delete</button>

                    </div>
                )
            })
                
        ) : (
            <h4>Loading, please stand by...</h4>
        )
        return (
            <div>
                <div className="pageHolder albumPage">
                    <div className="albumHeader">
                        {renderedAlbumHeader}
                        <button className="button" onClick={() => {this.displayImageCreationForm()}}>&#43; Add Image</button>

                        <form encType="multipart/form-data" method="post" id='imageCreationForm' className=" form invisible">
                            <input type="file" name="cover_image" onChange={this.imageHandler}/>
                            
                            <input type="text" placeholder="Description" name="description" value={this.state.description}
                                onChange={this.onChangehandler}/>

                            <input type="hidden" name="userId" value={userLoggedIn.id}/>
                            <button className="button" onClick={(e) => {this.onSubmitHandler(e, userLoggedIn.id)}}>Submit</button>
                        </form>
                    </div>
                    <div className="albumContent">
                        {renderedAlbumContent}


                    </div>
                    

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
import React, { Component } from "react";
import Blog from "./Blog";
//import Addcomment from "./Addcomment";
import "./Blog.css";

import { Link } from "react-router-dom";
import firebase from "firebase";

var mail,x,k,b;

class BlogArea extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userName: "User",
      title: "",
      blogid: 0,
      content: " ",
      upvote: 0,
      downvote: 0,
      taglist: [],
      commentlist: [],
      timestamp: 0,
      list: [],
      temp: [],
      numofblogs: "5",
      isSignedIn:true
    };
    this.blogRef = firebase.database().ref("blog_entry");
    // this.getData(); 
    this.listenBlogs();
  }

  componentDidMount=() =>{
    firebase.auth().onAuthStateChanged(user => {
      this.setState({isSignedIn:!!user})
      if(this.state.isSignedIn) this.getData();
    })
    this.listenBlogs();
  }

  getData()
  {
    mail = firebase.auth().currentUser.email;
    var y = 1;
    var data_list = [];
    var z = 1;

    firebase
      .database()
      .ref()
      .child("users")
      .once("value")
      .then(snapshot => {
        snapshot.forEach(function(child) {
          var temp = child.val().userEmail;
          data_list.push(temp);
          if (temp == String(mail)) {
            x = child.val().userName;
            k = child.val().cf_handle;
            b = child.val().isModerator;
          }
        });
        this.setState({ userName: x });
        this.setState({ isModerator: b });
        if (k == undefined || k == null || k == "00") {
          this.setState({ hasHandle: false });
          this.setState({ cf_handle: x });
        } else {
          this.setState({ hasHandle: true });
          this.setState({ cf_handle: k });
        }
      });
  };


  listenBlogs() {
    this.blogRef
      .orderByPriority()
      .limitToFirst(20)
      .on("value", message => {
        this.setState({
          list: Object.values(message.val())
        });
      });
  }

  handleViewMore(event) {
    this.listenBlogs();
  }

  render() {
    return (
      <div className="blog-main-page">
        <div className="name">Blogs</div>

        <Link to="/header/addblog" className="Add-Blog-button">
          +
        </Link>

        {this.state.list ? (
          <div>
            {this.state.list.map((item, index) => (
              <Blog key={index} message={item} />
            ))}
          </div>
        ) : (
          <div />
        )}
        {/* <button onClick={this.handleViewMore.bind(this)}>View More</button> */}
      </div>
    );
  }
}

export default BlogArea;

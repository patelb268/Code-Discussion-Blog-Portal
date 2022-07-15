import React, { Component } from "react";
import "./Blog.css";
import htmlToDraft from 'html-to-draftjs';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import firebase from "firebase";

//import {WebView} from 'react-native';

var mail,x,k,b;
class Reply extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
      content: " ",
      curr_user: 'Sebastian',
      userName: "",
      curr_id:0,
      commentobj:0,
    };

   // console.log("hello");

    //this.getobj();

  }

  componentDidMount=() =>{
    firebase.auth().onAuthStateChanged(user => {
      this.setState({isSignedIn:!!user})
      if(this.state.isSignedIn) this.getData();
    })
  }


  getData = () => {
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




  handleChange_content(event) {
    this.setState({ content: event.target.value });
  }
  handleKeyPress(event) {
    if (event.key !== "Enter") return;
    this.handleSend();
  }
  render() {
    return (

      
      <div className="replyy">
        <div className="reply-username">[{this.props.message.userName}]</div>
        <div className="reply-content" dangerouslySetInnerHTML={{__html: this.props.message.content}} />
        {/* this is added for reply time. */}
        {/*
        <span >
            {new Date(this.props.message.timestamp).toLocaleDateString()}
            {", "}
            {new Date(this.props.message.timestamp).toLocaleTimeString()}
          </span>   */}
      </div>
        
      
    );
  }
}
export default Reply;
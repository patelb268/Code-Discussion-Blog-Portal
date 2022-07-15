import React, { Component } from "react";
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import "./Blog.css";

import draftToHtml from 'draftjs-to-html';
//import htmlToDraft from 'html-to-draftjs';


import firebase from "firebase";

var mail,x,k,b;
class Addcomment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userName: "",
      content: ' ',
      parentblogid: 0,
      replylist: [],
      editorState: EditorState.createEmpty(),
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      commentlist: [],
      EmptyEditor: EditorState.createEmpty()
    };
    this.commentRef = firebase.database().ref().child('comment_list');
    this.ref = firebase.database().ref().child('commentid');

    var currid = 0;

    
    firebase.database().ref().child('commentid').on("value", function (snapshot) {
      currid = snapshot.val();
    }, function (error) {
      console.log("Error: " + error.code);
    });
    // this.getData();
    console.log(this.props.message.id);
    

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
  

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };


  handleSend() {

    var hello=draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
    var hello2=draftToHtml(convertToRaw(this.state.EmptyEditor.getCurrentContent()));

    if(hello==hello2)
    {
      alert("Empty comment can not be added.");
      return;
    }
    var currid;
    var ref = firebase.database().ref().child('commentid');
    ref.on("value", function (snapshot) {
      currid = snapshot.val();
    }, function (error) {
      console.log("Error: " + error.code);
    });



    //  console.log(this.state.blogid);
    console.log(this.state.userName);
    if (1) {
      var newItem = {
        id: currid,
        userName: this.state.userName,
        content: draftToHtml(convertToRaw(this.state.editorState.getCurrentContent())),
        replylist: this.state.replylist,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      };

      ref.transaction(function (currid) {
        return currid + 1;
      });

      //firebase.database().ref().update({blogid :currid});


      this.commentRef.push(newItem);
      currid -= 1;
      var tempid = this.props.message.id;
      var commentarray = (this.props.message.commentlist);

      if (typeof commentarray === 'undefined') {
        commentarray = new Array(1).fill(currid);
      }
      else
        commentarray.push(currid);

      //console.log(typeof commentarray);
      var curr_key;

      var query = firebase.database().ref("blog_entry").orderByKey();

      query.once("value")
        .then(function (snapshot) {
          snapshot.forEach(function (childSnapshot) {

            var childData = childSnapshot.val();
            console.log(tempid);
            if (childData.id == tempid) {
              curr_key = childSnapshot.key;
              firebase.database().ref().child("blog_entry").child(curr_key).update({ commentlist: commentarray });

            }
          });
        });


      //firebase.database().ref().child("blog_entry").child(this.props.message.key);
      // this.setState({ title: '' });
      this.setState({ content: '' });
      this.setState({ editorState: EditorState.createEmpty() });
    }
    //  window.location.reload();
  }



  handleKeyPress(event) {
    if (event.key !== 'Enter') return;
    this.handleSend();

  }


  render() {
    const { editorState } = this.state;
    return (
      <div className="add-comment">
        <Editor
          className="rich_text_own"
          editorState={editorState}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          onEditorStateChange={this.onEditorStateChange}
        />
        {/* <div>{this.state.taglist}</div> */}

        <div 
          className="submit-comment-btn"
          onClick={this.handleSend.bind(this)}
        >Submit Comment</div>
        <div className="for-space"></div>
      </div>
    );
  }
}

export default Addcomment;

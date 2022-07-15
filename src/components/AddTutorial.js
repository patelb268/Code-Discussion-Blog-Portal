import React, { Component } from "react";
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import "./css/add_things.css";

import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';


import firebase from "firebase";
var mail, x, k, b;

class AddTutorial extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userName: "",
      title: '',
      content: ' ',
      editorState: EditorState.createEmpty(),
      timestamp: firebase.database.ServerValue.TIMESTAMP,
    };
    this.tutorialRef = firebase.database().ref().child('tutorial_entry');
    this.ref = firebase.database().ref().child('tutorialid');

    var currid = 0;
    // this.getData();
    firebase.database().ref().child('tutorialid').on("value", function (snapshot) {
      currid = snapshot.val();
      console.log(currid);
    }, function (error) {
      console.log("Error: " + error.code);
    });


  }

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ isSignedIn: !!user })
      if (this.state.isSignedIn) this.getData();
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
        snapshot.forEach(function (child) {
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
  handleChange_title(event) {
    this.setState({ title: event.target.value });
  }
  handleChange_content(event) {
    this.setState({ content: event.target.value });
  }

  handleSend() {

    var ref = firebase.database().ref().child('tutorialid');
    var currid = 0;

    firebase.database().ref().child('tutorialid').on("value", function (snapshot) {
      currid = snapshot.val();
      // console.log(currid);
    }, function (error) {
      console.log("Error: " + error.code);
    });



    console.log('currid' + currid);
    if (this.state.title) {
      var newItem = {
        id: 1e9 - currid,
        userName: this.state.userName,
        title: this.state.title,
        content: draftToHtml(convertToRaw(this.state.editorState.getCurrentContent())),
      };
      //      console.log('currid2' + currid);

      ref.transaction(function (currid) {
        return currid + 1;
      });


      var item = this.tutorialRef.push();
      item.setWithPriority(newItem, 0 - Date.now());

      this.setState({ title: '' });
      this.setState({ content: '' });
      this.setState({ currtag: '' });
      this.setState({ taglist: [] });
    }
    this.props.history.push("/header/Tutorial");
  }


  handleKeyPress(event) {
    if (event.key !== 'Enter') return;
    this.handleSend();
  }


  render() {
    const { editorState } = this.state;
    return (
      <div className="background_pages">
        <div className="heading">Add Tutorial</div>

        <div className="form-add">
          <div className="title-adder">Title</div>
          <input type="text"
            placeholder="Type the title of tutorial." onEditorStateChange
            value={this.state.title}
            onChange={this.handleChange_title.bind(this)}
            onKeyPress={this.handleKeyPress.bind(this)}
          ></input>

          <div className="for_space_10"></div>

          <div className="title-adder">Content</div>
          <div className="background-text-editor">
            <Editor
              className="rich_text_own"
              editorState={editorState}
              wrapperClassName="demo-wrapper"
              editorClassName="demo-editor"
              onEditorStateChange={this.onEditorStateChange}
            />
          </div>

          <button
            className="form__button-9"
            onClick={this.handleSend.bind(this)}
          > Submit  </button>
        </div>
      </div>
    );
  }
}

export default AddTutorial;


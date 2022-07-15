import React, { Component } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./css/add_things.css";

import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

import firebase from "firebase";

var mail, x, k, b;

class AddBlog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userName: "Deep",
      title: "",
      content: " ",
      upvote: ["__S"],
      downvote: ["__D"],
      taglist: [],
      commentlist: [],
      editorState: EditorState.createEmpty(),
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      currtag: ""
    };
    this.blogRef = firebase
      .database()
      .ref()
      .child("blog_entry");
    this.ref = firebase
      .database()
      .ref()
      .child("blogid");

    var currid = 0;

    // this.getData();
    firebase
      .database()
      .ref()
      .child("blogid")
      .on(
        "value",
        function (snapshot) {
          currid = snapshot.val();
          console.log(currid);
        },
        function (error) {
          console.log("Error: " + error.code);
        }
      );
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



  onEditorStateChange = editorState => {
    this.setState({
      editorState
    });
  };
  handleChange_title(event) {
    this.setState({ title: event.target.value });
  }
  handleChange_content(event) {
    this.setState({ content: event.target.value });
  }
  handleChange_tag(event) {
    this.setState({ currtag: event.target.value });
  }

  handleSend() {
    var ref = firebase
      .database()
      .ref()
      .child("blogid");
    var currid = 0;

    firebase
      .database()
      .ref()
      .child("blogid")
      .on(
        "value",
        function (snapshot) {
          currid = snapshot.val();
          // console.log(currid);
        },
        function (error) {
          console.log("Error: " + error.code);
        }
      );

    console.log("currid" + currid);
    //  console.log(this.state.blogid);
    if (this.state.title) {
      var newItem = {
        id: 1e9 - currid,
        userName: this.state.userName,
        title: this.state.title,
        content: draftToHtml(
          convertToRaw(this.state.editorState.getCurrentContent())
        ),
        upvote: this.state.upvote,
        downvote: this.state.downvote,
        taglist: this.state.taglist,
        commentlist: this.state.commentlist,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      };
      //      console.log('currid2' + currid);

      ref.transaction(function (currid) {
        return currid + 1;
      });

      //firebase.database().ref().update({blogid :currid});

      var item = this.blogRef.push();
      item.setWithPriority(newItem, 0 - Date.now());

      this.setState({ title: "" });
      this.setState({ content: "" });
      this.setState({ currtag: "" });
      this.setState({ taglist: [] });
    }
    this.props.history.push("/header/blogs");
  }

  handleAddTag() {
    if (!this.state.currtag) return;
    this.state.taglist.push(this.state.currtag);
    this.setState({ currtag: "" });
  }

  handleKeyPress(event) {
    if (event.key !== "Enter") return;
    this.handleSend();
  }

  handleKeyPressAddTag(event) {
    if (event.key !== "Enter") return;
    this.handleAddTag();
  }

  render() {
    const { editorState } = this.state;
    return (
      <div className="background_pages">

        <div className="heading">Add Blog</div>

        <div className="form-add">
          <div className="title-adder">Title</div>
          <input
            type="text"
            placeholder="Type the title of blog"
            onEditorStateChange
            value={this.state.title}
            onChange={this.handleChange_title.bind(this)}
            onKeyPress={this.handleKeyPress.bind(this)}
            className="input_title"
          />
          <div className="for_space_10" />

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

          <div className="title-adder">Tags</div>

          <div className="add_tag_div">
            <input
              type="text"
              placeholder="Add tag one by one and press enter"
              value={this.state.currtag}
              onChange={this.handleChange_tag.bind(this)}
              onKeyPress={this.handleKeyPressAddTag.bind(this)}
            />
            <button className="tag_add_btn" onClick={this.handleAddTag.bind(this)}>Add tag</button>
          </div>

          <div className="tags-names">
            {this.state.taglist.map((item, index) => (
              <div className="tags_div">{item + "  "}</div>
            ))}
          </div>

          <button className="form__button-9" onClick={this.handleSend.bind(this)}>
            {" "}
            Submit
        </button>
        </div>
      </div>
    );
  }
}

export default AddBlog;

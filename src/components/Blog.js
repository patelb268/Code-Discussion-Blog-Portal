import React, { Component } from "react";
import "./Blog.css";
import Addcomment from "./Addcomment";
import Comment from "./Comment";

//import htmlToDraft from 'html-to-draftjs';
//import { EditorState, convertToRaw, ContentState } from 'draft-js';
import firebase from "firebase";

//import {WebView} from 'react-native';
var mail,x,k,b;

export default class Blog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: " ",
      curr_user: "",
      upvoted: false,
      downvoted: false,
      viewcomments: false,
      commentlist: false,
      comment_obj_list: [],
      curr_id: 0,
      isModerator:false,
      cf_handle:"",
      hasHandle:false,
      userName:"hh"
    };
    // this.getData(); 
    // this.calculate_vote();
     
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
        this.setState({ curr_user: x });
        this.setState({ isModerator: b });
        if (k == undefined || k == null || k == "00") {
          this.setState({ hasHandle: false });
          this.setState({ cf_handle: x });
        } else {
          this.setState({ hasHandle: true });
          this.setState({ cf_handle: k });
        }
      });
      // this.calculate_vote();
  };


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
        this.setState({ curr_user: x });
        this.setState({ isModerator: b });
        if (k == undefined || k == null || k == "00") {
          this.setState({ hasHandle: false });
          this.setState({ cf_handle: x });
        } else {
          this.setState({ hasHandle: true });
          this.setState({ cf_handle: k });
        }
        this.calculate_vote();
      });
  };


  calculate_vote() {
    
    console.log(this.state.curr_user);
    var t1 = (this.props.message.upvote.includes(this.state.curr_user)) ? true : false;
    var t2 = (this.props.message.downvote.includes(this.state.curr_user)) ? true : false;
    this.setState({upvoted:t1,downvoted:t2});
  }


  

  handleUpvote() {

    if (this.state.downvoted) return;
    this.props.message.upvote.push(this.state.curr_user);

    var tempid = this.props.message.id;
    var upvotearray = this.props.message.upvote;
    var curr_key;

    var query = firebase.database().ref("blog_entry").orderByKey();

    query.once("value")
      .then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {

          var childData = childSnapshot.val();

          if (childData.id == tempid) {
            curr_key = childSnapshot.key;
            // console.log(curr_key);
            firebase.database().ref().child("blog_entry").child(curr_key).update({ upvote: upvotearray });
            
          }
        });
      });

    this.setState({ upvoted: true });
  }

  handleDownvote() {

    if (this.state.upvoted) return;
    this.props.message.downvote.push(this.state.curr_user);

    var tempid = this.props.message.id;
    var downvotearray = this.props.message.downvote;
    var curr_key;

    var query = firebase.database().ref("blog_entry").orderByKey();

    query.once("value")
      .then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {

          var childData = childSnapshot.val();

          if (childData.id == tempid) {
            curr_key = childSnapshot.key;
            //console.log(curr_key);
            firebase.database().ref().child("blog_entry").child(curr_key).update({ downvote: downvotearray });

          }
        });
      });

    this.setState({ downvoted: true });
  }

  handleChange_content(event) {
    this.setState({ content: event.target.value });
  }

  handleRemove(event) {
    var curr_key;
    var tempid = this.props.message.id;
    var query = firebase.database().ref("blog_entry").orderByKey();
    query.once("value")
      .then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {

          var childData = childSnapshot.val();

          if (childData.id == tempid) {
            curr_key = childSnapshot.key;
            //console.log(curr_key);
            firebase.database().ref().child("blog_entry").child(curr_key).remove();

          }
        });
      });
  }

  handleAddcomment(event) {
    this.setState({ viewcomments: true });
  }
  handleKeyPress(event) {
    if (event.key !== "Enter") return;
    this.handleSend();
  }

  handleChangeView() {
    this.setState({ viewcomments: false });
  }

  render() {
    return (

      <div className="blog-box">
        <div className="message">
          <div className="blog_title">{this.props.message.title}</div>
          <span className="headerh3">By: </span>
          <span className="blog_author">{this.props.message.userName}</span>

          <span className="blog_date">
            {new Date(this.props.message.timestamp).toLocaleDateString()}
            {", "}
            {new Date(this.props.message.timestamp).toLocaleTimeString()}
          </span>
          <br />
          <br />
          <div className="partition-line"></div>
          <br />
          <br />

          <div className="blog_content" dangerouslySetInnerHTML={{ __html: this.props.message.content }} />

          <br />
          <br />
          <div className="partition-line"></div>
          <br />

          <div className="tag-bar">
            <div className="tags-name">Tags:</div>
            {this.props.message.taglist ? (
              <div>

                {this.props.message.taglist.map((item, index) => (
                  < span className="tags">{item + "  "}</span>
                ))

                }
              </div>
            ) : (
                <div></div>
              )}
          </div>

          {/* upvote downvote */}
          <div className="voting">
            <div className="upvote-box">
              {this.state.upvoted ? (
                <img className="upvote" src={require('./images/upvote.png')} alt="upvote" />
                /*<button disabled className="upvoted_blog">Upvote: {(this.props.message.upvote.length) - 1}       </button> */
              ) : (
                  <img className="upvote" src={require('./images/upvote_bw.png')} alt="upvote" onClick={this.handleUpvote.bind(this)} />
                  /*<button onClick={this.handleUpvote.bind(this)} >Upvote : {(this.props.message.upvote.length) - 1}       </button>    */
                )}

              <div className="count">{(this.props.message.upvote.length) - 1}</div>
            </div>


            <div className="downvote-box">
              {this.state.downvoted ? (
                <img className="downvote" src={require('./images/downvote.png')} alt="downvote" />
                /*<button disabled className="downvoted_blog">Downvote : {(this.props.message.downvote.length) - 1}       </button> */
              ) : (
                  <img className="downvote" src={require('./images/downvote_bw.png')} alt="downvote" onClick={this.handleDownvote.bind(this)} />
                  /* <button onClick={this.handleDownvote.bind(this)}>Downvote : {(this.props.message.downvote.length) - 1}       </button>  */
                )}
              <div className="count">{(this.props.message.downvote.length) - 1}</div>
            </div>
          </div>

          <br />
          <div className="partition-line-2"></div>



          <div className="comments-section">
            <div className="comments-name">Comments</div>
            <div className="partition-line-3"></div>
            {this.props.message.commentlist ? (
              <div className="comment-main">
                {this.props.message.commentlist.map(element =>
                  (element) ?
                    (
                      <Comment message={element} />)
                    : (<div></div>)
                )
                }
              </div>
            ) : (
                <div className="no-comments">(No comments yet)</div>
              )
            }
            <div className="comment-btn" onClick={this.handleAddcomment.bind(this)}>Add a comment</div>
            <br />
            <br />
            <br />
            <br />
            <br />

            {this.state.viewcomments ? (
              <div className="close-comment-btn-div">
                <Addcomment message={this.props.message} />
                <div className="for-space-2"></div>
                <div className="close-comment-btn" onClick={this.handleChangeView.bind(this)}>+</div>
                {/* <Comment message={this.state.commentlist}/> */}
              </div>
            ) : (
                <div></div>
              )}

            <div className="for-space-2"></div>

          </div>

          
          {this.state.isModerator || this.state.curr_user==this.props.message.userName ? (
            <div className="remove-blog-btn" onClick={this.handleRemove.bind(this)}>Remove this blog</div>
          ):(<div></div>)
        }
          
          <div className="for-space-3"></div>
          


          {/*<div className="myclass"></div>*/}

        </div>

      </div>
    );
  }
}
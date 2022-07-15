import React, { Component } from 'react';
import firebase from "firebase";
import { Redirect } from "react-router-dom";
import "./css/account.css"
var mail;
var x;
var k;
var add;
var key;
var b;

class Account extends Component {

  constructor(props) {
    super(props);

    this.state = {
      redirect: false,
      userEmail: ' ',
      userName: ' ',
      isModerator: false,
      cf_handle: ' ',
      hasHandle: false,
      isSignedIn: true,
      openDialogue: false,
    };
    k = "00";
    key = "Moderator";
    // key = "we_still_dont_have_a_good_name_for_this.........!!";
    //this.userentry = firebase.database().ref().child('users');
  }

  componentDidMount = () => {
    // window.location.reload();
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ isSignedIn: !!user })
      //console.log("user",user);
      if (this.state.isSignedIn) this.getData();
    })
  }

  handleonClick = () => {
    firebase.auth().signOut();
    this.setState({ redirect: true })
  }

  handleChange(event) {
    this.setState({ cf_handle: event.target.value });
    add = event.target.value;
  }

  handleKeyPress(event) {
    if (event.key !== 'Enter') return;
    this.handlePush();
  }

  handlePush() {
    var curr_key;
    var query;
    firebase.database().ref().child("users").once("value").then((snapshot) => {
      snapshot.forEach(function (child) {
        var temp = child.val();
        if (temp.userEmail == (String(mail))) {
          curr_key = child.key;
          firebase.database().ref().child("users").child(curr_key).update({ cf_handle: add });
        }
      })
    })
    document.getElementById('username_box').value = "";
  }
  getData = () => {
    mail = firebase.auth().currentUser.email;
    console.log(mail);

    var y = 1;
    var data_list = [];
    var z = 1;

    firebase.database().ref().child("users").once("value").then((snapshot) => {
      snapshot.forEach(function (child) {
        var temp = child.val().userEmail;
        data_list.push(temp);
        if (temp == (String(mail))) {
          //y = 2;
          x = child.val().userName;
          k = child.val().cf_handle;
          b = child.val().isModerator;
        }
      })
      this.setState({ userName: x });
      this.setState({ isModerator: b });
      if (k == undefined || k == null || k == "00") {
        this.setState({ hasHandle: false });
        this.setState({ cf_handle: x })
      }
      else {
        this.setState({ hasHandle: true });
        this.setState({ cf_handle: k });
      }
    })
  }

  modAccess() {
    this.setState({ openDialogue: true });
  }

  handleChangeVal(event) {
    this.setState({ key_entered: event.target.value });
    add = event.target.value;
  }

  handleKeyPressVal(event) {
    if (event.key !== 'Enter') return;
    if (event.target.value == key) {
      this.handleAccess();
      this.setState({ openDialogue: false });
    }
    else {
      alert("Wrong moderator key...!! Try hacking it better...!! :p");
      document.getElementById('moderator_access').value = "";
      this.setState({ openDialogue: false });
    }
  }

  handleAccess() {
    mail = firebase.auth().currentUser.email;
    var curr_key;
    var query;
    firebase.database().ref().child("users").once("value").then((snapshot) => {
      snapshot.forEach(function (child) {
        var temp = child.val();
        if (temp.userEmail == (String(mail))) {
          curr_key = child.key;
          firebase.database().ref().child("users").child(curr_key).update({ isModerator: true });
        }
      })
    })
    alert("You are now a Moderator....!!")
    document.getElementById('moderator_access').value = "";
  }
  render() {

    if (this.state.redirect) {
      return (<Redirect to="/login" />)
    }

    return (
      <div className="profile-main-page">
        <div className="name">Profile page</div>

        <div className="user-details">

          {firebase.auth().currentUser && <img className="prof-pic" alt="Your profile picture" src={firebase.auth().currentUser.photoURL} />}

          <div className="name-1">
            <div className="name1-def">Name:</div>
            {firebase.auth().currentUser && <div className="name-prof">{firebase.auth().currentUser.displayName} </div>}
          </div>

          <div className="email-2">
            <div className="email1-def">E-mail:</div>
            {firebase.auth().currentUser && <div className="email-prof">{firebase.auth().currentUser.email} </div>}
          </div>

          <div className="username1-3">
            <div className="username1-def">Username:</div>
            <div className="username-prof">{this.state.userName} </div>
          </div>

          <div className="horizontal_line"></div>

          <br />
          <div className="codeforces">
            Your codeforces handle:{" "}
            <input type="text"
              id="username_box"
              placeholder={this.state.cf_handle}
              autoComplete="off"
              onChange={this.handleChange.bind(this)}
              onKeyPress={this.handleKeyPress.bind(this)}
            ></input>
          </div>
        </div>


        <div className="moderator-control">
          {this.state.isModerator ? (
            <div className="already_moderator">You are already a moderator.</div>
          ) : (
              <div>
                <button className="moderator_access" onClick={this.modAccess.bind(this)}>Request Moderator Access</button>
                {this.state.openDialogue ? (
                  <div className="mod-passwd">
                    <input type="password"
                      id="moderator_access"
                      placeholder="Enter the moderator key here..."
                      autoComplete="off"
                      onChange={this.handleChangeVal.bind(this)}
                      onKeyPress={this.handleKeyPressVal.bind(this)}>
                    </input>
                  </div>
                ) : (
                    <div></div>
                  )}
              </div>
            )}
        </div>
        <button className="logout_btn" onClick={this.handleonClick}>Logout</button>
      </div>
    );
  }
}

export default Account;

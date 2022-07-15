import React, { Component } from 'react';
import firebase from "firebase"
//import Header from './Header'
//import NewPage from './NewPage'
//import check from './check'
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth"
//import SignedIn from './SignedIn'
//import { throws } from 'assert';
import { Route, Redirect } from 'react-router'
import "./css/loginpage.css";

var x;
var mail;

class Page extends Component {

  constructor(props) {
    super(props);

    this.state = {
      userEmail: ' ',
      userName: ' ',
      cf_handle: ' ',
      isModerator: false,
      isSignedIn: false,
      isUser: false,
      nowChange: false,
    };
    //this.userentry = firebase.database().ref().child('users');
  }
  uiConfig = {
    signInFlow: "popup",
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      //firebase.auth.GithubAuthProvider.PROVIDER_ID,
      //firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInAuthSuccess: () => false
    }
  }

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ isSignedIn: !!user })
      console.log("user", user);
      if (this.state.isSignedIn) this.checkUser();
    })
  }

  handleChange(event) {
    this.setState({ userName: event.target.value });
    x = event.target.value;
    console.log("username1", String(event.target.value));
  }
  handleKeyPress(event) {
    if (event.key !== 'Enter') return;
    if (x.length > 40) {
      alert("The username should be less than 40 characters long. Kindly set one accordingly...!!");
      document.getElementById('textbox').value = "";
      return;
    }
    this.handleAdd();
  }

  handleAdd(event) {
    console.log("username", String(x));
    var y = 1;
    var data_list = [];
    var z = 1;

    firebase.database().ref().child("users").once("value").then((snapshot) => {
      snapshot.forEach(function (child) {
        var temp = child.val().userName;
        data_list.push(temp);
        if (temp == (String(x))) {
          y = 2;
        }
      })

      console.log(data_list, data_list.length);
      z = 2;
      if (y == 1 && z == 2) {
        alert("Registered successfully..!!");
        firebase.database().ref().child('users').push({
          userEmail: firebase.auth().currentUser.email,
          userName: String(x),
          isModerator: false,
          cf_handle: String(x),
        });
        this.setState({ nowChange: true });

      }
      if (y == 2) {
        alert("Username already taken...!!");
        console.log("found", String(y));
        document.getElementById('textbox').value = "";
      }
    })
  }

  handleSignOut() {
    firebase.auth().signOut();
  }

  checkUser() {
    mail = firebase.auth().currentUser.email;
    console.log(mail);
    var a = 1;
    var list = [];
    var b = 1;
    //alert("Aaya..!!");
    console.log("heyyy...!!");
    firebase.database().ref().child("users").once("value").then((snapshot) => {
      snapshot.forEach(function (child) {
        var temp = child.val().userEmail;
        list.push(temp);
        if (temp == (String(mail))) {
          a = 2;
        }
      })

      console.log(list, list.length);
      b = 2;
      if (a == 1 && b == 2) {
        // is not a user
        this.setState({ isUser: false })
      }
      if (a == 2) {
        // is User
        this.setState({ isUser: true })
        this.setState({ nowChange: true })
      }
    })
  }

  render() {
    if (this.state.nowChange) {
      return (<Redirect to="/header/dashboard" />)
    }
    return (
      <div className="page_login">
        {this.state.isSignedIn ? (
          <div className="page_2">
            <div className="header_user">
              <div className="status">You have succesfully logged in.</div>
              <div className="display_usrnm">Welcome {firebase.auth().currentUser.displayName}.</div>
            </div>

            {this.state.isUser ? (
              <div>
                <div className="info">Wait till we redirect you to the grandeur of all platforms...!!</div>
              </div>
            ) : (
                <span>
                  <div className="info"> You will need to enter a <div className="unique">unique</div> USERNAME to enroll yourself as a user here.</div>
                  <div className="info_2">Enter the name in the textbox given below and press "Enter". </div>
                  <input type="text"
                    id="textbox"
                    autoComplete="off"
                    placeholder="Enter a unique username "
                    onChange={this.handleChange.bind(this)}
                    onKeyPress={this.handleKeyPress.bind(this)}>
                  </input>
                </span>
              )}

          </div>
        ) : (
            <div className="login_back">

              {/* <div className="parallel_1" />
              <div className="parallel_2" />
              <div className="parallel_3" />
              <div className="parallel_4" /> */}
              {/* <div className="space_1" /> */}

              <div className="think_1">THINK TWICE</div>
              <div className="think_2">CODE ONCE!</div>
              <div className="but_first">but</div>
              <div className="but_first">first,</div>
              <div className="think_3">LOGIN!</div>

              <StyledFirebaseAuth
                uiConfig={this.uiConfig}
                firebaseAuth={firebase.auth()}
              />

            </div>
          )}
      </div>
    );
  }
}

export default Page
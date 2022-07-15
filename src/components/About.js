import React, { Component } from 'react';
import firebase from "firebase";
import { Redirect } from "react-router-dom";
import "./css/about.css"
var mail;
var x;
var k;
var add;
var key;
var b;

class About extends Component {

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
    return (
      <div className="main_page">

        <div className="team">The Team</div>
        <div className="line" />
        <div className="contain_all">
          <div className="member_1">
            {/* <img className="photo" alt="name here" src={require('Put your image here')} />  */}
            <div className="line" />
            <div className="name_team"> NAME HERE</div>
            <div className="line" />
            <div className="work_team">ROLL HERE</div>
          </div>

          <div className="member_2">
            {/* <img className="photo" alt="name here" src={require('Put your image here')} /> */}
            <div className="line" />
            <div className="name_team">NAME HERE</div>
            <div className="line" />
            <div className="work_team">ROLL HERE</div>
          </div>

          <div className="member_3">
            {/* <img className="photo" alt="name here" src={require('')} /> Put your image here */}
            <div className="line" />
            <div className="name_team">NAME HERE</div>
            <div className="line" />
            <div className="work_team">ROLL HERE</div>
          </div>

          <div className="member_4">
            {/* <img className="photo" alt="name here" src={require('put your image here')} /> */}
            <div className="line" />
            <div className="name_team">NAME HERE</div>
            <div className="line" />
            <div className="work_team">ROLL HERE</div>
          </div>

          <div className="member_5">
            {/* <img className="photo" alt="name here" src={require('put your image here')} /> */}
            <div className="line" />
            <div className="name_team">NAME HERE</div>
            <div className="line" />
            <div className="work_team">ROLL HERE</div>
          </div>

          <div className="member_6">
            {/* <img className="photo" alt="name here" src={require('put your image here')} /> */}
            <div className="line" />
            <div className="name_team">NAME HERE</div>
            <div className="line" />
            <div className="work_team">ROLL HERE</div>
          </div>

          <div className="member_7">
            {/* <img className="photo" alt="name here" src={require('put your image here')} /> */}
            <div className="line" />
            <div className="name_team">NAME HERE</div>
            <div className="line" />
            <div className="work_team">ROLL HERE</div>
          </div>

          <div className="member_8">
           {/* <img className="photo" alt="name here" src={require('put your image here')} /> */}
            <div className="line" />
            <div className="name_team">NAME HERE</div>
            <div className="line" />
            <div className="work_team">ROLL HERE</div>
          </div>

        </div>

      </div>
    );
  }
}

export default About

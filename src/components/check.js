import React, { Component } from 'react';
import firebase from "firebase";
import {Redirect} from "react-router-dom";

var mail;
var x;
var k;
var add;

class Check extends Component {

    constructor(props) {
      super(props);

      this.state =  {
        redirect: false,
        userEmail: ' ',
        userName: ' ',
        isModerator: false,
        cf_handle: ' ',
        hasHandle: false,
        isSignedIn: true,
      };
      k = "00"
      //this.userentry = firebase.database().ref().child('users');
    }

    componentDidMount = () => {
      firebase.auth().onAuthStateChanged(user => {
        this.setState({isSignedIn:!!user})
        //console.log("user",user);
        if(this.state.isSignedIn) this.getData();
      })
    }

    handleonClick =()=> {
     firebase.auth().signOut();      
     this.setState({redirect:true})
    }

    handleChange(event) {
      this.setState({cf_handle: event.target.value});
      add=event.target.value;
    }

    handleKeyPress(event) {
      if(event.key!=='Enter') return;
       this.handlePush();
    }

     handlePush() {
      var curr_key;
      var query;
      firebase.database().ref().child("users").once("value").then((snapshot) => {
        snapshot.forEach(function(child)
        {
          var temp = child.val();
          if(temp.userEmail == (String(mail))) {
            curr_key = child.key;
            firebase.database().ref().child("users").child(curr_key).update({cf_handle: add});
          }
        })
      })
      document.getElementById('username_box').value = "";
    }
    getData = () => {
      mail =  firebase.auth().currentUser.email;
      console.log(mail);
      
      var y = 1;
      var data_list = [];
      var z = 1;

      firebase.database().ref().child("users").once("value").then((snapshot) => {
        snapshot.forEach(function(child)
        {
          var temp = child.val().userEmail;
          data_list.push(temp);
          if(temp == (String(mail))) {
            //y = 2;
            x = child.val().userName;
            k = child.val().cf_handle;
          }
        })
        this.setState({userName: x})
        if(k==undefined || k==null || k=="00") {
          this.setState({hasHandle: false});
          this.setState({cf_handle: x})
        }
        else {
          this.setState({hasHandle: true});
          this.setState({cf_handle: k});
        }
      })
    }
    render() {

      if(this.state.redirect){
        return(<Redirect to="./login"/>)
      }

      return (
        <div className="head">
          <h1>This is just check!! </h1>
          {firebase.auth().currentUser && <label> Name: {firebase.auth().currentUser.displayName} </label>}
          <br />
          {firebase.auth().currentUser && <label> Name: {firebase.auth().currentUser.email} </label>}
          < br />
          <label> Username: {this.state.userName} </label>
          <br />
            <label>
              Your codeforces handle:
              <input type = "text"
                id = "username_box"
                placeholder = {this.state.cf_handle}
                onChange = {this.handleChange.bind(this)}
                onKeyPress = {this.handleKeyPress.bind(this)}
                ></input>
            </label>
            <br />
          <button onClick = {this.handleonClick}>Log out...!! </button>
        </div>
      );
    }
  }

  export default Check
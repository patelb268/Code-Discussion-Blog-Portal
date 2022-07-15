import React, { Component } from "react";

import Addcomment from "./Addcomment";

import firebase from "firebase";
import Tutorial from "./Tutorial";
import { Link } from "react-router-dom";
import "./css/tutorial.css";
var mail, x, k, b;

class TutorialArea extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userName: "User",
      title: "",
      tutorialid: 0,
      content: " ",
      timestamp: 0,
      list: [],
      temp: [],
      numoftutorial: "5",
      isModerator: false
    };
    this.tutorialRef = firebase
      .database()
      .ref("tutorial_entry");

    this.listenTutorials();

  }

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ isSignedIn: !!user })
      if (this.state.isSignedIn) this.getData();
    })

    this.listenTutorials();
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



  listenTutorials() {


    this.tutorialRef.orderByPriority().limitToFirst(20).on("value", message => {
      this.setState({
        list: Object.values(message.val())
      });
    });


  }

  handleViewMore(event) {
    this.listenTutorials();
  }




  render() {
    return (
      <div className="tut-page">

        <div className="name">Tutorials</div>

        {this.state.isModerator ? (
          <Link to="/header/addtutorial" className="Add-Blog-button">
            +
          </Link>
        ) : (
            <div></div>
          )}


        {this.state.list ? (
          <div>

            {this.state.list.map((item, index) => (
              <Tutorial key={index} message={item} />
            ))
            }
          </div>
        ) : (
            <div></div>
          )}
        {/* <button onClick={this.handleViewMore.bind(this)}>View More</button>   */}
      </div>
    );
  }
}
const Mystyle = {
  padding: "50px"
};

export default TutorialArea;


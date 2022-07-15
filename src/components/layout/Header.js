import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import "../Account";
//import PropTypes from 'prop-types'
//import { DropdownButton, Dropdown } from 'react-bootstrap';
//import Dropdown from 'react-bootstrap/Dropdown';
//import {Navbar, Nav, NavDropdown, Form, FormControl, Button} from 'bootstrap';
//import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import firebase from "firebase";
import { Redirect } from "react-router-dom";
//import console = require("console");



export class Header extends Component {

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ isSignedIn: !!user })
      //console.log("user",user);
    })
  }

  refreshPage = () => {
    window.location.reload();
  };

  //for drop down button starting here...
  constructor() {
    super();

    this.state = {
      showMenu: false,
      redirect:false,
      redirect2:false
    };

    this.showMenu = this.showMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
  }

  showMenu(event) {
    event.preventDefault();

    this.setState({ showMenu: true }, () => {
      document.addEventListener("click", this.closeMenu);
    });
  }

  closeMenu(event) {
    if (this.dropdownMenu && !this.dropdownMenu.contains(event.target)) {
      this.setState({ showMenu: false }, () => {
        document.removeEventListener("click", this.closeMenu);
      });
    }
  }
  // till here...

  handleonClick() {
    /*console.log(event.target);
    closeMenu(event);*/
    // this.setState({ showMenu: false }, () => {
    //   document.removeEventListener("click", this.closeMenu);
    // });
    firebase.auth().signOut();
    this.setState({ redirect: true });
  };

  openAccount=()=>
  {
    this.setState({redirect2:true});
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to="/login" />;
    }
    if(this.state.redirect2)
    {
      return <Redirect to="/header/"/>;
    }
    return (
      <div className="headerStyle">
        <div className="header-topbar">
          <img
            className="app-logo"
            src={require("../images/logo.png")}
            alt="logo"
          />
          <div className="app-name">The Programming Club App</div>

          {/*  <div className="profile">
            <img className="dp" src={require('../images/avatar-01.jpg')} alt="logo" />
            <div className="username">Parva</div>
          </div>
    */}

          <div className="profile" onClick={this.showMenu}>

            {firebase.auth().currentUser && <img className="dp" alt="Your profile picture" src={firebase.auth().currentUser.photoURL} />}

            {/* <img
              className="dp"
              src={require("../images/avatar-01.jpg")}
              alt="profile"
            /> */}

            {firebase.auth().currentUser && <div className="username">{firebase.auth().currentUser.displayName}</div>}
            <p className="arrow-down">^</p>
            {this.state.showMenu ? (
              <div
                className="menu"
                ref={element => {
                  this.dropdownMenu = element;
                }}
              >
                <div className="dropitems-view-only">

                  {firebase.auth().currentUser && <img className="dp-big" alt="Your profile picture" src={firebase.auth().currentUser.photoURL} />}

                  {/* <img
                    className="dp-big"
                    src={require("../images/avatar-01.jpg")}
                    alt="profile"
                  /> */}

                  <div className="name-email">
                    {firebase.auth().currentUser && <p className="username-big">{firebase.auth().currentUser.displayName}</p>}
                    {firebase.auth().currentUser && <p className="email-big">{firebase.auth().currentUser.email}</p>}
                  </div>
                </div>
                <div className="line" />
                <Link className="dropitems_link" to="/header/Account">Account</Link>
                <div className="dropitems" onClick={this.handleonClick.bind(this)}>Logout</div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="tabs">
          <Link to="/header/dashboard" className="linkStyle">
            Recommendations
          </Link>

          <Link to="/header/Tutorial" className="linkStyle">
            Tutorials
          </Link>

          <Link to="/header/blogs" className="linkStyle">
            Blogs
          </Link>

          <Link to="/header/Discussion" className="linkStyle">
            Discussion Forum
          </Link>

          <Link to="/header/calendar" className="linkStyle">
            Calendar
          </Link>

          <Link to="/header/about" className="linkStyle">
            About
          </Link>
        </div>
        {/*<div className="timepass">hello</div>*/}
      </div>
    );
  }
}

export default Header;

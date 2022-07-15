import React, { Component } from "react";
import Header from "./components/layout/Header";
import About from "./components/About";
import Dashboard from "./components/Dashboard";
//import Blogaddition from "./components/addBlog";
//import Calendar from "./components/Calendar";
import AddBlog from "./components/AddBlog";
import AddDiscussion from "./components/AddDiscussion";
import NewCalendar from "./components/NewCalendar";
import BlogArea from "./components/BlogArea";
import DiscussionArea from "./components/DiscussionArea";
import firebase from "firebase";
import firebaseConfig from "./components/config";
import { HashRouter as Router, Route } from "react-router-dom";
import "./App.css";
//import Blogs from "./components/Blogs";
import { Editor } from "react-draft-wysiwyg";
import { EditorState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Account from "./components/Account";
import TutorialArea from "./components/TutorialArea";
import TutorialPage from "./components/TutorialPage";
import AddTutorial from "./components/AddTutorial";
import LoginPage from "./components/LoginPage";
import { Redirect } from "react-router";

import DiscussionPage from "./components/DiscussionPage";

firebase.initializeApp(firebaseConfig);

class App extends Component {
  // state = {
  //   start: true
  // };
  // onStart = () => {
  //   this.setState({ start: false });
  //   return <Redirect to="/login" />;
  // };
  render() {
    // {
    //   this.onStart();
    // }
    return (
      <Router>
        <div className="App" style={Appstyle}>
          <div className="contain">
            <Route exact path="/" render={() => <Redirect to="/login" />} />
            {/* <Redirect from="/" to="/login" /> */}
            {/* {this.state.start ? this.onStart() : <React.Fragment />} */}
            <Route path="/login" component={LoginPage} />
            {/* <LoginPage /> */}
            <Route path="/header" component={Header} />
            {/* <Header /> */}
            {/* <Route
              exact
              path="/"
              render={props => (
                <React.Fragment>
                  <Dashboard />
                </React.Fragment>
              )}
            /> */}
            <Route
              exact
              path="/header/blogs"
              render={props => (
                <React.Fragment>
                  {/* <AddBlog /> */}
                  <BlogArea />
                </React.Fragment>
              )}
            />
            <Route path="/header/addblog" component={AddBlog} />
            <Route path="/header/addtutorial" component={AddTutorial} />
            <Route path="/header/dashboard" component={Dashboard} />
            <Route path="/header/Account" component={Account}/>
          {/*  <Route
              exact
              path="/header/discussion"
              render={props => (
              <React.Fragment>			*/}
                  {/* <AddBlog /> */}
          {/*        <DiscussionArea />
                </React.Fragment>
              )}
            />
              <Route path="/header/adddiscussion" component={AddDiscussion} />	*/}

    	<Route
              exact
              path="/header/discussion"
        
              render={props => (
                <React.Fragment>
                  {/* <AddDiscussion /> */}
                  <DiscussionArea />
                </React.Fragment>
              )}
            />
            <Route
              path="/header/discussion/:id"
              render={props => (
                <React.Fragment>
                  <DiscussionPage {...props}/>
                </React.Fragment>
              )}
            /> 
            
            <Route path="/header/adddiscussion" component={AddDiscussion}/>
            




            <Route
              exact
              path="/header/Tutorial"
              render={props => (
                <React.Fragment>
                  {/* <AddTutorial /> */}
                  <TutorialArea />
                </React.Fragment>
              )}
            />
            <Route
              path="/header/Tutorial/:id"
              render={props => (
                <React.Fragment>
                  <TutorialPage {...props} />
                </React.Fragment>
              )}
            />
            <Route path="/header/calendar" component={NewCalendar} />
            <Route path="/header/about" component={About} />
          </div>
        </div>
      </Router>
    );
  }
}
const Appstyle = {
  padding: "0px",
  margin: "0px"
};

export default App;

import React, { Component } from "react";
import "./css/tutorial.css";
import Addcomment from "./Addcomment";
import Comment from "./Comment";

import htmlToDraft from 'html-to-draftjs';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import firebase from "firebase";
import ReadTutorial from "./ReadTutorial"

import { Link } from "react-router-dom";

//import {WebView} from 'react-native';


export default class Tutorial extends Component {

  
  constructor(props) {
    super(props);
    this.state = {
      content: " ",
      curr_user: 'Dhvanee',
      viewTutorial:false,
      curr_id:0,
    };

  }

  
  
  

  

  handleChange_content(event) {
    this.setState({ content: event.target.value });
  }

  
  handleKeyPress(event) {
    if (event.key !== "Enter") return;
    this.handleSend();
  }

  
  
  handleAddTutorial=(event)=> {

    console.log(event.target.viewTutorial)
    
    if(!this.viewTutorial)
      {
          console.log("BYE WORLD")
            this.setState({ viewTutorial: true });
            return ;
      }
      else
      {
          console.log("HELLO WORLD")
        this.setState({ viewTutorial: false});
        return ;
    }
}

  

  
  render() {
    
    return (
    <div className="tutorial">

    <Link className="blog-name" to={{ pathname:`/header/Tutorial/${this.props.message.title}`, state: {...this.props} }}> {this.props.message.title} </Link>

    </div> 
    );
  }
}


import React, { Component } from "react";
import "./css/tutorial.css";

class TutorialPage extends Component {
  constructor(props) {
    super(props);
   
    
  // console.log(this);
  }
  render() {
    console.log(this);
    return (
      <div className="content">
        <div className="title-tutorial">{this.props.match.params.id}</div>
        <div className="tut-topic-content" dangerouslySetInnerHTML={{__html: this.props.location.state.message.content}} />
      </div>
    );
  }
}


export default TutorialPage;

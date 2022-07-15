import React, { Component } from "react";
import "./css/tutorial.css";
import { Link } from "react-router-dom";

export default class Discussion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      curr_user: 'Prayag'
    };
  }



  render() {
    return (
      <div className="tag-bar">
        <div className="tutorial">
          <Link className="blog-name" to={{ pathname: `/header/Discussion/${this.props.message}`, state: { ...this.props } }}> {this.props.message} </Link>
        </div>
      </div>

    );
  }
}

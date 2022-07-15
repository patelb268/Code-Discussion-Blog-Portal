import React, { Component } from "react";
import Discussion from "./Discussion";
import Addcomment from "./Addcomment";
import "./css/tutorial.css";

import { Link } from "react-router-dom";
import firebase from "firebase";



class DiscussionArea extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userName: "User",
      title: "",
      list: [],
      check: []
    };
    this.discussionRef = firebase
      .database()
      .ref("discussion_entry");
      
    this.listenDiscussions();
      
  }


  
 async listenDiscussions() {
   
    
    await this.discussionRef.orderByPriority().limitToFirst(20).on("value", message => {
    this.setState({
        list: Object.values(message.val())
      });
      
      var x= Object.values(message.val())
      var temp1=this.state.check;  
      x.forEach(element => {
        var y = element;
        var tags= y.taglist;  
        if(tags)
        {
          tags.forEach(element => {
          if(!temp1.includes(element))
            temp1.push(element);
            return;
        });
        }
      });
      this.setState({check:temp1});
   
    });
  }

  handleViewMore(event)
  {
    this.listenDiscussions();
  }




  render() {

    return (
      
      <div className="blog-main-page">

         <div className="name">Discussion</div>

           <Link to="/header/adddiscussion" className="Add-Blog-button">
               +
           </Link>

      {/* <button onClick={this.handleViewMore.bind(this)}>View Once More</button>   */}
      
        {this.state.check ? (   
          <div>    
          
         {this.state.check.map((item, index) => (
          <Discussion key={index} message={item}/>
          ))
         }
          </div>
      ) : (
        <div></div>
      )}
      </div>
    );
  
  
  }
}


export default DiscussionArea;

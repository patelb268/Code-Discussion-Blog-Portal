import React, { Component } from "react";
import "./css/tutorial.css";
import Addcomment from "./Addcomment";
import Comment from "./Comment";

import Fdiscussion from "./final_discussion";
import firebase from "firebase";

class DiscussionPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: " ",
      curr_user: 'Prayag',
      upvoted: false,
      downvoted: false,
      viewcomments: false,
      commentlist: false,
      comment_obj_list: [],
      curr_id: 0,
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
    var cur_tag = this.props.match.params.id;
    x.forEach(element => {
      var y = element;
      var tags= y.taglist;  
      console.log(y);
     if(tags)
      {
        tags.forEach(element => {
        if(element===cur_tag && !temp1.includes(y))
        {
            temp1.push(y);     
        }
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
    console.log(this);
    return (
      <div className="tut-page">
      <br></br>
      <div className="name">Topic: {this.props.match.params.id} </div>
      <br></br>
      <br></br>
      <br></br>
        
    
      
      {/* <button onClick={this.handleViewMore.bind(this)}>View Once More</button>   */}
      
      {this.state.check ? (   
        <div>    
        
       {this.state.check.map((item, index) => (
        <Fdiscussion key={index} message={item}/>
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

const Mystyle = {
  padding: "50px"
};

export default DiscussionPage;

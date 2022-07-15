// Haal Aa Page kaamnu nathi 
// Aagal Jata God Knows

// import React, { Component } from "react";
// import "./Blog.css";
// import Addcomment from "./Addcomment";
// import Comment from "./Comment";

// import htmlToDraft from 'html-to-draftjs';
// import { EditorState, convertToRaw, ContentState } from 'draft-js';
// import firebase from "firebase";
// import { Link } from "react-router-dom";

// //import {WebView} from 'react-native';

// export default class Tutorial extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       content: " ",
//       curr_user: 'Dhvanee',
//       upvoted:false,
//       downvoted:false,
//       viewcomments:false,
//       commentlist:false,
//       viewtutorial: false,
//       comment_obj_list:[],
//       curr_id:0,
//     };

//     this.calculate_vote();
//   }
  

//   calculate_vote()
//   {
//     this.state.upvoted= (this.props.message.upvote.includes(this.state.curr_user)) ? true : false;
//     this.state.downvoted= (this.props.message.downvote.includes(this.state.curr_user)) ? true : false;
    
//    // console.log(this.commentlist);
    
//     // console.log(this.commentlist);
//   //  this.state.upvoted=this.state.downvoted = (this.state.upvoted || this.state.downvoted);
//   }
  
//   handleUpvote() {
    
//     if(this.state.downvoted) return;
//     this.props.message.upvote.push(this.state.curr_user);

//     var tempid=this.props.message.id;
//     var upvotearray=this.props.message.upvote;
//     var curr_key;

//     var query = firebase.database().ref("blog_entry").orderByKey();
   
//    query.once("value")
//   .then(function(snapshot) {
//     snapshot.forEach(function(childSnapshot) {

//       var childData = childSnapshot.val();
      
//       if(childData.id==tempid)
//       {
//         curr_key=childSnapshot.key;
//        // console.log(curr_key);
//         firebase.database().ref().child("blog_entry").child(curr_key).update({upvote : upvotearray} );
        
//       }
//   });
// });

//     this.setState({upvoted:true});
//   }

//   handleDownvote() {
    
//     if(this.state.upvoted) return;
//     this.props.message.downvote.push(this.state.curr_user);

//     var tempid=this.props.message.id;
//     var downvotearray=this.props.message.downvote;
//     var curr_key;

//     var query = firebase.database().ref("blog_entry").orderByKey();
   
//    query.once("value")
//   .then(function(snapshot) {
//     snapshot.forEach(function(childSnapshot) {

//       var childData = childSnapshot.val();
      
//       if(childData.id==tempid)
//       {
//         curr_key=childSnapshot.key;
//         //console.log(curr_key);
//         firebase.database().ref().child("blog_entry").child(curr_key).update({downvote : downvotearray} );
        
//       }
//   });
// });

//     this.setState({downvoted:true});
//   }

//   handleChange_content(event) {
//     this.setState({ content: event.target.value });
//   }

//   handleAddcomment(event) {
//     this.setState({ viewcomments: true });
//   }
//   handleKeyPress(event) {
//     if (event.key !== "Enter") return;
//     this.handleSend();
//   }

//   handleChangeView()
//   {
//     this.setState({ viewcomments: false });
//   }

//   handleCloseTutorial()
//   {
//     this.setState({ viewtutorial: true });
//   }

//   render() {
//     return (
      
//       <div className="message">
//         <Link to={{ pathname:`/Tutorial/${this.props.message.title}`, state: {...this.props} }}> {this.props.message.title} </Link>
//         < br />
      
//       </div>
//     );
//   }
// }


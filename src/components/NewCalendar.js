import React, { Component } from "react";
import Calendar from "react-big-calendar";
import moment from "moment";
import firebase from "firebase";
// import Popup from "reactjs-popup";
import Popup from "reactjs-popup";
//import { Redirect } from "react-router-dom";

import "./css/calender.css";

import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = Calendar.momentLocalizer(moment);
var mail;
var x;
var k;
var b;

class BigCalendar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      events: [
        {
          id: "",
          end: "",
          link: "",
          start: "",
          title: "",
          description: ""
        }
      ],
      isModerator: true,
      has_handle: false,
      cf_handle: ",",
      nowChange: false
    };
    this.calendarRef = firebase
      .database()
      .ref()
      .child("calendar_entry");
    this.listenCalendar();
    var currid = 0;
    this.onClick = this.onClick.bind(this);
    firebase
      .database()
      .ref()
      .child("calendarid")
      .on(
        "value",
        function(snapshot) {
          currid = snapshot.val();
          console.log(currid);
        },
        function(error) {
          console.log("Error: " + error.code);
        }
      );
  }

  listenCalendar = async () => {
    var query = firebase
      .database()
      .ref("calendar_entry")
      .orderByKey();
    var temp = [];
    var arr = [];

    await query.once("value").then(function(snapshot) {
      //console.log(snapshot);
      snapshot.forEach(function(childsnapshot) {
        //console.log(childsnapshot);
        var temp1 = childsnapshot.val();
        if (childsnapshot.key == "events") {
          //temp = temp1.events;
          //console.log("fgh");
          for (var x in temp1) {
            arr.push(temp1[x]);
          }
          //console.log(arr[0].link);
        }
      });
    });
    this.printCalendar(arr);

    // var arr = [];
    // for (var x in temp) {
    //   arr.push(x);
    //   //console.log(x);
    // }
    //console.log(arr);

    // this.calendarRef
    //   .child("-LbwXA4UizTfvIJuXBYh")
    //   .child("events")
    //   .limitToLast(4)
    //   .on("value", message => {
    //     console.log(Object.values(message.val()));
    //     var temp = Object.values(message.val());
    //     this.setState({
    //       events: temp
    //     });
    //   });
    //console.log(this.state.events);

    //console.log(this.state.events);
  };
  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({isSignedIn:!!user})
      //console.log("user",user);
      if(this.state.isSignedIn) this.getData();
    })
  }
  // state = {
  //   isModerator: true,
  //   events: [
  //     {
  //       start: new Date(),
  //       end: new Date(moment().add(1, "days")),
  //       title: "IPC 2 Long",
  //       link:
  //         "https://github.com/intljusticemission/react-big-calendar/blob/master/examples/demos/basic.js"
  //     },
  //     {
  //       start: new Date(2019, 2, 11),
  //       end: new Date(2019, 2, 11),
  //       title: "Some title 2",
  //       link:
  //         "https://github.com/intljusticemission/react-big-calendar/blob/master/examples/demos/basic.js"
  //     }
  //   ],
  //   value: {
  //     from: "",
  //     to: "",
  //     title: ""
  //   }
  // };

  printCalendar = arr => {
    for (var i in arr) {
      this.setState({
        events: [
          ...this.state.events,
          {
            id: arr[i].id,
            start: arr[i].start,
            end: arr[i].end,
            title: arr[i].title,
            link: arr[i].link,
            description: arr[i].description
          }
        ]
      });
    }
    console.log(this.state.events);
  };
  onChange1 = e => {
    this.setState({
      value: {
        ...this.state.value,
        from: e.target.value
      }
    });
  };
  onChange2 = e => {
    this.setState({
      value: {
        ...this.state.value,
        to: e.target.value
      }
    });
  };
  onChange3 = e => {
    this.setState({
      value: {
        ...this.state.value,
        title: e.target.value
      }
    });
  };
  onChange4 = e => {
    this.setState({
      value: {
        ...this.state.value,
        goto: e.target.value
      }
    });
  };
  onChange5 = e => {
    this.setState({
      value: {
        ...this.state.value,
        description: e.target.value
      }
    });
  };
  onSubmit = e => {
    var ref = firebase
      .database()
      .ref()
      .child("calendarid");
    var currid = 0;

    firebase
      .database()
      .ref()
      .child("calendarid")
      .on(
        "value",
        function(snapshot) {
          currid = snapshot.val();
          // console.log(currid);
        },
        function(error) {
          console.log("Error: " + error.code);
        }
      );

    console.log("currid" + currid);
    //console.log(this.state.value);
    if (
      this.state.value.from == null ||
      this.state.value.to == null ||
      this.state.value.title == null ||
      this.state.value.description == null
    ) {
      alert("Please Enter Required fields");
    } else {
      if (this.state.value.goto == null) {
        this.state.value.goto = "";
      }
      this.setState({
        events: [
          ...this.state.events,
          {
            id: currid,
            start: this.state.value.from,
            end: this.state.value.to,
            title: this.state.value.title,
            link: this.state.value.goto,
            description: this.state.value.description
          }
        ]
      });
      //console.log(this.state.events);
      e.preventDefault();
      var newItem = {
        id: currid,
        start: this.state.value.from,
        end: this.state.value.to,
        title: this.state.value.title,
        link: this.state.value.goto,
        description: this.state.value.description
      };
      ref.transaction(function(currid) {
        return currid + 1;
      });

      this.calendarRef.child("events").push(newItem);
      this.setState({ title: "" });
      this.setState({ start: "" });

      this.setState({ end: "" });
      this.setState({ link: "" });
      this.setState({ description: "" });
      // window.location.reload();
    }
  };
  onClick = e => {
    this.setState({ nowChange: true });
    this.setState({ description: e.description, link: e.link, title: e.title });
    //alert(this.state.link);
    //return window.location.assign(e.link);
  };
  deleteEvent = async e => {
    //console.log("Check");
    console.log(e.id);

    var tempid = e.id;
    var curr_key;

    var query = firebase
      .database()
      .ref("calendar_entry")
      .child("events")
      .orderByKey();

    await query.once("value").then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var childData = childSnapshot.val();

        if (childData.id == tempid) {
          curr_key = childSnapshot.key;
          // console.log(curr_key);
          firebase
            .database()
            .ref()
            .child("calendar_entry")
            .child("events")
            .child(curr_key)
            .remove();
          window.location.reload();
          // this.props.history.push("/header/calendar");
        }
      });
    });
    // this.props.history.replace("/header/calendar");
  };
  onClick2 = e => {
    this.setState({ nowChange: true });
    this.setState({
      description: e.description,
      link: e.link,
      title: e.title,
      id: e.id
    });
    console.log(firebase.auth().currentUser.displayName, e);
    // this.setState({ nowChange: true });
    // if (window.confirm('\nIf you want to delete the event click "ok".')) {
    //   {
    //     this.deleteEvent(e);
    //   }
    //   // if (e.link == "") {
    //   //   alert("No link associated with the event");
    //   // } else {
    //   //   window.location.href = e.link;
    //   // }
    // }

    //alert(this.state.link);
    //return window.location.assign(e.link);
  };
  onArrival = () => {
    console.log(this.props.x);
    this.setState({ isModerator: this.props.x });
  };
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
        snapshot.forEach(function(child) {
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
  printEventTitle = e => {
    console.log(e.description);
    return <div>{e.target.value.description}</div>;
  };
  render() {
    var check = this.state.isModerator;
    // if (this.state.nowChange) {
    //   console.log("Hello");
    //   return <Redirect to="/header/calendaredit" />;
    // }
    // const isModerator = this.state.isModerator;
    // const form = (
    //   <form onSubmit={this.onSubmit}>
    //     <input name="from" type="date" onChange={this.onChange1} />
    //     <br />
    //     <input name="to" type="date" onChange={this.onChange2} />
    //     <br />
    //     <input
    //       name="contest"
    //       type="text"
    //       onChange={this.onChange3}
    //       placeholder="Enter Event Title..."
    //     />
    //     <br />
    //     <input
    //       name="goto"
    //       type="link"
    //       onChange={this.onChange4}
    //       placeholder="Enter Event Link..."
    //     />
    //     <br />
    //     <textarea
    //       rows="5"
    //       cols="50"
    //       name="description"
    //       onChange={this.onChange5}
    //       placeholder="Enter Event Description"
    //     />
    //     <br />
    //     <button type="submit">button</button>
    //     <br />
    //   </form>
    // );

    return (
      <div className="calendar-bg">
        {/* {this.props.x} */}
        {!check ? (
          <div>
            <div className="CalendarStyle">
              <div className="name">Events Page</div>
              <Calendar
                popup
                localizer={localizer}
                defaultDate={new Date()}
                events={this.state.events}
                style={{ height: "70vh" }}
                onSelectEvent={this.onClick}
                views={["month"]}
              />
              <br />
              <br />
              {!this.state.nowChange ? (
                <React.Fragment />
              ) : (
                <Popup
                  defaultOpen={true}
                  onClose={() => {
                    this.setState({ nowChange: false });
                  }}
                >
                  <div className="pop-up">
                    <h1>{this.state.title}</h1>
                    <h3>{this.state.description}</h3>
                    <button
                      onClick={() => {
                        this.state.link.trim() !== ""
                          ? window.open(this.state.link, "_blank")
                          : alert("No link associated with event");
                      }}
                    >
                      Go to Event
                    </button>
                  </div>
                </Popup>
              )}
              {/* <button onClick={this.redir}>Redirect</button> */}
            </div>
          </div>
        ) : (
          <div className="CalendarStyle">
            <div className="name">Events Page</div>
            <Calendar
              popup
              localizer={localizer}
              defaultDate={new Date()}
              events={this.state.events}
              style={{ height: "70vh" }}
              onSelectEvent={this.onClick2}
              views={["month"]}
            />
            {!this.state.nowChange ? (
              <React.Fragment />
            ) : (
              <Popup
                defaultOpen={true}
                onClose={() => {
                  this.setState({ nowChange: false });
                }}
              >
                <div className="pop-up">
                  <h1>{this.state.title}</h1>
                  <h3>{this.state.description}</h3>
                  <button
                    onClick={() => {
                      this.state.link.trim() !== ""
                        ? window.open(this.state.link, "_blank")
                        : alert("No link associated with event");
                    }}
                  >
                    Go to Event
                  </button>
                  <button
                    onClick={() => {
                      this.deleteEvent(this.state);
                    }}
                  >
                    Delete Event
                  </button>
                </div>
              </Popup>
            )}
            {/* <button onClick={this.redir}>Redirect</button> */}
            <div className="add-new-event">
              <div className="head-event-form">Form to Add New Event</div>
              <form onSubmit={this.onSubmit}>
                <p className="text-form">Start Date</p>
                <input name="from" type="date" onChange={this.onChange1} />
                <br />
                <p className="text-form">End Date</p>

                <input name="to" type="date" onChange={this.onChange2} />
                <br />

                <br />
                <input
                  name="contest"
                  type="text"
                  onChange={this.onChange3}
                  placeholder="Enter Event Title..."
                />
                <br />
                <br />
                <input
                  name="goto"
                  type="link"
                  onChange={this.onChange4}
                  placeholder="Enter Event Link..."
                />
                <br />
                <br />
                <textarea
                  rows="5"
                  cols="50"
                  name="description"
                  onChange={this.onChange5}
                  placeholder="Enter Event Description..."
                />
                <br />
                <br />
                <button type="submit">Add Event</button>
                <br />
                <br />
                <br />
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }
}


export default BigCalendar;

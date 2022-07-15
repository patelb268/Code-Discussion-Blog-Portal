import React, { Component } from "react";
import Calendar from "react-calendar";

class MyCalendar extends Component {
  state = {
    event: [
      {
        date: new Date(2019, 2, 22),
        title: "Event Name: Ipc 5 \\ Date:"
      },
      {
        date: new Date(2019, 2, 11),
        title: "Ipc 4"
      },
      {
        date: new Date(2019, 2, 15),
        title: "Ipc 2"
      },
      {
        date: new Date(2019, 2, 31),
        title: "Ipc 1"
      }
    ],
    newData: []
  };
  PrintEvent = () => {
    return this.state.newData.map(item => {
      if (String(item) === String(" ")) return null;
      return <div>{item}</div>;
    });
  };
  onClickDay = date => {
    this.setState({
      newData: this.state.event.map(event => {
        if (String(event.date) === String(date)) return event.title;
        return " ";
      })
    });
  };

  render() {
    return (
      <div style={CalendarStyle}>
        <Calendar
          onClickDay={this.onClickDay}
          onChange={this.onChange}
          value={this.state.date}
        />
        <div style={EventStyle}>{this.PrintEvent()}</div>
      </div>
    );
  }
}
const CalendarStyle = {
  padding: "30px",
  align: "center",
  display: "inline-block"
};
const EventStyle = {
  padding: "10px",
  align: "center",
  textColor: "white"
};
export default MyCalendar;

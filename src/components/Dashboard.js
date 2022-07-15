import React, { Component } from "react";
import firebase from "firebase";
import "./css/recommendation.css";

var c = 0;
var tags_arr = [];
var rating_per_tag = [];

var rat_arr = new Array();
var tag_dif_arr = [];
var solved = new Set();

var rating_per_tag = new Array();
var avg_rating = new Array();

var mail;
var x;
var k;
var b;
var config = {
apiKey: "AIzaSyAbKy_9ySKVg5LPBjcSl4opQWIZNkvrR8M",
authDomain: "temp-4d417.firebaseapp.com",
databaseURL: "https://temp-4d417.firebaseio.com",
projectId: "temp-4d417",
storageBucket: "temp-4d417.appspot.com",
messagingSenderId: "594613445600"
};

firebase.initializeApp(config);

class dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "easy",
      tag: "implementation",
      showMenu: false,
      gotdata: false,
      isModerator: true,
      has_handle: false,
      cf_handle: "",
      nowChange: false
    };
    this.showMenu = this.showMenu.bind(this);
    this.printValue = this.printValue.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.displayProblems = this.displayProblems.bind(this);

    this.getData();
  }
  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ isSignedIn: !!user })
      //console.log("user",user);
      if (this.state.isSignedIn) this.getUserData();
    })
  }
  getUserData = () => {
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
        snapshot.forEach(function (child) {
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

  async getData() {
    await firebase
      .database()
      .ref("/")
      .once("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          if (c == 0) {
            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();
            tags_arr = childData;
            console.log("--");
            console.log(childData);
            for (var x in childData) {
              rating_per_tag[x] = [];
            }
          }
          c = c + 1;
        });
      });
    console.log(tags_arr);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      var txt = "";
      if (this.readyState == 4 && this.status == 200) {
        var json = JSON.parse(this.responseText);
        var submission = json.result;
        for (var x in submission) {
          if (submission[x]["verdict"] == "OK") {
            var te =
              String(submission[x]["problem"]["contestId"]) +
              String(submission[x]["problem"]["index"]);
            solved.add(te);
            for (var y in submission[x]["problem"]["tags"]) {
              var z = submission[x]["problem"]["tags"][y];
              //if(z=="dp"){console.log(submission[x]['problem']);}
              //console.log(y);
              var temp = rating_per_tag[z];
              //console.log(temp);
              //console.log(submission[x]['problem']['rating']);
              if (typeof submission[x]["problem"]["rating"] !== "undefined") {
                temp.push(submission[x]["problem"]["rating"]);
              }
              rating_per_tag[z] = temp;
            }
          }
        }
        console.log(solved);
        txt = txt + "-----" + "<br>";

        for (x in rating_per_tag) {
          var easy = [],
            medium = [],
            hard = [];
          txt = txt + x + ": ";
          var sum = 0;
          for (y in rating_per_tag[x]) {
            txt = txt + rating_per_tag[x][y] + ", ";
            sum = sum + rating_per_tag[x][y];
          }
          if (rating_per_tag[x].length == 0) {
            avg_rating[x] = 1500;
          } else {
            avg_rating[x] = sum / rating_per_tag[x].length;
          }
          avg_rating[x] = Math.round(avg_rating[x] / 100);
          txt = txt + "<br>";
          txt = txt + "Average Rating" + avg_rating[x] + "<br>";

          for (var y in tags_arr[x]) {
            var ex = tags_arr[x][y]["rating"] / 100;
            var te =
              String(tags_arr[x][y]["contestId"]) +
              String(tags_arr[x][y]["index"]);
            if (ex > avg_rating[x] + 1) {
              if (solved.has(te) != true) {
                hard.push(tags_arr[x][y]);
              }
            } else if (ex < avg_rating[x] - 1) {
              if (solved.has(te) != true) {
                easy.push(tags_arr[x][y]);
              }
            } else if (ex <= avg_rating[x] + 1 && ex >= avg_rating[x] - 1) {
              if (solved.has(te) != true) {
                medium.push(tags_arr[x][y]);
              }
            }
          }
          tags_arr["easy"] = easy;
          tags_arr["medium"] = medium;
          tags_arr["hard"] = hard;
          txt = txt + "Easy<br>";
          for (var y in rating_per_tag["easy"]) {
            txt =
              txt +
              tags_arr["easy"][y]["name"] +
              tags_arr["easy"][y]["rating"] +
              tags_arr["easy"][y]["link"] +
              "<br>";
          }
          txt = txt + "Medium<br>";
          for (var y in tags_arr["medium"]) {
            txt =
              txt +
              tags_arr["medium"][y]["name"] +
              tags_arr["medium"][y]["rating"] +
              tags_arr["medium"][y]["link"] +
              "<br>";
          }
          txt = txt + "Hard<br>";
          for (var y in tags_arr["hard"]) {
            txt =
              txt +
              tags_arr["hard"][y]["name"] +
              tags_arr["hard"][y]["rating"] +
              tags_arr["hard"][y]["link"] +
              "<br>";
          }
          tag_dif_arr[x] = {
            easy: easy,
            medium: medium,
            hard: hard
          };
        }
        console.log(tag_dif_arr);

        console.log("done");
        if (document.getElementById("demo")) {
          document.getElementById("demo").innerHTML = txt;
        }
        var data = "";
        for (var x in tag_dif_arr["implementation"]["easy"]) {
          data = data + "<div id='problem'>";
          data =
            data +
            "<div id='pb-name'>Problem Name: " +
            tag_dif_arr["implementation"]["easy"][x]["name"] +
            "</div>";

          data =
            data +
            "<div id='pb-rat'>Rating: " +
            tag_dif_arr["implementation"]["easy"][x]["rating"] +
            "</div>";

          data = data + "<div id='pb-tags'>Tags: ";
          for (var y in tag_dif_arr["implementation"]["easy"][x]["tags"]) {
            var ny = parseInt(y);
            if (
              ny <
              tag_dif_arr["implementation"]["easy"][x]["tags"].length - 1
            ) {
              data =
                data +
                tag_dif_arr["implementation"]["easy"][x]["tags"][y] +
                ", ";
            } else {
              data =
                data +
                tag_dif_arr["implementation"]["easy"][x]["tags"][y] +
                "</div>";
            }
          }
          data =
            data +
            '<a target="_blank" href="' +
            tag_dif_arr["implementation"]["easy"][x]["link"] +
            '" id="pb-solve"> Solve </a>';
          data = data + "<br>";
          data = data + "</div>";
        }
        if (document.getElementById("demo")) {
          document.getElementById("demo").innerHTML = data;
        }
      }
    };
    console.log("func start");
    //var v_handle = document.getElementById('handle').value;
    var url =
      "https://codeforces.com/api/user.status?handle=" + this.state.cf_handle + "&from=1&count=1000";
    await xhttp.open("GET", url, true);
    xhttp.send();
    this.state.gotdata = true;
    // this.setState({got_data:true});
  }

  showMenu(event) {
    event.preventDefault();
    this.setState({ showMenu: true }, () => {
      document.addEventListener("click", this.closeMenu);
    });
  }

  displayProblems() {
    var data = "";
    for (var x in tag_dif_arr[this.state.tag][this.state.type]) {
      data = data + "<div id='problem'>";
      data = data + "<div id='pb-name'>Problem Name: " +
        tag_dif_arr[this.state.tag][this.state.type][x]["name"] + "</div>";
      data = data + "<div id='pb-rat'>Rating: " +
        tag_dif_arr[this.state.tag][this.state.type][x]["rating"] + "</div>";
      data = data + "<div id='pb-tags'>Tags: ";
      for (var y in tag_dif_arr[this.state.tag][this.state.type][x]["tags"]) {
        var ny = parseInt(y);
        if (
          ny <
          tag_dif_arr[this.state.tag][this.state.type][x]["tags"].length - 1
        ) {
          data =
            data +
            tag_dif_arr[this.state.tag][this.state.type][x]["tags"][y] +
            ", ";
        } else {
          data =
            data +
            tag_dif_arr[this.state.tag][this.state.type][x]["tags"][y] +
            "</div>";
        }
      }
      //data=data+tag_dif_arr[this.state.tag][this.state.type][x]["tag"]+"<br>";
      data =
        data +
        '<a target="_blank" href="' +
        tag_dif_arr[this.state.tag][this.state.type][x]["link"] +
        '" id="pb-solve"> Solve </a>';
      data = data + "<br>";
      data = data + "</div>";
    }
    document.getElementById("demo").innerHTML = data;
  }

  selectTag = event => {
    this.setState({ tag: event.target.value });
    //console.log(this.state);
  };

  handleOptionChange = event => {
    this.setState({ type: event.target.value });
    //console.log(this.state);
  };

  handleFormSubmit = formSubmitEvent => {
    formSubmitEvent.preventDefault();
    console.log("You have submitted:", this.state.type);
  };

  closeMenu() {
    this.setState({ showMenu: false }, () => {
      document.removeEventListener("click", this.closeMenu);
    });
  }

  printValue() {
    console.log(this.state);
    console.log(tag_dif_arr[this.state.tag][this.state.type]);
  }

  render() {
    if (this.state.gotdata) {
      this.displayProblems();
    }
    return (
      <div className="reco-main-page">

        <div className="name">Recommendations</div>
        <div className="selection">Please select the difficulty of the problems you want to solve.</div>
        <div className="row mt-5">
          <div className="col-sm-12">
            <form onSubmit={this.handleFormSubmit}>

              <div className="form-check">
                <label className="labels">
                  <input
                    type="radio"
                    name="react-tips"
                    value="easy"
                    checked={this.state.type == "easy"}
                    onChange={this.handleOptionChange}
                    className="radio"
                  />

                </label>
              </div>

              <div className="form-check">
                <label className="labels">
                  <input
                    type="radio"
                    name="react-tips"
                    value="medium"
                    checked={this.state.type == "medium"}
                    onChange={this.handleOptionChange}
                    className="radio"
                  />

                </label>
              </div>

              <div className="form-check">
                <label className="labels">
                  <input
                    type="radio"
                    name="react-tips"
                    value="hard"
                    checked={this.state.type == "hard"}
                    onChange={this.handleOptionChange}
                    className="radio"
                  />

                </label>
              </div>
            </form>
          </div>
          <div className="e-m-t">
            <div className="easy">Easy</div>
            <div className="medium">Medium</div>
            <div className="tough">Tough</div>
          </div>
        </div>

        <div className="tags-for-questions" onClick={this.showMenu}>
          If you want specific tags, please select one:
 <div className="tags-open">Tags</div>
        </div>

        {this.state.showMenu ? (
          <div className="tags-menu">
            <button className="tag-option" onClick={this.selectTag} value="implementation">
              {" "}
              Implementation{" "}
            </button>
            <button className="tag-option" onClick={this.selectTag} value="brute force">
              {" "}
              Brute Force{" "}
            </button>
            <button className="tag-option" onClick={this.selectTag} value="data structures">
              {" "}
              Data Structures{" "}
            </button>
            <button className="tag-option" onClick={this.selectTag} value="dp">
              {" "}
              Dynamic Programming{" "}
            </button>
            <button className="tag-option" onClick={this.selectTag} value="binary search">
              {" "}
              Binary Search{" "}
            </button>
            <button className="tag-option" onClick={this.selectTag} value="greedy">
              {" "}
              Greedy{" "}
            </button>
            <button className="tag-option" onClick={this.selectTag} value="graphs">
              {" "}
              Graphs{" "}
            </button>
            <button className="tag-option" onClick={this.selectTag} value="math">
              {" "}
              Math{" "}
            </button>
            <button className="tag-option" onClick={this.selectTag} value="number theory">
              {" "}
              Number Theory{" "}
            </button>
            <button className="tag-option" onClick={this.selectTag} value="strings">
              {" "}
              Strings{" "}
            </button>
            <button className="tag-option" onClick={this.selectTag} value="sortings">
              {" "}
              Sortings{" "}
            </button>
            <button className="tag-option" onClick={this.selectTag} value="trees">
              {" "}
              Trees{" "}
            </button>
            <button className="tag-option" onClick={this.selectTag} value="dfs and similar">
              {" "}
              DFS and Similar{" "}
            </button>
            <button className="tag-option" onClick={this.selectTag} value="geometry">
              {" "}
              Geometry{" "}
            </button>
            <button className="tag-option" onClick={this.selectTag} value="two pointers">
              {" "}
              Two Pointers{" "}
            </button>
            <button className="tag-option" onClick={this.selectTag} value="ternary search">
              {" "}
              Ternary Search{" "}
            </button>
            <button className="tag-option" onClick={this.selectTag} value="probabilities">
              {" "}
              Probabilities{" "}
            </button>
            <button className="tag-option" onClick={this.selectTag} value="matrices">
              {" "}
              Matrices{" "}
            </button>
            <button className="tag-option" onClick={this.selectTag} value="dsu">
              {" "}
              DSU{" "}
            </button>
            <button className="tag-option" onClick={this.selectTag} value="games">
              {" "}
              Games{" "}
            </button>
            <button className="tag-option" onClick={this.selectTag} value="flows">
              {" "}
              Flows{" "}
            </button>
            <button className="tag-option" onClick={this.selectTag} value="fft">
              {" "}
              Fast Fourier Transform{" "}
            </button>
            <button className="tag-option" onClick={this.selectTag} value="divide and conquer">
              {" "}
              Divide and Conquer{" "}
            </button>
            <button className="tag-option" onClick={this.selectTag} value="bitmasks">
              {" "}
              Bit Masking{" "}
            </button>
            <button className="tag-option" onClick={this.selectTag} value="2-sat">
              {" "}
              2-Satisfiability{" "}
            </button>
            <button className="tag-option" onClick={this.selectTag} value="combinatorics">
              {" "}
              Combinatorics{" "}
            </button>
            <button className="tag-option" onClick={this.selectTag} value="constructive algorithm">
              {" "}
              Constructive Algorithm{" "}
            </button>
            <button className="tag-option" onClick={this.selectTag} value="hashing">
              {" "}
              Hashing{" "}
            </button>
            <button className="tag-option" onClick={this.selectTag} value="graph matchings">
              {" "}
              Graph Matchings{" "}
            </button>
            <button className="tag-option" onClick={this.selectTag} value="meet-in-the-middle">
              {" "}
              Meet in the Middle{" "}
            </button>
            <button className="tag-option" onClick={this.selectTag} value="string suffix stuctures">
              {" "}
              String suffix structures{" "}
            </button>
            <button className="tag-option" onClick={this.selectTag} value="shortest paths">
              {" "}
              Shortest Paths{" "}
            </button>
            <button className="tag-option" onClick={this.selectTag} value="schedules">
              {" "}
              Schedules{" "}
            </button>
            <button className="tag-option" onClick={this.selectTag} value="expression parsing">
              {" "}
              Expression Parsing{" "}
            </button>
            <button className="tag-option" onClick={this.selectTag} value="chinese remainder theorem">
              {" "}
              Chinese Remainder Theorem{" "}
            </button>
            <button className="tag-option" onClick={this.selectTag} value="*special">
              {" "}
              Special{" "}
            </button>
          </div>
        ) : null}
        <div id="demo" />
        <div className="wait">Problems are loading or no more problems..</div>


      </div>
    );
  }
}

export default dashboard;
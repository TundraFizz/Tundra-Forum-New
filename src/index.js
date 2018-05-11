import React       from "react";
import ReactDOM    from "react-dom";
import {BrowserRouter, Route} from "react-router-dom";
import {post} from "./post.js"; // import {post, get} from "./post.js";
import "./themes/zelda/theme.css";
const Cookie = require("js-cookie");

/***** Helper Functions *****/
function GetCookie(){
  // Returns null if the "token" cookie doesn't exist, otherwise it returns that actual "token"
  return (Cookie.get("token") !== undefined) ? Cookie.get("token") : null;
}
/***** Helper Functions *****/

class Application extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      "token": "",
      "name" : null,
      "ready": false
    };
  }

  SetName = (name) => {
    this.setState({
      "name": name
    });
  }

  QueryIndex = () => {
    var self = this;

    var postData = {
      "token": GetCookie()
    };

    post("/api/get-boards", postData)
    .then(res => {
      self.setState({
        "boards": res.boards,
        "name"  : res.name,
        "ready" : true
      });
    });
  }

  QueryBoard = () => {
    // TODO
    //
  }

  QueryThread = () => {
    // TODO
    //
  }

  componentWillMount(){
    this.QueryIndex();
  }

  render(){
    var HeaderBarProps = {
      "state"     : this.state,
      "QueryIndex": this.QueryIndex,
      "SetName"   : this.SetName,
      "Logout"    : this.Logout
    };

    if(!this.state.ready){
      return(<div></div>);
    }else if(true){
    return(
      <div id="root2">
        <div className="header">
          <HeaderBar {...HeaderBarProps}/>
            <CenterContent>
              <Logo/>
            </CenterContent>
        </div>

        <NavBarMenu/>
        <div className="nav-bar-trim"/>
        <div className="triangles"/>


        <BrowserRouter>
          <div>
            <Route exact path="/" render={() => <MainForum boards={this.state.boards}/>} />
          </div>
        </BrowserRouter>

        {/* <MainForum boards={this.state.boards}/> */}

      </div>
    );
    }
  }
}

class HeaderBar extends React.Component {
  /* ---------- Props ----------
     state      = Application.state
     QueryIndex = Application.QueryIndex
     SetName    = Application.SetName
     Logout     = Application.Logout     */

  constructor(props){
    super(props);
    this.state = {
      "displayLogin"        : "none",
      "displayCreateAccount": "none"
    };
  }

  GetMail = () => {
    alert("TODO: GetMail()");
    //
  }

  GetNotifications = () => {
    alert("TODO: GetNotifications()");
    //
  }

  GetUserControlPanel = () => {
    alert("TODO: GetUserControlPanel()");
    //
  }

  Logout = () => {
    var postData = {
      "token": GetCookie()
    };

    post("/api/logout", postData)
    .then(res => {
      Cookie.remove("token");
      this.props.QueryIndex();
    });
  }

  ShowLoginWindow = () => {
    // Hide "signup window" and toggle "login window"

    this.setState({"displayCreateAccount": "none"});

    if(this.state.displayLogin === "none") this.setState({"displayLogin": "block"});
    else                                   this.setState({"displayLogin": "none"});
  }

  ShowCreateAccountWindow = () => {
    // Hide "login window" and toggle "signup window"

    this.setState({"displayLogin": "none"});

    if(this.state.displayCreateAccount === "none") this.setState({"displayCreateAccount": "block"});
    else                                           this.setState({"displayCreateAccount": "none"});
  }

  HideLoginAndCreateAccountWindows = () => {
    this.setState({"displayLogin"        : "none"});
    this.setState({"displayCreateAccount": "none"});
  }


  render(){
    var WindowProps = {
      "HideLoginAndCreateAccountWindows": this.HideLoginAndCreateAccountWindows
    };

    var bar;

    if(this.props.state.name){
      // Render this HTML if the user is logged in
      bar = (
      <div className="bar">
        <div className="mail"          onClick={this.GetMail            }></div>
        <div className="notifications" onClick={this.GetNotifications   }></div>
        <div className="text"          onClick={this.GetUserControlPanel}>{this.props.state.name}</div>
        <div className="seperator"></div>
        <div                           onClick={this.Logout             }>Sign Out</div>
      </div>
      );
    }else{
      // Render this HTML if the user is NOT logged in
      bar = (
      <div className="bar">
        <div className="text" onClick={this.ShowLoginWindow}>Login</div>
        <div className="seperator"></div>
        <div onClick={this.ShowCreateAccountWindow}>Create Account</div>
      </div>
      );
    }

    return(
      <div>
        {bar}
        <LoginWindow  {...this.props} {...WindowProps} display={this.state.displayLogin}/>
        <SignupWindow {...this.props} {...WindowProps} display={this.state.displayCreateAccount}/>
      </div>
    );
  }
}

class LoginWindow extends React.Component {
  /* ---------- Props ----------
     state      = Application.state
     QueryIndex = Application.QueryIndex
     SetName    = Application.SetName
     Logout     = Application.Logout
     display    = HeaderBar.state.displayLogin
     HideLoginAndCreateAccountWindows = HeaderBar.HideLoginAndCreateAccountWindows */

  constructor(props){
    super(props);
    this.state = {
      "email"   : "",
      "password": ""
    };
  }

  HandleChange = (e) => {
    this.setState({[e.target.name]: e.target.value});
  }

  Login = () => {
    var postData = {
      "email"   : this.state.email,
      "password": this.state.password
    };

    post("/api/login", postData)
    .then(res => {
      if(res.err === 0){
        Cookie.set("token", res.token);
        this.props.HideLoginAndCreateAccountWindows();
        this.props.QueryIndex();
      }else
        alert(res.msg);
    });
  }

  render(){
    return(
      <div className="login-window" style={{"display":this.props.display}}>
        <table>
          <tbody>
            <tr>
              <td>Email</td>
              <td><input name="email" value={this.state.email} onChange={this.HandleChange} type="text"/></td>
            </tr>
            <tr>
              <td>Password</td>
              <td><input name="password" value={this.state.password} onChange={this.HandleChange} type="password"/></td>
            </tr>
            <tr>
              <td><input type="button" value="Login" onClick={this.Login}/></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

class SignupWindow extends React.Component {
  /* ---------- Props ----------
     state      = Application.state
     QueryIndex = Application.QueryIndex
     SetName    = Application.SetName
     Logout     = Application.Logout
     display    = HeaderBar.state.displayCreateAccount
     HideLoginAndCreateAccountWindows = HeaderBar.HideLoginAndCreateAccountWindows */

  constructor(props){
    super(props);
    this.state = {
      "email"   : "1",
      "password": "1",
      "confirm" : "1",
      "name"    : "1",
      "tou"     : false,
      "captcha" : "true"
    };
  }

  HandleChange = (e) => {
    var name = e.target.name;

    if(name === "tou") this.setState({[name]: e.target.checked});
    else               this.setState({[name]: e.target.value});
  }

  CreateAccount = () => {
    var postData = {
      "email"   : this.state.email,
      "password": this.state.password,
      "confirm" : this.state.confirm,
      "name"    : this.state.name,
      "tou"     : this.state.tou,
      "captcha" : this.state.captcha
    };

    post("/api/create-account", postData)
    .then(res => {
      if(res.err === 0){
        this.props.HideLoginAndCreateAccountWindows();
        alert(res.msg);
      }else
        alert(res.msg);
    });
  }

  render(){
    return(
      <div className="signup-window" style={{"display":this.props.display}}>
        <table>
          <tbody>
            <tr>
              <td>Email</td>
              <td><input name="email" value={this.state.email} onChange={this.HandleChange} type="text"/></td>
            </tr>
            <tr>
              <td>Password</td>
              <td><input name="password" value={this.state.password} onChange={this.HandleChange} type="password"/></td>
            </tr>
            <tr>
              <td>Confirm Password</td>
              <td><input name="confirm" value={this.state.confirm} onChange={this.HandleChange} type="password"/></td>
            </tr>
            <tr>
              <td>Display Name</td>
              <td><input name="name" value={this.state.name} onChange={this.HandleChange} type="text"/></td>
            </tr>
            <tr>
              <td>Terms of Use</td>
              <td><input name="tou" checked={this.state.tou} onChange={this.HandleChange} type="checkbox"/></td>
            </tr>
            <tr>
              <td>TODO: Captcha</td>
            </tr>
            <tr>
              <td><input type="button" value="Create Account" onClick={this.CreateAccount}/></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

class Logo extends React.Component {
  render(){
    return(
      <div className="logo"/>
    );
  }
}

class NavBarMenu extends React.Component {
  render(){
    return(
      <div className="nav-bar">
        <CenterContent>
          <div className="nav-link active">Forum</div>
          <div className="nav-link       ">Members</div>
          <div className="nav-link       ">TBD</div>
          <div className="nav-link view-new-content">View New Content</div>
        </CenterContent>
      </div>
    );
  }
}

class MainForum extends React.Component {
  RenderBoards = () => {
    return this.props.boards.map((obj, i) =>
      <div className="board" key={i}>
        <div className="icon">
          <div className="icon-bg"></div>
        </div>
        <div className="info">
          <div className="inner">
            <a className="board-title" board-id={obj.board_id}>{obj.name}</a>
            <div className="description">{obj.description}</div>
          </div>
        </div>
        <div className="last-poster">
          <div className="inner">
            <div className="TBD">Last Poster: TBD</div>
          </div>
        </div>
        <div className="stats">
          <div className="inner">
            <div className="thread-count">{obj.thread_count} topics</div>
            <div className="post-count">{obj.post_count} replies</div>
          </div>
        </div>
      </div>
    )
  }

  render(){
    return(
      <div id="forum-window">
        <div id="content" type="board-index">
          <div className="category">
            <div className="title">❧ The New Pipeline</div>
            <div className="thingy">
              <div className="thingy-2">
                {this.RenderBoards()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class CenterContent extends React.Component {
  render(){
    return(
      <div className="center-content">
        {this.props.children}
      </div>
    );
  }
}

class Kjkshfksd extends React.Component {
  render(){
    return(
      <div id="root2">
        Kjkshfksd sdlfsdlfj sdfhsdjf skdjfjskldf lksdfjklsd
      </div>
    );
  }
}

ReactDOM.render((
  <BrowserRouter>
    <div>
      <Route exact path="/" component={Application}/>
      <Route path="/news" component={Kjkshfksd}/>
    </div>
  </BrowserRouter>
), document.getElementById("root"));

import React       from "react";
import ReactDOM    from "react-dom";
import {BrowserRouter, Route} from "react-router-dom";
import {post, get} from "./post.js";
import "./themes/zelda/theme.css";
const Cookie = require("js-cookie");

// render={() => <div>Home</div>}/>

// <Route path="/hi" component={Application}/>

// ReactDOM.render(
//   <Application/>, document.getElementById("root")
// );


class Application extends React.Component {
  constructor(props){
    super(props);
    // this.Delta = this.Delta.bind(this);

    this.state = {
      "ready": false,
      "token": ""
    };
  }

  componentWillMount(){
    var self = this;
    get("/api/get-boards", "")
    .then(res => {
      self.setState({
        "boards": res,
        "ready": true
      });
    });
  }

  render(){
    if(!this.state.ready){
      return(<div></div>);
    }else if(true){
    return(
      <div id="root2">
        <Header/>
        <NavBar/>
        <MainForum qwe={this.state.boards}/>
      </div>
    );
    }
  }
}

class Header extends React.Component {
  render(){
    return(
      <div className="header">
      <HeaderBar/>
        <CenterContent>
          <Logo/>
        </CenterContent>
      </div>
    );
  }
}

class LoginWindow extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      "email"   : "y",
      "password": "z"
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
      console.log(res);
      Cookie.set("token", res.token);
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

    post("/api/sign-up", postData)
    .then(res => {
      console.log(res);
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

class HeaderBar extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      "displayLogin"        : "none",
      "displayCreateAccount": "none"
    };
  }

  GetMail = () => {
    alert("TODO: GetMail()");
  }

  GetNotifications = () => {
    alert("TODO: GetNotifications()");
  }

  GetUserControlPanel = () => {
    alert("TODO: GetUserControlPanel()");
  }

  CreateAccount = () => {
    // Hide "login window" and toggle "signup window"

    this.setState({"displayLogin": "none"});

    if(this.state.displayCreateAccount === "none") this.setState({"displayCreateAccount": "block"});
    else                                           this.setState({"displayCreateAccount": "none"});
  }

  Login = () => {
    // Hide "signup window" and toggle "login window"

    this.setState({"displayCreateAccount": "none"});

    if(this.state.displayLogin === "none") this.setState({"displayLogin": "block"});
    else                                   this.setState({"displayLogin": "none"});
  }

  Logout = () => {
    alert("TODO: Logout()");
  }

  render(){
    return(
      <div>
      <div className="bar">
        <ul>
          <li onClick={this.Login}>Login</li>
          <li className="seperator"></li>
          <li onClick={this.CreateAccount}>Create Account</li>
        </ul>
      </div>

      <div className="bar">
        <ul>
          <li className="mail"          onClick={this.GetMail            }>Mail</li>
          <li className="notifications" onClick={this.GetNotifications   }>Notifications</li>
          <li                           onClick={this.GetUserControlPanel}>MageLeif</li>
          <li className="seperator"></li>
          <li                           onClick={this.Logout             }>Sign Out</li>
        </ul>
      </div>

      <LoginWindow  display={this.state.displayLogin}/>
      <SignupWindow display={this.state.displayCreateAccount}/>
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

class NavBar extends React.Component {
  render(){
    return(
      <div>
        <NavBarMenu/>
        <NavBarTrim/>
        <NavBarTriangles/>
      </div>
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

class NavBarTrim extends React.Component {
  render(){
    return <div className="nav-bar-trim"/>
  }
}

class NavBarTriangles extends React.Component {
  render(){
    return <div className="triangles"/>
  }
}

class MainForum extends React.Component {
  RenderBoards(){
    return this.props.qwe.map((obj, i) =>
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

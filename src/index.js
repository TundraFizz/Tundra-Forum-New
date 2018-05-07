import React    from "react";
import ReactDOM from "react-dom";
import {post}   from "./post.js";
import "./themes/zelda/theme.css";

class Application extends React.Component {
  constructor(props){
    super(props);
    // this.Delta = this.Delta.bind(this);

    this.state = {
      "ready": false
    };
  }

  componentWillMount(){
    var self = this;
    fetch("/api/get-boards").then(function(res){return res.json()})
    .then(function(boards){
      self.setState({
        "boards": boards,
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

class HeaderBar extends React.Component {
  GetMail(){
    alert("TODO: GetMail()");
  }

  GetNotifications(){
    alert("TODO: GetNotifications()");
  }

  GetUserControlPanel(){
    alert("TODO: GetUserControlPanel()");
  }

  SignOut(){
    alert("TODO: SignOut()");
  }

  SignUp(){
    var postData = {
      "name" : "Ben",
      "email": "fddkfjkdsf@gmail.com",
      "pass" : "muhpassword"
    };

    post("/api/sign-up", postData)
    .then(res => {
      console.log(res);
    });
  }

  render(){
    return(
      <div>
      <div className="bar">
        <ul>
          <li>Login</li>
          <li className="seperator"></li>
          <li>Create Account</li>
        </ul>
      </div>

      <div className="bar">
        <ul>
          <li onClick={this.SignUp             }>TEST: Sign Up</li>
          <li className="seperator"></li>
          <li className="mail"          onClick={this.GetMail            }></li>
          <li className="notifications" onClick={this.GetNotifications   }>Notifications</li>
          <li                           onClick={this.GetUserControlPanel}>MageLeif</li>
          <li className="seperator"></li>
          <li                           onClick={this.SignOut            }>Sign Out</li>
        </ul>
      </div>
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
    console.log(this.props.qwe);
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

ReactDOM.render(
  <Application/>, document.getElementById("root")
);

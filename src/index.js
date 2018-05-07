import React    from "react";
import ReactDOM from "react-dom";
import "./themes/zelda/theme.css";

class Application extends React.Component {
  constructor(props){
    super(props);

    // this.Delta = this.Delta.bind(this);

    this.state = {
      "test": 456,
      "count": 1
    };
  }

  // Delta(){
  //   var temp = this.state.count + 1
  //   this.setState({
  //     "count": temp
  //   });
  // }

  render(){
    return(
      <div>
        <Header/>
        <NavBar/>
        <MainForum/>
      </div>
    )
  }
}

class Header extends React.Component {
  render(){
    return(
      <div className="header">
        <CenterContent>
          <Logo/>
        </CenterContent>
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
  render(){
    return(
      <span>Temp</span>
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

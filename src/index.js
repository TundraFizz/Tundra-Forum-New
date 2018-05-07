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
        <CenterContent test={Logo}/>
      </div>
    );
  }
}

class Logo extends React.Component {
  render(){
    return(
      <div className="logo"></div>
    );
  }
}

class NavBar extends React.Component {
  render(){
    return(
      <span>Temp</span>
    );
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
    let Qwe = this.props.test;
    console.log(Qwe);

    return(
      <div className="center-content">
        {Qwe}
      </div>
    );
  }
}

ReactDOM.render(
  <Application />, document.getElementById("root")
);

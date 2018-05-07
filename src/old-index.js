import React    from "react";
import ReactDOM from "react-dom";
import "./index.css";

class Application extends React.Component {
  constructor(props){
    super(props);

    this.SomeHandler = this.SomeHandler.bind(this);
    this.Delta       = this.Delta.bind(this);
    this.Reeee       = this.Reeee.bind(this);

    this.state = {
      "test": 456,
      "count": 1
    };
  }

  SomeHandler(){
    this.setState({
      "test": 789
    });
  }

  Delta(){
    var temp = this.state.count + 1
    this.setState({
      "count": temp
    });
  }

  Reeee(){
    var self = this;
    setInterval(function(){
      console.log(self.state);
    }, 100)
  }

  render(){
    return(
      <div>
        <Yolo data={this.state["test"]}/>
        <Swag data={this.SomeHandler}/>
        <div>-</div><div>-</div><div>-</div>
        <div onClick={this.Reeee}>REEEEEEEEEEEEEEE</div>
        <div>-</div><div>-</div><div>-</div>
        <div onClick={this.Delta}>||||||||||||||||||| {this.state.count}</div>
      </div>
    )
  }
}

class Yolo extends React.Component {
  render(){
    return (
      <span>Yolo: {this.props.data} </span>
    )
  }
}

class Swag extends React.Component {
  render(){
    return (
      <span onClick={this.props.data}>sdflkjsdjfkl</span>
    )
  }
}

ReactDOM.render(
  <Application />, document.getElementsByTagName("body")[0]
);

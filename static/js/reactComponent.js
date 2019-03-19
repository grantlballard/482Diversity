"use strict";

let x = 5;

ReactDOM.render(
  <h1>Hello, world! This is a React Component WOW {x}</h1>,
  document.getElementById("root")
);

/*
class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      return "You liked this.";
    }

    return <button onClick={() => this.setState({ liked: true })}>Like</button>;
  }
}

let domContainer = document.querySelector("#like_button_container");
ReactDOM.render(<LikeButton />, domContainer);
*/

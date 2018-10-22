import React, { Component } from "react";

class GameControls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scoreLimit: "",
      velocity: "",
      paddle1Color: "",
      paddle2Color: "",
      ballColor: ""
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.props.setStartGame(
      this.state.scoreLimit,
      this.state.velocity,
      this.state.ballColor,
      this.state.paddle1Color,
      this.state.paddle2Color
    );
  };

  render() {
    return (
      <div className="controls">
        <form onSubmit={this.handleSubmit}>
          <ul>
            <li>
              <label style={{ fontSize: "16px", color: "white" }}>
                Choose your winning Score:
                <input
                  type="text"
                  name="scoreLimit"
                  value={this.state.scoreLimit}
                  onChange={this.handleInputChange}
                  placeholder="Set winning score"
                />
              </label>
              <label style={{ fontSize: "16px", color: "white" }}>
                Initial Velocity:
                <select
                  value={this.state.velocity}
                  name="velocity"
                  onChange={this.handleInputChange}
                >
                  <option value="0">Select</option>
                  <option value="1">1 (slow)</option>
                  <option value="2">2 (medium)</option>
                  <option value="3">3 (fast)</option>
                </select>
              </label>
            </li>
            <li>
              <label style={{ fontSize: "16px", color: "white" }}>
                Choose your ball color:
                <select
                  value={this.state.ballColor}
                  name="ballColor"
                  onChange={this.handleInputChange}
                >
                  <option value="0">Select</option>
                  <option value="#FF0000">RED</option>
                  <option value="#0000FF">BLUE</option>
                  <option value="#FFFF00">YELLOW</option>
                </select>
              </label>
              <label style={{ fontSize: "16px", color: "white" }}>
                Choose your paddle 1 color:
                <select
                  value={this.state.paddle1Color}
                  name="paddle1Color"
                  onChange={this.handleInputChange}
                >
                  <option value="0">Select</option>
                  <option value="#000000">BLACK</option>
                  <option value="#00FFFF">AQUA</option>
                  <option value="#FF00FF">PINK</option>
                </select>
              </label>
            </li>
            <li>
              <label style={{ fontSize: "16px", color: "white" }}>
                Choose your paddle 2 color:
                <select
                  value={this.state.paddle2Color}
                  name="paddle2Color"
                  onChange={this.handleInputChange}
                >
                  <option value="0">Select</option>
                  <option value="#FFF">WHITE</option>
                  <option value="#FF8C00">ORANGE</option>
                  <option value="#800080">PURPLE</option>
                </select>
              </label>
              <label style={{ fontSize: "16px", color: "white" }}>
                For default settings just press start
                <input type="submit" value="Start Game" />
              </label>
            </li>
          </ul>
        </form>
      </div>
    );
  }
}

export default GameControls;

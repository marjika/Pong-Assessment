import React, { Component } from "react";

import GameCanvas from "./components/GameCanvas";
import GameControls from "./components/GameControls";

class GameInterface extends Component {
  state = {
    play: false,
    winningScore: 10,
    speedX: 1,
    ballColor: "#FF0000",
    paddle1Color: "#808080",
    paddle2Color: "#808080"
  };

  startGame = () => {
    this.setState({ play: !this.state.play }, () => {
      console.log(this.state.play);
    });
  };

  setStartGame = (maxScore, speed, ballColor, paddle1Color, paddle2Color) => {
    if ((maxScore, speed, ballColor, paddle1Color, paddle2Color)) {
      this.setState(
        {
          winningScore: maxScore,
          speedX: speed,
          ballColor: ballColor,
          paddle1Color: paddle1Color,
          paddle2Color: paddle2Color
        },
        () => {
          this.startGame();
        }
      );
    } else {
      this.startGame();
    }
  };

  render() {
    return (
      <main
        style={{
          width: "100vw",
          height: "100vh",
          background: "#000",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <section
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          {this.state.play && (
            <div className="canvas-compnent">
              <GameCanvas
                winningScore={this.state.winningScore}
                speedX={this.state.speedX}
                ballColor={this.state.ballColor}
                paddle1Color={this.state.paddle1Color}
                paddle2Color={this.state.paddle2Color}
              />
            </div>
          )}
          <GameControls setStartGame={this.setStartGame} />
        </section>
      </main>
    );
  }
}

export default GameInterface;

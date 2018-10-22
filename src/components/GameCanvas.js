import React, { Component } from "react";

class GameCanvas extends Component {
  state = {
    speedX: 1,
    speedY: 1,
    ballColor: "#FF0000",
    ballHeight: 15,
    ballWidth: 15,
    twoPlayer: false,
    interval: 2000,
    timer: null,
    error: null,
    isLoaded: false,
    items: []
  };
  constructor() {
    super();
    this.deadBalls = [];
  }

  componentDidMount = () => {
    this.setState(
      { speedX: Number(this.props.speedX), ballColor: this.props.ballColor, twoPlayer: this.props.twoPlayer },
      () => {
        this._initializeGameCanvas();
        console.log("canvas speed " + this.state.speedX);
      }
    );
    const timer = setInterval(() => this.getItems(), this.state.interval);
    this.setState({ timer: timer });
  };

  componentWillUnmount() {
    clearInterval(this.state.timer);
  }

  getItems() {
    fetch("https://wwwforms.suralink.com/pong.php?accessToken=pingPONG")
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            isLoaded: true,
            items: result.items
          });
          if (result.success) {
            if (result.gameData.newDelay) {
              clearInterval(this.state.timer);
              this.setState({ interval: Number(result.gameData.newDelay) });
              const timer = setInterval(
                () => this.getItems(),
                this.state.interval
              );
              this.setState({ timer: timer });
              console.log("delay: " + this.state.interval);
            }
            if (result.gameData.ball.velocityX) {
              this.setState({ speedX: Number(result.gameData.ball.velocityX) });
              console.log(
                "BspeedX " + this.state.speedX,
                result.gameData.ball.velocityX
              );
            }
            if (result.gameData.ball.velocityY) {
              this.setState({ speedY: Number(result.gameData.ball.velocityY) });
              console.log(
                "BspeedY " + this.state.speedY,
                result.gameData.ball.velocityY
              );
            }
            if (result.gameData.ball.color) {
              const ballColor = (
                "#" + result.gameData.ball.color.hex
              ).toString();
              this.setState({ ballColor: ballColor });
              console.log("Ballcolor" + this.state.ballColor);
            }
            if (result.gameData.ball.height) {
              console.log("BallH " + result.gameData.ball.height);
              const ballH = Number(result.gameData.ball.height);
              this.setState({ ballHeight: ballH });
            }
            if (result.gameData.ball.width) {
              console.log("BallW " + result.gameData.ball.width);
              const ballW = Number(result.gameData.ball.width);
              this.setState({ ballWidth: ballW });
            }
            if (result.gameData.paddle1.width) {
              console.log("p1W" + result.gameData.paddle1.width);
              this.player1.width = Number(result.gameData.paddle1.width);
            }
            if (result.gameData.paddle1.height) {
              console.log("p1h " + result.gameData.paddle1.height);
              this.player1.height = Number(result.gameData.paddle1.height);
            }
            if (result.gameData.paddle1.color) {
              this.player1.color = "#" + result.gameData.paddle1.color.hex;
              console.log("paddle1 color " + result.gameData.paddle1.color.hex);
            }
            if (result.gameData.paddle1.velocityY) {
              console.log("p1speed " + result.gameData.paddle1.velocityY);
              this.player1.velocityY = Number(
                result.gameData.paddle1.velocityY
              );
            }
            if (result.gameData.paddle2.width) {
              console.log("p2W" + result.gameData.paddle2.width);
              this.player2.width = Number(result.gameData.paddle2.width);
            }
            if (result.gameData.paddle2.height) {
              console.log("p2h " + result.gameData.paddle2.height);
              this.player2.height = Number(result.gameData.paddle2.height);
            }
            if (result.gameData.paddle2.color) {
              this.player2.color = "#" + result.gameData.paddle2.color.hex;
              console.log("paddle2 color " + result.gameData.paddle2.color.hex);
            }
            if (result.gameData.paddle2.velocityY) {
              console.log("p2speed " + result.gameData.paddle2.velocityY);
              this.player2.velocityY = Number(
                result.gameData.paddle2.velocityY
              );
            }
          }
        },
        error => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  }

  _initializeGameCanvas = () => {
    // initialize canvas element and bind it to our React class
    this.canvas = this.refs.pong_canvas;
    this.ctx = this.canvas.getContext("2d");

    // declare initial variables
    this.p1Score = 0;
    this.p2Score = 0;
    this.keys = {};

    // add keyboard input listeners to handle user interactions
    window.addEventListener("keydown", e => {
      this.keys[e.keyCode] = 1;
      if (e.target.nodeName !== "INPUT") e.preventDefault();
    });
    window.addEventListener("keyup", e => delete this.keys[e.keyCode]);

    // instantiate our game elements
    this.player1 = new this.GameClasses.Box({
      x: 10,
      y: 200,
      width: 15,
      height: 80,
      color: this.props.paddle1Color,
      velocityY: 2
    });
    this.player2 = new this.GameClasses.Box({
      x: 725,
      y: 200,
      width: 15,
      height: 80,
      color: this.props.paddle2Color,
      velocityY: 2
    });
    this.boardDivider = new this.GameClasses.Box({
      x: this.canvas.width / 2 - 2.5,
      y: -1,
      width: 5,
      height: this.canvas.height + 1,
      color: "#FFF"
    });
    this.gameBall = new this.GameClasses.Box({
      x: this.canvas.width / 2,
      y: this.canvas.height / 2,
      width: this.state.ballWidth,
      height: this.state.ballHeight,
      color: this.state.ballColor,
      velocityX: this.state.speedX,
      velocityY: this.state.speedY
    });
    this._renderLoop();
  };

  // recursively process game state and redraw canvas

  _renderLoop = () => {
    this._ballCollisionY();
    this._userInput(this.player1);
    if (!this.state.twoPlayer) {
      this._aiMovement(this.player2);
    }
    else {
      this._userInput(this.player2);
    }
    this.frameId = window.requestAnimationFrame(this._renderLoop);
  };

  // watch ball movement in Y dimension and handle top/bottom boundary collisions, then call _ballCollisionX
  _ballCollisionY = () => {
    if (
      this.gameBall.y + this.gameBall.velocityY <= 0 ||
      this.gameBall.y + this.gameBall.velocityY + this.gameBall.height >=
        this.canvas.height
    ) {
      this.gameBall.velocityY = this.gameBall.velocityY * -1;
      this.gameBall.x += this.gameBall.velocityX;
      this.gameBall.y += this.gameBall.velocityY;
    } else {
      this.gameBall.x += this.gameBall.velocityX;
      this.gameBall.y += this.gameBall.velocityY;
    }
    this._ballCollisionX();
  };

  // watch ball movement in X dimension and handle paddle collisions and score setting/ball resetting, then call _drawRender
  _ballCollisionX = () => {
    if (
      (this.gameBall.x + this.gameBall.velocityX <=
        this.player1.x + this.player1.width &&
        this.gameBall.y + this.gameBall.velocityY > this.player1.y &&
        this.gameBall.y + this.gameBall.velocityY <=
          this.player1.y + this.player1.height) ||
      (this.gameBall.x + this.gameBall.width + this.gameBall.velocityX >=
        this.player2.x &&
        this.gameBall.y + this.gameBall.velocityY > this.player2.y &&
        this.gameBall.y + this.gameBall.velocityY <=
          this.player2.y + this.player2.height)
    ) {
      this.gameBall.velocityX = this.gameBall.velocityX * -1;
    } else if (
      this.gameBall.x + this.gameBall.velocityX <
      this.player1.x - 15
    ) {
      this.p2Score += 1;
      this.deadBalls.push(this.gameBall);
      if (this.p2Score >= this.props.winningScore) {
        this.p1Score = 0;
        this.p2Score=0;
        this.deadBalls=[];
      } else {
        this.gameBall = new this.GameClasses.Box({
          x: this.canvas.width / 2,
          y: this.canvas.height / 2,
          width: this.state.ballWidth,
          height: this.state.ballHeight,
          color: this.state.ballColor,
          velocityX: this.state.speedX,
          velocityY: this.state.speedY
        });
      }
    } else if (
      this.gameBall.x + this.gameBall.velocityX >
      this.player2.x + this.player2.width
    ) {
      this.p1Score += 1;
      this.deadBalls.push(this.gameBall);
      if (this.p1Score >= this.props.winningScore) {
        this.p1Score = 0;
        this.p2Score=0;
        this.deadBalls=[];
      } else {
        this.gameBall = new this.GameClasses.Box({
          x: this.canvas.width / 2,
          y: this.canvas.height / 2,
          width: this.state.ballWidth,
          height: this.state.ballHeight,
          color: this.state.ballColor,
          velocityX: -this.state.speedX,
          velocityY: this.state.speedY
        });
      }
    } else {
      this.gameBall.x += this.gameBall.velocityX;
      this.gameBall.y += this.gameBall.velocityY;
    }
    this._drawRender();
  };

  // clear canvas and redraw according to new game state
  _drawRender = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this._displayScore1();
    this._displayScore2();
    this._drawBox(this.player1);
    this._drawBox(this.player2);
    this._drawBox(this.boardDivider);
    this._drawBox(this.gameBall);
  };

  // take in game object and draw to canvas
  _drawBox = box => {
    this.ctx.fillStyle = box.color;
    this.ctx.fillRect(box.x, box.y, box.width, box.height);
  };

  // render player 1 score
  _displayScore1 = () => {
    this.ctx.font = "20px Arial";
    this.ctx.fillStyle = "rgb(255, 255, 255)";
    this.ctx.fillText(
      this.p1Score,
      this.canvas.width / 2 - (this.p1Score > 9 ? 55 : 45),
      30
    );
  };

  // render player 2 score
  _displayScore2 = () => {
    this.ctx.font = "20px Arial";
    this.ctx.fillStyle = "rgb(255, 255, 255)";
    this.ctx.fillText(this.p2Score, this.canvas.width / 2 + 33, 30);
  };

  _aiMovement = () => {
    if (this.gameBall.x>400 && this.gameBall.velocityX>0) {
      if(this.gameBall.y > this.player2.y+this.player2.width/3 && (this.player2.y + this.player2.height + this.player2.velocityY) < this.canvas.height){
        this.player2.y += this.player2.velocityY;
      }else if(this.gameBall.y < this.player2.y+this.player2.width/3 && (this.player2.y - this.player2.velocityY > 0)){
        this.player2.y -= this.player2.velocityY;
      }
    }
  }

  //track user input
  _userInput = () => {
    if (87 in this.keys) {
      if (this.player1.y - this.player1.velocityY > 0)
        this.player1.y -= this.player1.velocityY;
    } else if (83 in this.keys) {
      if (
        this.player1.y + this.player1.height + this.player1.velocityY <
        this.canvas.height
      )
        this.player1.y += this.player1.velocityY;
    }

    if (38 in this.keys) {
      if (this.player2.y - this.player2.velocityY > 0)
        this.player2.y -= this.player2.velocityY;
    } else if (40 in this.keys) {
      if (
        this.player2.y + this.player2.height + this.player2.velocityY <
        this.canvas.height
      )
        this.player2.y += this.player2.velocityY;
    }
  };

  GameClasses = (() => {
    return {
      Box: function Box(opts) {
        let { x, y, width, height, color, velocityX, velocityY } = opts;
        this.x = x || 10;
        this.y = y || 10;
        this.width = width || 40;
        this.height = height || 50;
        this.color = color || "#FFF";
        this.velocityX = velocityX || 2;
        this.velocityY = velocityY || 2;
      }
    };
  })();

  render() {
    return (
      <canvas
        id="pong_canvas"
        ref="pong_canvas"
        width="750"
        height="500"
        style={{ background: "#12260e", border: "4px solid #FFF" }}
      />
    );
  }
}

export default GameCanvas;

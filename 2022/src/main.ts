import {
  GameLoop,
  init,
  initInput,
  initKeys,
  keyPressed,
  onInput,
  Sprite,
} from "kontra";

import "./style.css";

let { canvas } = init();

const getStageWidth = () => {
  return window.innerWidth;
};
const getStageHeight = () => {
  return window.innerHeight;
};

const spanwBullet = () => {};

initKeys();

let sprite = Sprite({
  x: getStageWidth() / 2 - 15, // starting x,y position of the sprite
  y: getStageHeight() / 2 - 15,
  color: "red", // fill color of the sprite rectangle
  width: 30, // width and height of the sprite rectangle
  height: 30,
  //   dx: 2, // move the sprite 2px to the right every frame,
  update: () => {
    if (keyPressed("arrowRight")) {
      console.log("right");
    }
  },
});

let loop = GameLoop({
  // create the main game loop
  update: function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    //...drawing

    // update the game state
    sprite.update();

    // wrap the sprites position when it reaches
    // the edge of the screen
    if (sprite.x > canvas.width) {
      sprite.x = -sprite.width;
    }
  },
  render: function () {
    // render the game state
    sprite.render();
  },
});

loop.start(); // start the game

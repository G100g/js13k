import {
  collides,
  GameLoop,
  getCanvas,
  init,
  initInput,
  initKeys,
  keyPressed,
  onInput,
  Sprite,
} from "kontra";
import { Player } from "./player";

import "./style.css";
import { getRandomInt } from "./utils";

let { canvas } = init();

const getStageWidth = () => {
  return window.innerWidth;
};
const getStageHeight = () => {
  return window.innerHeight;
};

const BASE_LINE = (getStageHeight() / 3) * 2;

const spanwBullet = (direction: BulletDirection, x: number, y: number) => {
  const bullet = Sprite({
    x,
    y,
    width: 10,
    height: 10,
    color: "white",
    dx: direction === BulletDirection.right ? 10 : -10,
    dy: 0,
    update: function () {
      this.advance();
      // this.y += this.dy;
      // if (this.y < 0) {
      //     this.dy = 0;
      // }
      if (this.x && this.x > canvas.width) {
        this.toDestroy = true;
      }
    },
    power: 25,
  });
  return bullet;
};

const createZombie = (direction: BulletDirection) => {
  const canvas = getCanvas();

  const speed = getRandomInt(3, 5);

  const zombie = Sprite({
    x: direction === BulletDirection.left ? getStageWidth() : 20,
    y: BASE_LINE - 80,
    width: 40,
    height: 80,
    color: "green",
    dx: direction === BulletDirection.right ? speed : speed * -1,
    dy: 0,
    update: function () {
      this.advance();
      if ((this.x && this.x > canvas.width) || (this.x && this.x < 0)) {
        this.toDestroy = true;
      }
    },
    health: 100,
  });
  return zombie;
};
initInput();

let lastTime = 0;

let player = Player({
  x: getStageWidth() / 2 - 15, // starting x,y position of the sprite
  y: BASE_LINE - 30,
  color: "red", // fill color of the sprite rectangle
  width: 30, // width and height of the sprite rectangle
  height: 30,
  //   dx: 2, // move the sprite 2px to the right every frame,
});

// type BulletDirection = 'left' | 'right';

const enum BulletDirection {
  "left" = "left",
  "right" = "right",
}

const bulletManager = {
  timeToTriggerBUllet: 0,
  delay: 2,
  bullets: new Set<Sprite>(),
  triggerPulled: false,
  shoot(direction: BulletDirection) {
    if (this.timeToTriggerBUllet <= 0 && this.triggerPulled === false) {
      this.bullets.add(spanwBullet(direction, player.x, player.y));
      this.timeToTriggerBUllet = this.delay;
      this.triggerPulled = true;
    }
  },
  update() {
    this.bullets.forEach((bullet) => {
      bullet.update();

      if (bullet.toDestroy) {
        this.bullets.delete(bullet);
      }
    });

    this.timeToTriggerBUllet--;

    if (!keyPressed("arrowright") && !keyPressed("arrowleft")) {
      this.triggerPulled = false;
    }
  },
  render() {
    this.bullets.forEach((bullet) => {
      bullet.render();
    });
  },
  checkCollide(zombies: typeof zombieManager.pool) {
    zombies.forEach((zombie) => {
      this.bullets.forEach((bullet) => {
        if (collides(bullet, zombie)) {
          zombie.health -= bullet.power;

          const isDead = zombie.health <= 0;

          zombie.x -= zombie.dx > 0 ? 10 : -10;

          if (isDead) {
            zombie.toDestroy = true;
          }
          bullet.toDestroy = true;
        }
      });
    });
  },
};
const zombieManager = {
  lastTimeToSpawnZombie: 0,
  pool: new Set<Sprite>(),
  spwan(direction: BulletDirection) {
    this.pool.add(createZombie(direction));
  },
  update() {
    this.pool.forEach((zombie) => {
      zombie.update();

      if (zombie.toDestroy) {
        this.pool.delete(zombie);
      }
    });

    if (this.lastTimeToSpawnZombie <= 0) {
      const direction =
        Math.random() * 1 > 0.5 ? BulletDirection.right : BulletDirection.left;

      this.spwan(direction);

      this.lastTimeToSpawnZombie = getRandomInt(30, 130);
    }

    this.lastTimeToSpawnZombie--;
  },
  render() {
    this.pool.forEach((zombie) => {
      zombie.render();
    });
  },

  checkCollide(player: typeof Player) {
    this.pool.forEach((zombie) => {
      if (collides(player, zombie)) {
        player.health -= 5;

        const isDead = player.health <= 0;

        if (isDead) {
          player.toDestroy = true;
        }

        console.log(player.health);

        player.x -= 3;
      }
    });
  },
};

onInput("arrowright", (e) => {
  bulletManager.shoot(BulletDirection.right);
});
onInput("arrowleft", (e) => {
  bulletManager.shoot(BulletDirection.left);
});

let loop = GameLoop({
  // create the main game loop
  update: function (dt) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    //...drawing

    // update the game state
    player.update();

    // wrap the sprites position when it reaches
    // the edge of the screen
    if (player.x > canvas.width) {
      player.x = -player.width;
    }

    bulletManager.update();
    zombieManager.update();

    bulletManager.checkCollide(zombieManager.pool);
    zombieManager.checkCollide(player);
  },
  render: function () {
    // render the game state
    player.render();

    bulletManager.render();
    zombieManager.render();
  },
});

loop.start(); // start the game

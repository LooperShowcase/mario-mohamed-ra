kaboom({
  global: true,
  fullscreen: true,
  clearColor: [0, 0.5, 0.9, 1],
  debug: true,
  scale: 2,
});
loadRoot("./sprites/");
loadSprite("block", "block.png");
loadSprite("block_blue", "block_blue.png");
loadSprite("pipe_up", "pipe_up.png");
loadSprite("surprise", "surprise.png");
loadSprite("unboxed", "unboxed.png");
loadSprite("coin", "coin.png");
loadSprite("mario", "mario.png");
loadSprite("mushroom", "mushroom.png");
loadSprite("goomba", "evil_mushroom.png");
loadSprite("pipe", "pipe_up.png");
loadSound("sound", "gameSound.mp3");
loadSound("jsound", "jumpSound.mp3");
scene("over", ({ counter }) => {
  add([
    text("Game Over\n Coin collected: " + counter + ".", 32),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);
  keyDown("r", () => {
    go("game");
  });
});

scene("game", () => {
  layers(["bg", "obj", "ui"], "obj");

  play("sound");
  const key = {
    width: 20,
    height: 20,
    $: [sprite("coin"), "coin"],
    "=": [sprite("block"), solid()],
    "-": [sprite("block"), solid()],
    x: [sprite("unboxed"), solid()],
    z: [sprite("mushroom"), solid(), "mushroom", body()],
    e: [sprite("goomba"), solid(), "goomba", body()],
    s: [sprite("surprise"), solid(), "surprise-coin"],
    r: [sprite("surprise"), solid(), "surprise-mushroom"],
    j: [sprite("pipe"), solid()],
    J: [sprite("pipe"), solid()],
  };
  const map = [
    "                                                                                                                                 ",
    "                                                                                                                                 ",
    "                                                                                                                                 ",
    "                                                                                                                                 ",
    "                                                                                                                                 ",
    "                                                                                                                                 ",
    "                                                                                                                                 ",
    "                                                                                                                                 ",
    "                                                                                                                                 ",
    "                                                                                                                                 ",
    "                                                                                                                                 ",
    "                                                                                                                                 ",
    "                                                                                                                                 ",
    "                                                                                                                                 ",
    "                                                                                                                                 ",
    "                                                                                                                                 ",
    "                                                                                                                                 ",
    "                                                                                                                                 ",
    "                                                       =========              r                                                  ",
    "                                                                                                                                 ",
    "                                       s    ========                                                                             ",
    "                                           =                             =====                                                   ",
    "                                          =                                                                                      ",
    "                                        -             e             J                  e                                        ",
    "=================================================================================================================================",
    "=================================================================================================================================",
    "=================================================================================================================================",
  ];

  const gameLevel = addLevel(map, key);
  let isJumping = false;
  let counter = 0;
  let speed1 = 20;
  let goombaSpeed = 20;
  const speed = 120;
  const jumpForce = 400;
  const player = add([
    sprite("mario"),
    solid(),
    pos(500, 0),
    body(),
    origin("bot"),
    big(jumpForce),
  ]);
  const goomba = add([
    sprite("goomba"),
    solid(),
    pos(500, 0),
    body(),
    origin("bot"),
  ]);

  keyDown("right", () => {
    player.move(speed, 0);
  });
  keyDown("left", () => {
    if (player.pos.x > 500) {
      player.move(-speed, 0);
    }
  });

  keyDown("a", () => {
    if (player.pos.x > 500) {
      player.move(-speed, 0);
    }
  });
  keyDown("d", () => {
    player.move(speed, 0);
  });
  keyDown("s", () => {
    player.move(0, 200);
  });
  keyPress("space", () => {
    if (player.grounded()) {
      isJumping = true;

      player.jump(jumpForce);
      play("jsound");
    }
  });
  keyPress("w", () => {
    if (player.grounded()) {
      isJumping = true;
      player.jump(jumpForce);
      play("jsound");
    }
  });
  keyPress("up", () => {
    if (player.grounded()) {
      play("jsound");

      isJumping = true;
      player.jump(jumpForce);
    }
  });
  keyDown("down", () => {
    player.move(0, 200);
  });

  player.on("headbump", (obj) => {
    if (obj.is("surprise-coin")) {
      gameLevel.spawn("$", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn("x", obj.gridPos);
    }
    if (obj.is("surprise-mushroom")) {
      gameLevel.spawn("z", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn("x", obj.gridPos);
    }
  });

  player.collides("coin", ($) => {
    counter++;
    destroy($);
  });
  player.collides("mushroom", (z) => {
    destroy(z);
    player.biggify(5);
  });

  action("mushroom", (z) => {
    z.move(20, 0);
  });

  action("goomba", (e) => {
    e.move(-goombaSpeed, 0);
    e.collides("-", (y) => {
      goombaSpeed = goombaSpeed * -1;
    });
    e.collides("J", (y) => {
      goombaSpeed = goombaSpeed * -1;
    });
  });

  player.collides("goomba", (x) => {
    if (isJumping) {
      destroy(x);
    } else {
      destroy(player);
      go("over", { counter: counter });
    }
  });

  action("mushroom", (x) => {
    x.move(20, 0);
  });
  action("goomba", (x) => {});
  player.action(() => {
    camPos(player.pos);
    if (player.grounded()) {
      isJumping = false;
    } else isJumping = true;
    if (player.pos.y >= height() + 300) {
      go("over", { counter: counter });
    }
  });
});
start("game");

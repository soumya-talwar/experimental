var frame = 0;
var speed = 5;
var dino1, dino2, dino3, cactus, cloud, restart;
var dino = {};
var cactii = [];
var clouds = [];
var stop = false;

function preload() {
  dino1 = loadImage("images/dino 1.png");
  dino2 = loadImage("images/dino 2.png");
  dino3 = loadImage("images/dino 3.png");
  cactus = loadImage("images/cactus.png");
  cloud = loadImage("images/cloud.png");
  restart = loadImage("images/restart.png");
}

function setup() {
  dino = {
    left: 0,
    top: 0,
    velocity: 0,
    gravity: 0,
    jump: 18,
    flying: false,
    current: 0,
    versions: [dino1, dino2, dino3]
  }
  createCanvas(1000, 500).parent("#canvas");
  dino.top = height / 7 * 5 - 80;
  $("#restart img").click(() => {
    $("#restart").toggleClass("position-absolute d-none d-flex justify-content-center align-items-center");
    frame = 0;
    speed = 5;
    dino = {
      left: 0,
      top: height / 7 * 5 - 80,
      velocity: 0,
      gravity: 0,
      jump: 18,
      flying: false,
      current: 0,
      versions: [dino1, dino2, dino3]
    }
    cactii = [];
    clouds = [];
    stop = false;
    background("#F7F7F7");
    $("#score").html(frame);
  });
}

function draw() {
  if (!stop) {
    background("#F7F7F7");
    stroke("#535353");
    strokeWeight(1);
    line(0, height / 7 * 5, width, height / 7 * 5);
    if (frame % 4 == 0)
      dino.current = Number(!Boolean(dino.current));
    for (let i = cactii.length - 1; i >= 0; i--) {
      image(cactus, cactii[i].left, cactii[i].top, 45, 90);
      if (!(dino.left < cactii[i].left && dino.left + 74 < cactii[i].left) && !(dino.left > cactii[i].left + 45 && dino.left + 74 > cactii[i].left + 45)) {
        if (dino.top + 80 > cactii[i].top) {
          stop = true;
          dino.current = 2;
          $("#restart").css({
            "height": height,
            "width": width
          });
          $("#restart").toggleClass("position-absolute d-none d-flex justify-content-center align-items-center");
        }
      }
      cactii[i].left -= speed;
      if (cactii[i].left + 50 < 0)
        cactii.splice(i, 1);
    }
    for (let i = clouds.length - 1; i >= 0; i--) {
      image(cloud, clouds[i].left, clouds[i].top, 120, 35);
      clouds[i].left -= speed;
      if (clouds[i].left + 100 < 0)
        clouds.splice(i, 1);
    }
    if (frame % 100 == 0) {
      cactii.push({
        left: width + randomGaussian(map(speed, 5, 30, 50, 200), 50),
        top: height / 7 * 5 - 90
      });
      speed = constrain(speed + 0.5, 0, 30);
    }
    if (frame % 70 == 0) {
      clouds.push({
        left: width + randomGaussian(map(speed, 5, 30, 30, 100), 50),
        top: 30 + randomGaussian(50, 50)
      });
    }
    image(dino.versions[dino.current], dino.left, dino.top, 74, 80);
    dino.top += dino.velocity;
    dino.velocity = dino.velocity + dino.gravity;
    if (dino.top >= height / 7 * 5 - 80) {
      dino.gravity = 0;
      dino.velocity = 0;
      dino.flying = false;
    }
    frame++;
    $("#score").html(frame);
  }
}

function keyPressed() {
  if (keyCode == 32 && !dino.flying) {
    dino.velocity -= dino.jump;
    dino.gravity = 1;
    dino.flying = true;
  }
}
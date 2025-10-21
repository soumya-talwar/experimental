var frame = 0;
var speed = 5;
var dino1, dino2, dino3, cactus, cloud;
var dino = {};
var taxes = [];
var clouds = [];
var stop = false;

function preload() {
  dino1 = loadImage("images/dino 1.png");
  dino2 = loadImage("images/dino 2.png");
  dino3 = loadImage("images/dino 3.png");
  tax = loadImage("images/tax.png");
  cloud = loadImage("images/cloud.png");
}

function setup() {
  dino = {
    left: 0,
    top: 0,
    velocity: 0,
    gravity: 0,
    jump: 15,
    flying: false,
    current: 0,
    versions: [dino1, dino2, dino3]
  }
  createCanvas(1000, 500).parent("#canvas");
  dino.top = height / 7 * 5 - 80;
}

function draw() {
  if (!stop) {
    background("#F7F7F7");
    stroke("#535353");
    strokeWeight(1);
    line(0, height / 7 * 5, width, height / 7 * 5);
    if (frame % 4 == 0)
      dino.current = Number(!Boolean(dino.current));
    for (let i = clouds.length - 1; i >= 0; i--) {
      image(cloud, clouds[i].left, clouds[i].top, 120, 35);
      clouds[i].left -= speed;
      if (clouds[i].left + 100 < 0)
        clouds.splice(i, 1);
    }
    for (let i = taxes.length - 1; i >= 0; i--) {
      image(tax, taxes[i].left, taxes[i].top, 50, 44);
      if (!(dino.left < taxes[i].left && dino.left + 74 < taxes[i].left) && !(dino.left > taxes[i].left + 50 && dino.left + 74 > taxes[i].left + 50)) {
        if (dino.top + 80 > taxes[i].top) {
          stop = true;
          dino.current = 2;
          setTimeout(() => window.location.href = "https://www.incometax.gov.in/", 500);
        }
      }
      taxes[i].left -= speed;
      if (taxes[i].left + 50 < 0)
        taxes.splice(i, 1);
    }
    if (frame % 100 == 0) {
      taxes.push({
        left: width + randomGaussian(map(speed, 15, 40, 50, 200), 50),
        top: height / 7 * 5 - 50
      });
      speed = constrain(speed + 0.5, 0, 40);
    }
    if (frame % 70 == 0) {
      clouds.push({
        left: width + randomGaussian(map(speed, 15, 40, 30, 100), 50),
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

var bird = {};
var obstacles = [];
var thick = 100;
var speed = 3;
var gravity = 0.1;
var score = 0;
var img;

function preload() {
  img = loadImage("images/bird.png");
}

function setup() {
  createCanvas(1000, 500).parent("#canvas");
  reset();
}

function reset() {
  obstacles = [];
  score = 0;
  $("#score").html(score);
  bird.left = 100;
  bird.top = height / 2;
  bird.velocity = 0;
  bird.gravity = 0.1;
  bird.flight = 5;
}

function draw() {
  background("#C8F2EF");
  stroke(0);
  strokeWeight(3);
  for (let i = obstacles.length - 1; i >= 0 && obstacles[i]; i--) {
    for (let [index, obstacle] of obstacles[i].entries()) {
      fill("#95CD41");
      rect(obstacle.left, obstacle.top, thick, obstacle.length);
      if (!(bird.left < obstacle.left && bird.left + 40 < obstacle.left) && !(bird.left > obstacle.left + thick && bird.left + 40 > obstacle.left + thick)) {
        if (index == 0 && bird.top < obstacle.bottom)
          reset();
        else if (index == 1 && (bird.top + 32) > obstacle.top)
          reset();
      }
      obstacle.left -= speed;
      if (obstacle.left + thick < 0) {
        obstacles.splice(i, 1);
        break;
      }
    }
  }
  if (frameCount % 5 == 0) {
    score++;
    $("#score").html(score);
    if (frameCount % 80 == 0) {
      let distance = randomGaussian(50, 10);
      let length = random(50, 300);
      let gap = random(100, 150);
      obstacles.push([{
        left: width + distance,
        top: 0,
        bottom: length,
        length: length
      }, {
        left: width + distance,
        top: length + gap,
        bottom: height,
        length: height - length - gap
      }]);
    }
  }
  bird.top += bird.velocity;
  if (bird.top > height - 32) {
    bird.top = height - 32;
    bird.velocity = 0;
  } else if (bird.top < 0) {
    bird.top = 0;
    bird.velocity = 0;
  }
  bird.velocity = constrain(bird.velocity + gravity, -4, 4);
  image(img, bird.left, bird.top);
}

function keyPressed() {
  if (keyCode == 32)
    bird.velocity -= bird.flight;
}
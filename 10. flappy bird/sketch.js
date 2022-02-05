var bird = {};
var obstacles = [];
var thick = 100;
var speed = 2.5;
var img;
var score = 0;

function preload() {
  img = loadImage("images/bird.png");
}

function setup() {
  createCanvas(1000, 500).parent("#canvas");
  reset();
}

function reset() {
  score = 0;
  $("#score").html(score);
  bird.left = 100;
  bird.top = height / 2;
  bird.velocity = 0;
  bird.gravity = 0.1;
  bird.flight = 5;
  obstacles = [];
  let start = 500;
  for (let i = 0; i < 4; i++) {
    let length = random(50, 300);
    let gap = random(100, 150);
    obstacles.push([{
      left: start,
      top: 0,
      bottom: length,
      length: length
    }, {
      left: start,
      top: length + gap,
      bottom: height,
      length: height - length - gap
    }]);
    start += random(250, 300);
  }
}

function draw() {
  background("#C8F2EF");
  stroke(0);
  strokeWeight(3);
  for (let i = obstacles.length - 1; i >= 0; i--) {
    for (let [index, obstacle] of obstacles[i].entries()) {
      fill("#95CD41");
      rect(obstacle.left, obstacle.top, thick, obstacle.length);
      if (!(bird.left < obstacle.left && bird.left + 40 < obstacle.left) && !(bird.left > obstacle.left + thick && bird.left + 40 > obstacle.left + thick)) {
        console.log("IN THE RANGE");
        if (index == 0 && bird.top < obstacle.bottom)
          reset();
        else if (index == 1 && (bird.top + 32) > obstacle.top)
          reset();
      }
      obstacle.left -= speed;
      if (obstacle.left + thick < 0) {
        obstacles.splice(i, 1);
        let distance = randomGaussian(50, 20);
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
        break;
      }
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
  bird.velocity = constrain(bird.velocity + bird.gravity, -4, 4);
  image(img, bird.left, bird.top);
  if (frameCount % 5 == 0) {
    score++;
    $("#score").html(score);
  }
}

function keyPressed() {
  if (keyCode == 32)
    bird.velocity -= bird.flight;
}
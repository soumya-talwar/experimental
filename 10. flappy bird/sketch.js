var bird = {};
var obstacles = [];
var colors = ["#81B214", "#CDC733"];
var bottom = true;
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
  score = 0;
  $("#score").html(score);
  bird.x = 100;
  bird.y = height / 2;
  bird.velocity = 2;
  obstacles = [];
  let start = 400;
  for (let i = 0; i < 6; i++) {
    obstacles.push({
      color: random(colors),
      x: start,
      length: randomGaussian(300, 50),
      bottom: i % 2 == 0 ? true : false
    });
    start += random(150, 200);
  }
}

function draw() {
  background("#CDF0EA");
  stroke(0);
  strokeWeight(3);
  for (let i = obstacles.length - 1; i >= 0; i--) {
    let obstacle = obstacles[i];
    fill(obstacle.color);
    rect(obstacle.x, obstacle.bottom ? height - obstacle.length : 0, 50, obstacle.length);
    obstacle.x -= 1;
    if (obstacle.x + 50 < 0) {
      obstacles.splice(i, 1);
      obstacles.push({
        color: random(colors),
        x: width + random(0, 50),
        length: randomGaussian(300, 50),
        bottom: bottom
      });
      bottom = !bottom;
      score += 100;
      $("#score").html(score);
    }
    if ((bird.x + 40 > obstacle.x && bird.x < obstacle.x) || (bird.x < obstacle.x + 50 && bird.x + 40 > obstacle.x + 50)) {
      if (!obstacle.bottom && bird.y < obstacle.length)
        reset();
      else if (obstacle.bottom && (bird.y + 32) > (height - obstacle.length))
        reset();
    }
  }
  image(img, bird.x, bird.y);
  bird.y = constrain(bird.y + bird.velocity, 0, height - 25);
  bird.velocity = constrain(bird.velocity + 0.1, -5, 5);
}

function keyPressed() {
  if (keyCode == 32) {
    bird.velocity -= 6;
  }
}
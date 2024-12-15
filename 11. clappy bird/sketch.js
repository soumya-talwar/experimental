var start = false;
var mic;
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
  $("#start").click(() => {
    mic = new p5.AudioIn();
    mic.start();
    getAudioContext().resume();
    $("#start").toggleClass("clickable");
    $("#start").html("SCORE: ")
    start = true;
  });
  createCanvas(1000, 500).parent("#canvas");
  background("#C8F2EF");
  reset();
}

function reset() {
  obstacles = [];
  score = 0;
  bird.left = 100;
  bird.top = height / 2;
  bird.velocity = 0;
  bird.gravity = 0.01;
  bird.flight = 5;
}

function draw() {
  if (start) {
    var volume = mic.getLevel();
    console.log(volume);
    background("#C8F2EF");
    stroke(0);
    strokeWeight(3);
    for (let i = obstacles.length - 1; i >= 0 && obstacles[i]; i--) {
      for (let [index, obstacle] of obstacles[i].entries()) {
        fill("#95CD41");
        rect(obstacle.left, obstacle.top, thick, obstacle.bottom - obstacle.top);
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
      if (frameCount % 100 == 0) {
        let gap = random(150, height / 3);
        let point = random(gap / 2 + 50, height - gap / 2 - 50);
        let distance = 100;
        obstacles.push([{
          left: width + distance,
          top: 0,
          bottom: constrain(point - gap / 2, 0, height)
        }, {
          left: width + distance,
          top: constrain(point + gap / 2, 0, height),
          bottom: height
        }]);
      }
    }
    if (volume > 0.2)
      bird.velocity -= bird.flight;
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
}

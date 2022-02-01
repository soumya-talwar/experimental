var engine, runner;
var rows, columns;
var padding = 40;
var pegs = [];
var balls = [];
var ground;
var slots = [];

function setup() {
  createCanvas(1000, $("#canvas").height()).parent("#canvas");
  engine = Matter.Engine.create();
  rows = floor((height / padding) * 3 / 4);
  columns = floor(width / padding) - 1;
  for (let i = 0; i < rows; i++) {
    for (let j = (i % 2 == 0 ? 0 : 0.5); j < (i % 2 == 0 ? columns : columns - 1); j++) {
      pegs.push(Matter.Bodies.circle(j * padding + padding, i * padding + padding, 5, {
        isStatic: true
      }));
    }
  }
  ground = Matter.Bodies.rectangle(width / 2, height + 5, width, 10, {
    isStatic: true
  });
  for (let i = 0; i < columns; i++) {
    slots.push(Matter.Bodies.rectangle(i * padding + padding, height - 40, 1, 80, {
      isStatic: true
    }));
  }
  Matter.Composite.add(engine.world, pegs.concat(ground, slots));
  runner = Matter.Runner.create();
  Matter.Runner.run(engine, runner);
}

function draw() {
  background(250);
  noStroke();
  for (let peg of pegs) {
    fill(220);
    circle(peg.position.x, peg.position.y, 5 * 2);
  }
  for (let i = balls.length - 1; i >= 0; i--) {
    let ball = balls[i];
    fill(ball.color);
    circle(ball.body.position.x, ball.body.position.y, 7 * 2);
    if (ball.body.position.x < 0 || ball.body.position.x > width) {
      Matter.Composite.remove(engine.world, ball.body);
      balls.splice(i, 1);
    }
  }
  for (let slot of slots) {
    fill(220);
    rectMode(CENTER);
    rect(slot.position.x, slot.position.y, 1, 80);
  }
}

function mouseDragged() {
  let ball = {
    color: random(["#FFCB91", "#FFEFA1", "#94EBCD", "#6DDCCF"]),
    body: Matter.Bodies.circle(mouseX + random(-2, 2), 0, 7, {
      density: 1,
      friction: 0.2,
      restitution: 0.5
    })
  };
  balls.push(ball);
  Matter.Composite.add(engine.world, ball.body);
}
var engine, runner;
var knobs = [];
var balls = [];
var rows, columns;
var padding = 40;

function setup() {
  createCanvas(1000, $("#canvas").height()).parent("#canvas");
  engine = Matter.Engine.create();
  rows = floor(height / padding) - 1;
  columns = floor(width / padding) - 1;
  let even = false;
  for (let i = 0; i < rows; i++) {
    let count = even ? 0.5 : 0;
    while (count < (even ? columns - 1 : columns)) {
      let knob = new Knob(count * padding + padding, i * padding + padding, 5, true);
      knobs.push(knob);
      Matter.Composite.add(engine.world, knob.body);
      count++;
    }
    even = !even;
  }
  runner = Matter.Runner.create();
  Matter.Runner.run(runner, engine);
}

function draw() {
  background(250);
  for (let knob of knobs) {
    knob.display();
  }
  for (let i = balls.length - 1; i >= 0; i--) {
    let ball = balls[i];
    ball.display();
    if (ball.body.position.y > height) {
      Matter.Composite.remove(engine.world, ball.body);
      balls.splice(i, 1);
    }
  }
}

function mouseDragged() {
  let ball = new Ball(mouseX, 0, 7, false);
  balls.push(ball);
  Matter.Composite.add(engine.world, ball.body);
}

class Knob {
  constructor(x, y, radius, fixed) {
    this.radius = radius;
    this.body = Matter.Bodies.circle(x, y, this.radius, {
      friction: 1,
      isStatic: fixed
    });
  }

  display() {
    noStroke();
    fill("#E4E3DD");
    push();
    translate(this.body.position.x, this.body.position.y);
    rotate(this.body.angle);
    circle(0, 0, this.radius * 2);
    pop();
  }
}

class Ball {
  constructor(x, y, radius, fixed) {
    this.radius = radius;
    this.color = random(["#2ec4b6", "#ff9f1c", "#ffbf69", "#cbf3f0"]);
    this.body = Matter.Bodies.circle(x, y, this.radius, {
      isStatic: fixed
    });
  }

  display() {
    noStroke();
    fill(this.color);
    push();
    translate(this.body.position.x, this.body.position.y);
    rotate(this.body.angle);
    circle(0, 0, this.radius * 2);
    pop();
  }
}
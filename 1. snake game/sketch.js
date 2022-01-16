var unit = 15;
var columns, rows;
var snake = {
  xspeed: 1,
  yspeed: 0,
  length: 1,
  body: [{
    x: 0,
    y: 0
  }]
};
var food = {
  x: 0,
  y: 0
}
var pause = false;

function setup() {
  createCanvas($(window).width() - 300, $("#canvas").height()).parent("canvas");
  frameRate(10);
  columns = floor(width / unit);
  rows = floor(height / unit);
  snake.body[0].y = floor(rows / 2);
  food.x = floor(random(columns));
  food.y = floor(random(rows));
}

function draw() {
  background(245);
  if (!pause)
    snake.update();
  fill(150);
  noStroke();
  rect(food.x * unit, food.y * unit, unit, unit);
  fill(0);
  for (let body of snake.body) {
    rect(body.x * unit, body.y * unit, unit, unit);
  }
}

function keyPressed() {
  if (keyCode == UP_ARROW)
    snake.turn(0, -1);
  else if (keyCode == DOWN_ARROW)
    snake.turn(0, 1);
  else if (keyCode == LEFT_ARROW)
    snake.turn(-1, 0);
  else if (keyCode == RIGHT_ARROW)
    snake.turn(1, 0);
  else if (keyCode == 32)
    pause = !pause;
}

snake.update = function() {
  for (let i = snake.length - 1; i > 0; i--) {
    snake.body[i].x = snake.body[i - 1].x;
    snake.body[i].y = snake.body[i - 1].y;
  }
  snake.body[0].x += snake.xspeed;
  if (snake.body[0].x >= columns)
    snake.body[0].x = 0;
  else if (snake.body[0].x < 0)
    snake.body[0].x = columns - 1;
  snake.body[0].y += snake.yspeed;
  if (snake.body[0].y >= rows)
    snake.body[0].y = 0;
  else if (snake.body[0].y < 0)
    snake.body[0].y = rows - 1;
  for (let i = 1; i < snake.length; i++) {
    if (dist(snake.body[0].x, snake.body[0].y, snake.body[i].x, snake.body[i].y) < 1) {
      snake.body.splice(1, snake.length);
      snake.length = 1;
    }
  }
  if (dist(snake.body[0].x, snake.body[0].y, food.x, food.y) < 1) {
    food.x = floor(random(columns));
    food.y = floor(random(rows));
    snake.body.push({
      x: snake.body[snake.length - 1].x,
      y: snake.body[snake.length - 1].y
    });
    snake.length++;
  }
}

snake.turn = function(turnx, turny) {
  snake.xspeed = turnx;
  snake.yspeed = turny;
}
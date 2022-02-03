var frog = {};
var rows, columns;
var unit = 25;
var lanes = [];
var boat = false;

function setup() {
  createCanvas(1000, 500).parent("#canvas");
  rows = floor(height / unit);
  columns = floor(width / unit);
  for (let i = 0; i < rows - 1; i++) {
    lanes[i] = {};
    lanes[i].row = i;
    if (i >= rows / 2)
      lanes[i].color = "#FFAD60";
    else
      lanes[i].color = "#96CEB4";
    lanes[i].vehicles = [];
    let number = random([2, 3])
    let velocity = random(1, 3);
    if (i % 2 == 0)
      velocity *= -1;
    let length = random([2, 3, 4, 5, 6]);
    let start = floor(random(columns));
    let gap = random([3, 4]);
    for (let j = 0; j < number; j++) {
      lanes[i].vehicles.push({
        size: length,
        velocity: velocity,
        start: start * unit
      });
      start += length + gap;
    }
  }
  reset();
}

function reset() {
  frog.x = floor(columns / 2) * unit;
  frog.y = (rows - 1);
  frog.velocity = 0;
  boat = false;
}

function collision() {
  frog.left = frog.x;
  frog.right = frog.x + unit;
  for (let vehicle of lanes[frog.y].vehicles) {
    vehicle.left = vehicle.start;
    vehicle.right = vehicle.start + vehicle.size * unit;
    if (frog.y >= rows / 2) {
      if (!(vehicle.left < frog.left && vehicle.right < frog.left) && !(vehicle.right > frog.right && vehicle.left > frog.right)) {
        reset();
        break;
      }
    } else {
      if (!(vehicle.left < frog.left && vehicle.right < frog.left) && !(vehicle.right > frog.right && vehicle.left > frog.right)) {
        frog.velocity = vehicle.velocity;
        boat = true;
        break;
      }
    }
  }
  if (frog.y < rows / 2 && !boat) {
    reset();
  }
}

function draw() {
  background("#FFAD60");
  noStroke();
  for (let lane of lanes) {
    fill(lane.color);
    rect(0, lane.row * unit, width, unit);
    for (let vehicle of lane.vehicles) {
      if (lane.row < rows / 2)
        fill("#FFEEAD");
      else
        fill("#D9534F");
      rect(vehicle.start, lane.row * unit, vehicle.size * unit, unit);
      vehicle.start += vehicle.velocity;
      if (vehicle.start > width)
        vehicle.start = 0 - vehicle.size * unit;
      else if (vehicle.start + vehicle.size * unit < 0)
        vehicle.start = width;
    }
  }
  fill("#8A8635");
  rect(frog.x, frog.y * unit, unit, unit);
  frog.x += frog.velocity;
  if (frog.x > width || frog.x < 0)
    reset();
  if (frog.y !== rows - 1)
    collision();
}

function keyPressed() {
  if (keyCode == UP_ARROW)
    frog.y = constrain(--frog.y, 0, rows - 1);
  else if (keyCode == DOWN_ARROW)
    frog.y = constrain(++frog.y, 0, rows - 1);
  else if (keyCode == LEFT_ARROW)
    frog.x = constrain(frog.x - unit, 0, (columns - 1) * unit);
  else if (keyCode == RIGHT_ARROW)
    frog.x = constrain(frog.x + unit, 0, (columns - 1) * unit);
  if (boat) {
    boat = false;
    frog.velocity = 0;
  }
}
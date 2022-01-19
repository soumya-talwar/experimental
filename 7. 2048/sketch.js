var size = 500;
var padding = 10;
var unit = Math.floor((size - padding * 5) / 4);
var tiles = [];
var numbers = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048];
var end = false;

var colors = {
  empty: ["#ccc0b3", "#ccc0b3"],
  2: ["#eee4da", "#766e65"],
  4: ["#ede0c8", "#766e65"],
  8: ["#f2b179", "#f9f6f1"],
  16: ["#f59563", "#f9f6f1"],
  32: ["#f67c5f", "#f9f6f1"],
  64: ["#f65e3b", "#f9f6f1"],
  128: ["#edcf72", "#f9f6f1"],
  256: ["#edcc61", "#f9f6f1"],
  512: ["#edc851", "#f9f6f1"],
  1024: ["#edc53f", "#f9f6f1"],
  2048: ["#edc22e", "#f9f6f1"]
};

var font;

function preload() {
  font = loadFont("fonts/clear-sans.ttf");
}

function setup() {
  createCanvas(size, size).parent("canvas");
  for (let i = 0; i < 4; i++) {
    tiles[i] = [];
    for (let j = 0; j < 4; j++) {
      tiles[i][j] = {
        top: i * unit + (i + 1) * padding,
        left: j * unit + (j + 1) * padding,
        empty: true,
        value: null,
        color: colors.empty
      }
    }
  }
  activate(tiles[0][0]);
  activate(tiles[0][1]);
}

function activate(tile) {
  tile.empty = false;
  tile.value = random(10) < 8 ? 2 : 4;
  tile.color = colors[tile.value];
}

function move(direction) {
  let old = JSON.parse(JSON.stringify(tiles));
  switch (direction) {
    case "left":
      slide();
      break;
    case "right":
      mirror();
      slide();
      mirror();
      break;
    case "up":
      transpose();
      slide();
      transpose();
      break;
    case "down":
      transpose();
      mirror();
      slide();
      mirror();
      transpose();
      break;
  }
  let change = false;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (JSON.stringify(tiles[i][j]) != JSON.stringify(old[i][j]))
        change = true;
    }
  }
  if (change) {
    let empty = [];
    for (let row of tiles) {
      for (let tile of row) {
        if (tile.empty)
          empty.push(tile);
      }
    }
    if (empty.length > 0)
      activate(random(empty));
    else
      end = true;
  }
}

function mirror() {
  for (let row of tiles) {
    row.reverse();
  }
}

function transpose() {
  let transpose = [];
  for (let i = 0; i < 4; i++) {
    let row = [];
    for (let j = 0; j < 4; j++) {
      row.push(tiles[j][i]);
    }
    transpose.push(row);
  }
  tiles = transpose;
}

function slide() {
  for (let i = 0; i < 4; i++) {
    let combined = [false, false, false, false];
    for (let j = 0; j < 4; j++) {
      if (tiles[i][j].empty)
        continue;
      let value = tiles[i][j].value;
      tiles[i][j].value = null;
      tiles[i][j].empty = true;
      tiles[i][j].color = colors.empty;
      let position = j == 0 ? 0 : j - 1;
      while (position > 0 && tiles[i][position].empty) {
        position--;
      }
      if (j == 0 || tiles[i][position].empty) {
        tiles[i][position].empty = false;
        tiles[i][position].value = value;
        tiles[i][position].color = colors[value];
      } else if (tiles[i][position].value == value && !combined[position]) {
        value *= 2;
        tiles[i][position].value = value;
        tiles[i][position].color = colors[value];
        combined[position] = true;
        if (value == 2048)
          setTimeout(() => end = true, 500);
      } else {
        position++;
        tiles[i][position].empty = false;
        tiles[i][position].value = value;
        tiles[i][position].color = colors[value];
      }
    }
  }
}

function draw() {
  if (!end) {
    background("#bbac9f");
    for (let row of tiles) {
      for (let tile of row) {
        noStroke();
        fill(tile.color[0]);
        rect(tile.left, tile.top, unit, unit);
        if (!tile.empty) {
          fill(tile.color[1]);
          textFont(font);
          let size = map(numbers.indexOf(tile.value), 0, 10, unit / 2, unit / 3);
          textSize(size);
          textAlign(CENTER, CENTER);
          text(tile.value, tile.left + unit / 2, tile.top + unit / 2.5);
        }
      }
    }
  } else {
    background("#edc84f");
    fill("#766e65");
    textFont(font);
    textSize(unit / 2);
    textAlign(CENTER, CENTER);
    text("you win!", width / 2, height / 2);
  }
}

function keyPressed() {
  if (!end) {
    if (keyCode === LEFT_ARROW)
      move("left");
    else if (keyCode === RIGHT_ARROW)
      move("right");
    else if (keyCode === UP_ARROW)
      move("up");
    else if (keyCode === DOWN_ARROW)
      move("down");
  }
}
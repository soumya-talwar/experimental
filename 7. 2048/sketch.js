var size = 500;
var padding = 10;
var unit = Math.floor((size - padding * 5) / 4);
var tiles = [];
var numbers = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048];
var frames = [];
var count = 0;
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
      };
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
      slide(direction);
      break;
    case "right":
      mirror();
      slide(direction);
      mirror();
      break;
    case "up":
      transpose();
      slide(direction);
      transpose();
      break;
    case "down":
      transpose();
      mirror();
      slide(direction);
      mirror();
      transpose();
      break;
  }
  let change = false;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (JSON.stringify(tiles[i][j]) !== JSON.stringify(old[i][j]))
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
    if (empty.length > 0) {
      activate(random(empty));
      count = 0;
    } else
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

function slide(direction) {
  frames = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (tiles[i][j].empty)
        continue;
      let value = tiles[i][j].value;
      tiles[i][j].empty = true;
      tiles[i][j].value = null;
      tiles[i][j].color = colors.empty;
      let position = j == 0 ? 0 : j - 1;
      while (position > 0 && tiles[i][position].empty) {
        position--;
      }
      if (j == 0 || tiles[i][position].empty) {
        tiles[i][position].empty = false;
        tiles[i][position].value = value;
        tiles[i][position].color = colors[value];
      } else if (tiles[i][position].value == value) {
        value *= 2;
        tiles[i][position].empty = false;
        tiles[i][position].value = value;
        tiles[i][position].color = colors[value];
        if (value == 2048)
          setTimeout(() => end = true, 500);
      } else {
        position++;
        tiles[i][position].empty = false;
        tiles[i][position].value = value;
        tiles[i][position].color = colors[value];
      }
      frames.push(animate(direction, i, j, position, value));
    }
  }
}

function animate(direction, row, column, newcolumn, value) {
  let row1, row2, column1, column2;
  switch (direction) {
    case "left":
      row1 = row;
      row2 = row;
      column1 = column;
      column2 = newcolumn;
      break;
    case "right":
      row1 = row;
      row2 = row;
      column1 = 3 - column;
      column2 = 3 - newcolumn;
      break;
    case "up":
      row1 = column;
      row2 = newcolumn;
      column1 = row;
      column2 = row;
      break;
    case "down":
      row1 = 3 - column;
      row2 = 3 - newcolumn;
      column1 = row;
      column2 = row;
      break;
  }
  let top1 = row1 * unit + (row1 + 1) * padding;
  let top2 = row2 * unit + (row2 + 1) * padding;
  let left1 = column1 * unit + (column1 + 1) * padding;
  let left2 = column2 * unit + (column2 + 1) * padding;
  return [top1, top2, left1, left2, value];
}

function draw() {
  if (!end) {
    background("#bbac9f");
    if (count == 5) {
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
      for (let row of tiles) {
        for (let tile of row) {
          noStroke();
          fill(colors.empty[0]);
          rect(tile.left, tile.top, unit, unit);
        }
      }
      for (let [top1, top2, left1, left2, value] of frames) {
        let top = lerp(top1, top2, count / 5);
        let left = lerp(left1, left2, count / 5);
        noStroke();
        fill(colors[value][0]);
        rect(left, top, unit, unit);
        fill(colors[value][1]);
        textFont(font);
        let size = map(numbers.indexOf(value), 0, 10, unit / 2, unit / 3);
        textSize(size);
        textAlign(CENTER, CENTER);
        text(value, left + unit / 2, top + unit / 2.5);
      }
      count++;
    }
  } else {
    background(255, 228, 150, 10);
    fill("#766e65");
    textFont(font);
    textSize(unit / 3);
    textAlign(CENTER, CENTER);
    text("You Win!", width / 2, height / 2);
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
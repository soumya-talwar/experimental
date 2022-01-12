var cells = [];
var unit = 15;
var rows, columns;
var pause = false;

function setup() {
  createCanvas(windowWidth, $("#canvas").height()).parent("canvas");
  background(240);
  frameRate(10);
  rows = height / unit + 1;
  columns = width / unit + 1;
  for (let i = 0; i < rows; i++) {
    cells[i] = [];
    for (let j = 0; j < columns; j++) {
      cells[i][j] = new Cell(i, j);
    }
  }
  prepare();
}

function prepare() {
  for (let row of cells) {
    for (let cell of row) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i == 0 && j == 0)
            continue;
          let row = cell.rindex + i;
          let column = cell.cindex + j;
          if (row < 0 || row > rows - 1 || column < 0 || column > columns - 1)
            continue;
          cell.neighbours.push(cells[row][column]);
        }
      }
    }
  }
}

function draw() {
  if (!pause) {
    for (let row of cells) {
      for (let cell of row) {
        cell.update();
        cell.display();
      }
    }
  }
}

function mouseDragged() {
  let row = floor(mouseY / unit);
  let column = floor(mouseX / unit);
  cells[row][column].pressed();
}

function keyPressed() {
  if (keyCode == 32)
    pause = !pause;
}

class Cell {
  constructor(row, column) {
    this.rindex = row;
    this.cindex = column;
    this.rpos = row * unit;
    this.cpos = column * unit;
    this.dead = true;
    this.color = "#eeeeee";
    this.neighbours = [];
  }

  update() {
    let count = 0;
    for (let neighbour of this.neighbours) {
      if (!neighbour.dead)
        count++;
    }
    if (this.dead) {
      if (count == 3) {
        this.dead = false;
        this.color = "#ffb5a7";
      } else
        this.color = "#eeeeee";
    } else if (!this.dead) {
      if (count < 2 || count > 3) {
        this.dead = true;
        this.color = "#fec89a";
      } else
        this.color = "#fcd5ce";
    }
  }

  display() {
    stroke("#cecece");
    fill(this.color);
    rect(this.cpos, this.rpos, unit, unit);
  }

  pressed() {
    this.dead = false;
    this.color = "#ffb5a7";
    console.log(this);
  }
}
var cells = [];
var unit = 15;
var rows, columns;
var directions = ["top", "left", "right", "bottom"];
var current;
var route = [];
var pause = false;

function setup() {
  createCanvas($(window).width() - 300, $("#canvas").height()).parent("canvas");
  rows = floor(height / unit);
  columns = floor(width / unit);
  for (let i = 0; i < rows; i++) {
    cells[i] = [];
    for (let j = 0; j < columns; j++) {
      cells[i][j] = new Cell(i, j);
    }
  }
  current = cells[0][0];
  current.visited = true;
  prepare();
}

function prepare() {
  for (let row of cells) {
    for (let cell of row) {
      let count = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (abs(i + j) == 1) {
            let row = i + cell.rindex;
            let column = j + cell.cindex;
            let neighbour;
            if (row < 0 || row >= rows || column < 0 || column >= columns)
              neighbour = undefined;
            else
              neighbour = cells[row][column];
            cell.neighbours.push({
              direction: directions[count++],
              cell: neighbour
            });
          }
        }
      }
    }
  }
}

function draw() {
  if (!pause) {
    current.update();
    for (let row of cells) {
      for (let cell of row) {
        cell.display();
      }
    }
    fill(220);
    rect(current.cpos, current.rpos, unit, unit);
  }
}

function keyPressed() {
  if (keyCode === 32)
    pause = !pause;
}

class Cell {
  constructor(row, column) {
    this.rindex = row;
    this.cindex = column;
    this.rpos = row * unit;
    this.cpos = column * unit;
    this.walls = [{
        broken: false,
        index: [this.cpos, this.rpos, this.cpos + unit, this.rpos]
      },
      {
        broken: false,
        index: [this.cpos, this.rpos, this.cpos, this.rpos + unit]
      },
      {
        broken: false,
        index: [this.cpos + unit, this.rpos, this.cpos + unit, this.rpos + unit]
      },
      {
        broken: false,
        index: [this.cpos, this.rpos + unit, this.cpos + unit, this.rpos + unit]
      }
    ];
    this.neighbours = [];
    this.visited = false;
  }

  update() {
    let unvisited = [];
    for (let neighbour of this.neighbours) {
      if (neighbour.cell && !neighbour.cell.visited)
        unvisited.push(neighbour);
    }
    if (unvisited.length > 0) {
      let next = random(unvisited);
      let index = directions.indexOf(next.direction);
      this.walls[index].broken = true;
      next.cell.walls[3 - index].broken = true;
      current = next.cell;
      current.visited = true;
      route.push(current);
    } else if (route.length > 0)
      current = route.pop();
  }

  display() {
    stroke(150);
    for (let wall of this.walls) {
      if (!wall.broken)
        line(wall.index[0], wall.index[1], wall.index[2], wall.index[3]);
    }
    noStroke();
    fill(240);
    if (this.visited)
      fill(220);
    rect(this.cpos, this.rpos, unit, unit);
  }
}
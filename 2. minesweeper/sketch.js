var cells = [];
var unit = 25;
var rows, columns;
var count = 100;
var mines = [];
var won = false;
var font;

function preload() {
  font = loadFont("assets/inter.ttf");
}

function setup() {
  createCanvas(1000, 500).parent("canvas");
  background(240);
  $("canvas").contextmenu(e => e.preventDefault());
  $("#count").html(count);
  rows = height / unit;
  columns = width / unit;
  for (let i = 0; i < rows; i++) {
    cells[i] = [];
    for (let j = 0; j < columns; j++) {
      cells[i][j] = new Cell(i, j);
    }
  }
  prepare();
}

function prepare() {
  for (let i = 0; i < count; i++) {
    while (true) {
      let row = random(cells);
      let cell = random(row);
      if (!cell.mine) {
        cell.mine = true;
        mines.push(cell);
        break;
      }
    }
  }
  for (let row of cells) {
    for (let cell of row) {
      if (!cell.mine) {
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (i == 0 && j == 0)
              continue;
            let row = i + cell.rindex;
            let column = j + cell.cindex;
            if (row < 0 || row > rows - 1 || column < 0 || column > columns - 1)
              continue;
            else if (cells[row][column].mine)
              cell.count++;
            else
              cell.neighbours.push(cells[row][column]);
          }
        }
      }
    }
  }
}

class Cell {
  constructor(row, column) {
    this.rindex = row;
    this.rpos = row * unit;
    this.cindex = column;
    this.cpos = column * unit;
    this.mine = false;
    this.neighbours = [];
    this.count = 0;
    this.open = false;
    this.marked = false;
  }

  pressed(button) {
    if (!this.open) {
      if (button == "left" && !this.marked) {
        this.open = true;
        if (this.mine) {
          for (let row of cells) {
            for (let cell of row) {
              if (!cell.marked)
                cell.open = true;
            }
          }
          noLoop();
        } else if (this.count == 0)
          this.reveal();
      } else {
        if (!this.marked) {
          this.marked = true;
          count--;
          $("#count").html(count);
          if (count == 0) {
            won = true;
            for (let mine of mines) {
              if (!mine.marked)
                won = false;
            }
            if (won) {
              $("#status").html("GAME WON");
              noLoop();
            }
          }
        } else
          this.marked = false;
      }
    }
  }

  reveal() {
    for (let neighbour of this.neighbours) {
      if (neighbour.open)
        continue;
      neighbour.open = true;
      if (neighbour.count == 0 && neighbour.neighbours.length > 0)
        neighbour.reveal();
    }
  }
}

function draw() {
  for (let row of cells) {
    for (let cell of row) {
      stroke(200);
      fill(240);
      if (cell.marked)
        fill(200);
      rect(cell.cpos, cell.rpos, unit, unit);
      if (cell.mine && cell.open) {
        fill(255);
        rect(cell.cpos, cell.rpos, unit, unit);
        noStroke();
        fill(0);
        circle(cell.cpos + unit / 2, cell.rpos + unit / 2, unit / 2, unit / 2);
      } else if (!cell.mine && cell.open) {
        fill(255);
        rect(cell.cpos, cell.rpos, unit, unit);
        if (cell.count > 0) {
          fill(0);
          textFont(font);
          textAlign(CENTER, CENTER);
          text(cell.count, cell.cpos + unit / 2, cell.rpos + unit / 2);
        }
      }
    }
  }
}

function mousePressed() {
  let row = floor(mouseY / unit);
  let column = floor(mouseX / unit);
  cells[row][column].pressed(mouseButton);
}
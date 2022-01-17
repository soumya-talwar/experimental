var size = 500;
var unit = Math.floor(size / 3);
var squares = [];
var turns = 0;
var symbols = ["x", "o"];
var strike = [];
var results = ["i won! :D", "you won! :>", "phew! that was a close match :')"];
var over = false;

var font;

function preload() {
  font = loadFont("fonts/nunito.ttf");
}

function setup() {
  createCanvas(size, size).parent("canvas").mousePressed(pressed);
  for (let i = 0; i < 9; i++) {
    squares[i] = {
      row: floor(i / 3),
      column: i % 3,
      empty: true,
      player: undefined
    };
  }
  play(random(squares), "machine");
}

function analyse() {
  let best;
  let maximum = -Infinity;
  for (let i = 0; i < 9; i++) {
    if (squares[i].empty) {
      squares[i].empty = false;
      squares[i].player = "machine";
      let move = minimax(i, false);
      if (move[0] > maximum) {
        maximum = move[0];
        best = move[1];
      }
      squares[i].empty = true;
      squares[i].player = undefined;
    }
  }
  play(squares[best], "machine");
}

function minimax(index, turn) {
  let result = check();
  if (result == results[0])
    return [1, index];
  else if (result == results[1])
    return [-1, index];
  else if (result == results[2])
    return [0, index];
  else {
    let value = turn ? -Infinity : Infinity;
    for (let i = 0; i < 9; i++) {
      if (squares[i].empty) {
        squares[i].empty = false;
        squares[i].player = ["human", "machine"][Number(turn)];
        if (turn)
          value = max(value, minimax(i, !turn)[0]);
        else
          value = min(value, minimax(i, !turn)[0]);
        squares[i].empty = true;
        squares[i].player = undefined;
      }
    }
    return [value, index];
  }
}

function play(square, player) {
  textFont(font);
  textSize(unit);
  textAlign(CENTER, CENTER);
  text(symbols[turns % 2], square.column * unit + unit / 2, square.row * unit + unit / 4);
  square.empty = false;
  square.player = player;
  turns++;
  if (turns > 4) {
    let result = check();
    if (result) {
      $("#result").html(result);
      over = true;
      noLoop();
    }
  }
}

function check() {
  for (let i = 0; i < 3; i++) {
    let set = new Set([squares[i * 3].player, squares[i * 3 + 1].player, squares[i * 3 + 2].player]);
    if (set.size == 1 && !set.has(undefined)) {
      strike = [unit / 6, squares[i * 3].row * unit + unit / 2, size - unit / 6, squares[i * 3].row * unit + unit / 2];
      if (set.has("machine"))
        return results[0];
      else
        return results[1];
    }
  }
  for (let i = 0; i < 3; i++) {
    let set = new Set([squares[i].player, squares[3 + i].player, squares[6 + i].player]);
    if (set.size == 1 && !set.has(undefined)) {
      strike = [squares[i].column * unit + unit / 2, unit / 6, squares[i].column * unit + unit / 2, size - unit / 6];
      if (set.has("machine"))
        return results[0];
      else
        return results[1];
    }
  }
  let set = new Set([squares[0].player, squares[4].player, squares[8].player]);
  if (set.size == 1 && !set.has(undefined)) {
    strike = [unit / 4, unit / 4, size - unit / 4, size - unit / 4];
    if (set.has("machine"))
      return results[0];
    else
      return results[1];
  }
  set = new Set([squares[2].player, squares[4].player, squares[6].player]);
  if (set.size == 1 && !set.has(undefined)) {
    strike = [size - unit / 4, unit / 4, unit / 4, size - unit / 4];
    if (set.has("machine"))
      return results[0];
    else
      return results[1];
  }
  let tie = true;
  for (let square of squares) {
    if (square.empty)
      tie = false;
  }
  if (tie) {
    strike = [];
    return results[2];
  }
}

function pressed() {
  let row = floor(mouseY / unit);
  let column = floor(mouseX / unit);
  let square = squares[row * 3 + column];
  if (turns % 2 == 1 && square.empty && !over) {
    play(square, "human");
    setTimeout(() => analyse(), 500);
  }
}

function draw() {
  strokeWeight(6);
  line(0, unit, size, unit);
  line(0, unit * 2, size, unit * 2);
  line(unit, 0, unit, size);
  line(unit * 2, 0, unit * 2, size);
  if (over) {
    strokeWeight(8);
    line(strike[0], strike[1], strike[2], strike[3]);
  }
}
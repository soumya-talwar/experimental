var size = 500;
var unit = Math.floor(size / 3);
var squares = [];
var empty = [];
var symbol = ["x", "o"];
var turns = 0;
var results = ["i won! :D", "you won! :>", "phew! that was a close match"];
var over = false;
var strike = [];
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
    empty.push(squares[i]);
  }
  play(random(empty), "machine");
}

function play(square, player) {
  textFont(font);
  textSize(unit);
  textAlign(CENTER, CENTER);
  text(symbol[turns % 2], square.column * unit + unit / 2, square.row * unit + unit / 4);
  square.empty = false;
  square.player = player;
  empty.splice(empty.findIndex(element => element.row == square.row && element.column == square.column), 1);
  turns++;
  if (turns > 4) {
    result = check();
    if (result) {
      $("#result").html(result);
      over = true;
    }
  }
}

function check() {
  for (let i = 0; i < 3; i++) {
    let set = new Set([squares[i * 3].player, squares[i * 3 + 1].player, squares[i * 3 + 2].player]);
    if (set.size == 1 && !set.has(undefined)) {
      strike = [0, squares[i * 3].row * unit + unit / 2, size, squares[i * 3].row * unit + unit / 2];
      if (set.has("machine"))
        return (results[0]);
      else
        return (results[1]);
    }
  }
  for (let i = 0; i < 3; i++) {
    let set = new Set([squares[i].player, squares[3 + i].player, squares[6 + i].player]);
    if (set.size == 1 && !set.has(undefined)) {
      strike = [squares[i].column * unit + unit / 2, 0, squares[i].column * unit + unit / 2, size];
      if (set.has("machine"))
        return (results[0]);
      else
        return (results[1]);
    }
  }
  let set = new Set([squares[0].player, squares[4].player, squares[8].player]);
  if (set.size == 1 && !set.has(undefined)) {
    strike = [0, 0, size, size];
    if (set.has("machine"))
      return (results[0]);
    else
      return (results[1]);
  }
  set = new Set([squares[2].player, squares[4].player, squares[6].player]);
  if (set.size == 1 && !set.has(undefined)) {
    strike = [size, 0, 0, size];
    if (set.has("machine"))
      return (results[0]);
    else
      return (results[1]);
  }
  if (empty.length == 0) {
    return (results[2]);
  }
}

function draw() {
  line(unit, 0, unit, size);
  line(unit * 2, 0, unit * 2, size);
  line(0, unit, size, unit);
  line(0, unit * 2, size, unit * 2);
  if (over && strike.length > 0) {
    strokeWeight(8);
    line(strike[0], strike[1], strike[2], strike[3]);
    noLoop();
  }
}

function pressed() {
  let row = floor(mouseY / unit);
  let column = floor(mouseX / unit);
  let square = squares[row * 3 + column];
  if (turns % 2 == 1 && square.empty && !over) {
    play(square, "player");
    if (empty.length > 0 && !over)
      setTimeout(() => play(random(empty), "machine"), 500);
  }
}
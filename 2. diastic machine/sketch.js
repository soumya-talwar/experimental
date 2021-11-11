var text;
var words = [];

function preload() {
  text = loadStrings("text.txt");
}

function setup() {
  text = text.join(" ").toLowerCase();
  words = text.split(/[\s.,;:?!"\-—\d()]+/g);
  let seed = select("#seed");
  let submit = select("#submit");
  submit.mousePressed(() => {
    let phrase = "";
    let index = 0;
    for (let i = 0; i < seed.value().length; i++) {
      for (let j = index; j < words.length; j++) {
        let word = words[j];
        if (word.charAt(i) === seed.value().charAt(i)) {
          phrase += word + " ";
          index = j + 1;
          break;
        }
      }
    }
    createP(phrase).parent("page");
  });
}
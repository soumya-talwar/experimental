function setup() {
  let upload = createFileInput(file => analyse(file.data)).parent("#upload");
  let zone = select("#dropzone");
  zone.dragOver(() => zone.addClass("border-dark"));
  zone.dragLeave(() => zone.removeClass("border-dark"));
  zone.drop(file => {
    if (file.type == "text") {
      let byte = 0;
      let size = file.size;
      while (size / 1000 >= 1) {
        size = floor(size / 1000);
        byte++;
      }
      let types = ["bytes", "KB", "MB", "GB", "TB"];
      size += types[byte];
      zone.html(file.name + " / " + size);
      analyse(file.data);
    } else
      zone.html("sorry! only text files are accepted!");
  });
}

function analyse(data) {
  let words = splitTokens(data, /\W/);
  let vowels = ["a", "e", "i", "o", "u"];
  let syllables = 0;
  for (word of words) {
    let prev = false;
    for (let i = 0; i < word.length; i++) {
      let letter = word.charAt(i).toLowerCase();
      if (vowels.indexOf(letter) != -1) {
        if (!prev) {
          if (letter == 'e' && i == word.length - 1)
            break;
          syllables++;
        }
        prev = true;
      } else
        prev = false;
    }
  }
  let sentences = splitTokens(data, ".:;?!");
  let flesch = 206.835 - (84.6 * syllables / words.length) - (1.015 * words.length / sentences.length);
  let test = selectAll(".result");
  test[0].html(syllables);
  test[1].html(words.length);
  test[2].html(sentences.length);
  test[3].html(flesch);
}
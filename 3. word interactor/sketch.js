function setup() {
  let input = select("textarea");
  let submit = select("#submit");
  submit.mousePressed(() => {
    let text = input.value();
    let words = text.split(/(\W+)/g);
    for (word of words) {
      let span = createSpan(word).parent("#output");
      if (!/\W+/.test(word))
        span.mouseOver(function() {
          this.html("mango");
          this.style("background-color", color(random(200, 255), random(100, 255), random(0, 50)));
        })
    }
  });
}
var frame = 0;
var mic;

var bird = {};
var obstacles = [];

var start = false;
var score = 0;

var img;

var speed = window.innerWidth < 768 ? 3 : 4;

var baseScale = 1;
var mobileScaleBoost = 1;
var birdScale = 1;

function s(val) {
	return val * baseScale * mobileScaleBoost;
}

function getCanvasSize() {
	let isMobile = window.innerWidth < 768;
	let w, h;
	if (isMobile) {
		w = window.innerWidth * 0.95;
		h = window.innerHeight * 0.6;
	} else {
		w = Math.min(1000, window.innerWidth * 0.9);
		h = 500 * (w / 1000);
	}
	return { w, h };
}

function updateLayout() {
	let isMobile = window.innerWidth < 768;
	mobileScaleBoost = isMobile ? 1.6 : 1;
	birdScale = isMobile ? 1.7 : 1;
}

function updateScale() {
	baseScale = width / 1000;
}

function preload() {
	img = loadImage("images/bird.png");
}

function initBird() {
	bird = {
		left: width * 0.1,
		top: height / 2,
		velocity: 0,
		gravity: s(0.6),
		flight: s(10),
	};
}

function setup() {
	let { w, h } = getCanvasSize();
	createCanvas(w, h).parent("#canvas");
	updateLayout();
	updateScale();
	initBird();
	$("#start").click(() => {
		mic = new p5.AudioIn();
		mic.start();
		getAudioContext().resume();
		$("#start").removeClass("clickable").html("SCORE: ");
		start = true;
		frame = 0;
		score = 0;
		obstacles = [];
		initBird();
	});
}

function draw() {
	if (!start) return;
	let volume = mic.getLevel();
	let threshold = window.innerWidth < 768 ? 0.05 : 0.05;
	background("#C8F2EF");
	for (let i = obstacles.length - 1; i >= 0; i--) {
		let obs = obstacles[i];
		for (let j = 0; j < 2; j++) {
			let o = obs[j];
			fill("#95CD41");
			stroke(0);
			strokeWeight(3);
			rect(o.left, o.top, s(100), o.bottom - o.top);
			let birdW = s(40) * birdScale;
			let birdH = s(32) * birdScale;
			if (
				!(bird.left < o.left && bird.left + birdW < o.left) &&
				!(bird.left > o.left + s(100) && bird.left + birdW > o.left + s(100))
			) {
				if (j == 0 && bird.top < o.bottom) reset();
				if (j == 1 && bird.top + birdH > o.top) reset();
			}
			o.left -= speed;
		}
		if (obs[0].left + s(100) < 0) {
			obstacles.splice(i, 1);
		}
	}
	if (frame % 100 == 0) {
		let gap = random(s(250), height / 2);
		let point = random(gap / 2 + s(50), height - gap / 2 - s(50));
		obstacles.push([
			{
				left: width + s(100),
				top: 0,
				bottom: constrain(point - gap / 2, 0, height),
			},
			{
				left: width + s(100),
				top: constrain(point + gap / 2, 0, height),
				bottom: height,
			},
		]);
	}
	if (frame % 5 == 0) {
		score++;
		$("#score").html(score);
	}
	if (volume > threshold) {
		bird.velocity -= bird.flight;
	}
	bird.top += bird.velocity;
	bird.velocity += bird.gravity;
	bird.velocity = constrain(bird.velocity, -s(8), s(8));
	let birdH = s(32) * birdScale;
	if (bird.top > height - birdH) {
		bird.top = height - birdH;
		bird.velocity = 0;
	}
	if (bird.top < 0) {
		bird.top = 0;
		bird.velocity = 0;
	}
	image(img, bird.left, bird.top, s(40) * birdScale, s(32) * birdScale);
	frame++;
}

function reset() {
	obstacles = [];
	score = 0;
	frame = 0;
	initBird();
}

function windowResized() {
	let { w, h } = getCanvasSize();
	resizeCanvas(w, h);
	updateLayout();
	updateScale();
	initBird();
}

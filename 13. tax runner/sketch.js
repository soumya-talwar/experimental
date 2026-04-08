var frame = 0;
var speed = window.innerWidth < 768 ? 5.5 : 7;

var dino1, dino2, dino3, tax, cloud;

var dino = {};
var taxes = [];
var clouds = [];

var stop = false;

var groundYRatio = 5 / 7;
var baseScale = 1;
var mobileScaleBoost = 1;

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
	if (isMobile) {
		groundYRatio = 0.78;
		mobileScaleBoost = 1.9;
	} else {
		groundYRatio = 5 / 7;
		mobileScaleBoost = 1;
	}
	let instruction = isMobile
		? "tap to evade taxes / avoid being sent to the income tax filing site"
		: "press space to evade taxes / avoid being sent to the income tax filing site";
	$("#result").text(instruction);
}

function updateScale() {
	baseScale = width / 1000;
}

function preload() {
	dino1 = loadImage("images/dino 1.png");
	dino2 = loadImage("images/dino 2.png");
	dino3 = loadImage("images/dino 3.png");
	tax = loadImage("images/tax.png");
	cloud = loadImage("images/cloud.png");
}

function initDino() {
	let isMobile = window.innerWidth < 768;

	dino = {
		left: width * 0.05,
		top: height * groundYRatio - s(80),
		velocity: 0,
		gravity: 0,
		jump: isMobile ? s(17) : s(14),
		flying: false,
		current: 0,
		versions: [dino1, dino2, dino3],
	};
}

function setup() {
	let { w, h } = getCanvasSize();
	createCanvas(w, h).parent("#canvas");
	updateLayout();
	updateScale();
	initDino();
}

function draw() {
	if (!stop) {
		background("#F7F7F7");
		stroke("#535353");
		line(0, height * groundYRatio, width, height * groundYRatio);
		if (frame % 4 == 0) dino.current = Number(!Boolean(dino.current));
		for (let i = clouds.length - 1; i >= 0; i--) {
			image(cloud, clouds[i].left, clouds[i].top, s(120), s(35));
			clouds[i].left -= speed;
			if (clouds[i].left + s(100) < 0) clouds.splice(i, 1);
		}
		let spawnRate = window.innerWidth < 768 ? 80 : 100;
		for (let i = taxes.length - 1; i >= 0; i--) {
			let dinoW = s(74);
			let dinoH = s(80);
			let taxW = window.innerWidth < 768 ? s(60) : s(50);
			let taxH = window.innerWidth < 768 ? s(50) : s(44);
			image(tax, taxes[i].left, taxes[i].top, taxW, taxH);
			if (
				!(dino.left < taxes[i].left && dino.left + dinoW < taxes[i].left) &&
				!(
					dino.left > taxes[i].left + taxW &&
					dino.left + dinoW > taxes[i].left + taxW
				)
			) {
				if (dino.top + dinoH > taxes[i].top) {
					stop = true;
					dino.current = 2;
					// setTimeout(() => {
					// 	window.location.href = "https://www.incometax.gov.in/";
					// }, 500);
				}
			}
			taxes[i].left -= speed;
			if (taxes[i].left + taxW < 0) taxes.splice(i, 1);
		}
		if (frame % spawnRate == 0) {
			taxes.push({
				left: width + randomGaussian(map(speed, 15, 40, 30, 120), 30),
				top: height * groundYRatio - s(50),
			});
			speed = constrain(speed + 0.5, 0, 40);
		}
		if (frame % 70 == 0) {
			clouds.push({
				left: width + randomGaussian(map(speed, 15, 40, 30, 100), 50),
				top: random(height * 0.1, height * 0.5),
			});
		}
		image(dino.versions[dino.current], dino.left, dino.top, s(74), s(80));
		dino.top += dino.velocity;
		dino.velocity += dino.gravity;
		let groundLevel = height * groundYRatio - s(80);
		if (dino.top >= groundLevel) {
			dino.top = groundLevel;
			dino.gravity = 0;
			dino.velocity = 0;
			dino.flying = false;
		}
		frame++;
		$("#score").html(frame);
	}
}

function performJump() {
	if (!dino.flying) {
		dino.velocity -= dino.jump;
		dino.gravity = 1;
		dino.flying = true;
	}
}

function keyPressed() {
	if (keyCode == 32) performJump();
}

function touchStarted() {
	performJump();
	return false;
}

function windowResized() {
	let { w, h } = getCanvasSize();
	resizeCanvas(w, h);
	updateLayout();
	updateScale();
	initDino();
}

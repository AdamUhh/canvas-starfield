const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// linearly maps value from the range (a..b) to (c..d)
function mapRange(value, a, b, c, d) {
  // first map value from (a..b) to (0..1)
  value = (value - a) / (b - a);
  // then map it from (0..1) to (c..d) and return it
  return c + value * (d - c);
  // ? ex: (1000,0,1500,1,40),
  // ? if a value is 1000, and the start/stop range is 0 to 1500,
  // ? convert that range to 1 to 40
  // ? perhaps a more intuitive example would be the 'mousemove' eventlistener below
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.random() * (max - min + 1) + min;
}

const stars = [];
let speed;
window.addEventListener("mousemove", (evt) => {
  var rect = canvas.getBoundingClientRect();

  let mouseX = ((evt.clientX - rect.left) / (rect.right - rect.left)) * canvas.width;
  speed = mapRange(mouseX, 0, canvas.width, 1, 40);
});

class Star {
  constructor() {
    this.x = getRandomInt(-canvas.width / 2, canvas.width / 2);
    this.y = getRandomInt(-canvas.height, canvas.height);
    this.z = Math.random() * canvas.width;
    this.px;
    this.py;
    this.pz = this.z;
    this.sx;
    this.sy;
    this.radius;
  }

  update() {
    this.z -= speed || 1;
    if (this.z < 1) {
      this.z = canvas.width;
      this.x = getRandomInt(-canvas.width, canvas.width);
      this.y = getRandomInt(-canvas.height, canvas.height);
      this.pz = this.z;
    }
    this.sx = mapRange(this.x / this.z, 0, 1, 0, canvas.width);
    this.sy = mapRange(this.y / this.z, 0, 1, 0, canvas.height);
    this.radius = mapRange(this.z, 0, canvas.width, 9, 0);

    this.px = mapRange(this.x / this.pz, 0, 1, 0, canvas.width);
    this.py = mapRange(this.y / this.pz, 0, 1, 0, canvas.height);
    this.pz = this.z;

    this.draw();
  }

  draw() {
    ctx.save();

    ctx.beginPath();
    ctx.translate(canvas.width / 2, canvas.height / 2); 

    // ? create a circle infront of line stroke
    // ctx.arc(this.sx, this.sy, this.radius, 0, Math.PI * 2, false);
    // ctx.fillStyle = "white";
    // ctx.fill();

    ctx.moveTo(this.px, this.py);
    ctx.lineTo(this.sx, this.sy);
    ctx.strokeStyle = "white";
    ctx.stroke();

    ctx.font = "30px Arial";
    ctx.fillText(`speed: ${speed ? speed : 1}`, -canvas.width / 2 + 20, -canvas.height / 2 + 40);

    ctx.restore();
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < stars.length; i++) {
    stars[i].update();
  }
  requestAnimationFrame(animate);
}

function init() {
  for (let i = 0; i < 400; i++) {
    stars.push(new Star());
  }
}

init();
animate();

const canvas = document.getElementById("gameCanvas");
const ctx    = canvas.getContext("2d");
canvas.width  = 800;
canvas.height = 500 ;

// --- load images ---
const dinoImg = new Image();
dinoImg.src   = "dino.png";

const treeImg = new Image();
treeImg.src   = "tree.png";

const rockImg = new Image();
rockImg.src   = "rock.png";

// --- game state ---
let dinosaur = {
  x: 50,           y: 300,
  width: 40,       height: 40,
  speedY: 0,
  gravity: 0.6,
  jumpPower: -12,
  jumpCount: 0,
  maxJumps: 6
};

let obstacles = [];     // will hold both trees & rocks
let treeSpeed   = 5;
let score       = 0;

// --- input handling (double-jump) ---
window.addEventListener("keydown", e => {
  if (e.code === "Space" && dinosaur.jumpCount < dinosaur.maxJumps) {
    e.preventDefault();                     // stop scrolling
    dinosaur.speedY   = dinosaur.jumpPower;
    dinosaur.jumpCount++;
  }
});

// --- main loop ---
function update() {
  // 1) physics
  dinosaur.y      += dinosaur.speedY;
  dinosaur.speedY += dinosaur.gravity;

  // land on ground?
  if (dinosaur.y > 450) {
    dinosaur.y        = 450;
    dinosaur.speedY   = 0;
    dinosaur.jumpCount = 0;
  }

  // 2) spawn obstacles randomly
  if (Math.random() < 0.02) {
    // decide tree vs rock
    let type = Math.random() < 0.6 ? "tree" : "rock";
    let h    = (type === "tree")
               ? Math.random() * 40 + 40     // taller
               : Math.random() * 20 + 20;    // shorter rock

    obstacles.push({
      x: canvas.width,
      y: 450 - h,
      width: h,         // make width = height for simplicity
      height: h,
      type
    });
  }

  // 3) move, collide & score
  obstacles = obstacles.filter(o => {
    o.x -= treeSpeed;

    // collision?
    if (
      dinosaur.x + dinosaur.width  > o.x &&
      dinosaur.x                  < o.x + o.width &&
      dinosaur.y + dinosaur.height > o.y
    ) {
      alert("Game Over! Score: " + score);
      score = 0;
      obstacles = [];
      return false;
    }

    // off-screen → score
    if (o.x + o.width < 0) {
      score++;
      return false;
    }

    return true;
  });

  // 4) draw frame
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw dino
  ctx.drawImage(
    dinoImg,
    dinosaur.x,
    dinosaur.y - dinosaur.height,  // align bottom
    dinosaur.width,
    dinosaur.height
  );

  // draw obstacles
  obstacles.forEach(o => {
    let img = o.type === "tree" ? treeImg : rockImg;
    ctx.drawImage(img, o.x, o.y, o.width, o.height);
  });

  // draw score
  ctx.fillStyle = "black";
  ctx.font      = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);

  requestAnimationFrame(update);
}

// wait for everything (including images) to load
window.onload = update;

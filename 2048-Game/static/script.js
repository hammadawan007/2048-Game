const gridSize = 4;
let grid = [];
let score = 0;

const container = document.getElementById("game-container");
const scoreElement = document.getElementById("score");

function initGame() {
  grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
  addNewTile();
  addNewTile();
  updateUI();
}

function addNewTile() {
  let emptyCells = [];
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (grid[r][c] === 0) emptyCells.push([r, c]);
    }
  }
  if (emptyCells.length === 0) return;
  const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  grid[row][col] = Math.random() < 0.9 ? 2 : 4;
}

function updateUI() {
  container.innerHTML = "";
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      const val = grid[r][c];
      if (val !== 0) {
        tile.textContent = val;
        tile.classList.add(`tile-${val}`);
      }
      container.appendChild(tile);
    }
  }
  scoreElement.textContent = score;
}

function slide(row) {
  let newRow = row.filter(val => val);
  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      score += newRow[i];
      newRow[i + 1] = 0;
    }
  }
  return newRow.filter(val => val).concat(Array(gridSize - newRow.filter(val => val).length).fill(0));
}

function rotateGrid(clockwise = true) {
  const newGrid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (clockwise) {
        newGrid[c][gridSize - 1 - r] = grid[r][c];
      } else {
        newGrid[gridSize - 1 - c][r] = grid[r][c];
      }
    }
  }
  grid = newGrid;
}

function moveLeft() {
  let moved = false;
  for (let r = 0; r < gridSize; r++) {
    const newRow = slide(grid[r]);
    if (grid[r].toString() !== newRow.toString()) moved = true;
    grid[r] = newRow;
  }
  if (moved) {
    addNewTile();
    updateUI();
  }
}

function moveRight() {
  grid = grid.map(row => row.reverse());
  moveLeft();
  grid = grid.map(row => row.reverse());
}

function moveUp() {
  rotateGrid();
  moveLeft();
  rotateGrid(false);
}

function moveDown() {
  rotateGrid();
  moveRight();
  rotateGrid(false);
}

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowLeft": moveLeft(); break;
    case "ArrowRight": moveRight(); break;
    case "ArrowUp": moveUp(); break;
    case "ArrowDown": moveDown(); break;
  }
});
function updateHighScore() {
  if (score > highScoreValue) {
    fetch(`/update_score/${score}`, {
      method: 'POST'
    });
    document.getElementById("high-score").textContent = score;
  }
}

// Call after move if new score is higher
function moveLeft() {
  let moved = false;
  for (let r = 0; r < gridSize; r++) {
    const newRow = slide(grid[r]);
    if (grid[r].toString() !== newRow.toString()) moved = true;
    grid[r] = newRow;
  }
  if (moved) {
    addNewTile();
    updateUI();
    updateHighScore();  // ← Add here
  }
}

// Same for moveRight, moveUp, moveDown...


initGame();

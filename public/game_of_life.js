// Based on https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life

const canvas = document.querySelector(".gol-background");
const ctx = canvas.getContext("2d", {
    antialias: false,
});

const CELLS_IN_ROW = 100;
const GENERATION_LENGTH = 80; // in ms
const CELL_SIZE = Math.ceil(window.innerWidth / CELLS_IN_ROW);
const CELLS_IN_COLUMN = Math.ceil(window.innerHeight / CELL_SIZE);
const INITIAL_ALIVE_CHANCE = 0.13;

// true = cell alive, false = cell dead
let currGenCells = [];
let nextGenCells = [];

function setup() {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    for (let i = 0; i < CELLS_IN_COLUMN; i++) {
        currGenCells.push([]);
        nextGenCells.push([]);
        for (let j = 0; j < CELLS_IN_ROW; j++) {
            if (Math.random() <= INITIAL_ALIVE_CHANCE) {
                currGenCells[i].push(true);
            } else {
                currGenCells[i].push(false);
            }
            nextGenCells[i].push(false);
        }
    }
}

function updateState() {
    for (let i = 0; i < currGenCells.length; i++) {
        for (let j = 0; j < currGenCells[i].length; j++) {
            const activeNeighbours = numberOfActiveNeighbours(j, i);

            if (activeNeighbours == 2) {
                nextGenCells[i][j] = currGenCells[i][j];
            } else if (activeNeighbours == 3) {
                nextGenCells[i][j] = true;
            } else {
                nextGenCells[i][j] = false;
            }
        }
    }

    for (let i = 0; i < nextGenCells.length; i++) {
        for (let j = 0; j < nextGenCells[i].length; j++) {
            currGenCells[i][j] = nextGenCells[i][j];
        }
    }
}

function numberOfActiveNeighbours(x, y) {
    let neighbourCount = 0;

    if (x > 0 && y > 0) {
        if (currGenCells[y - 1][x - 1]) {
            neighbourCount++;
        }
    }

    if (x > 0) {
        if (currGenCells[y][x - 1]) {
            neighbourCount++;
        }
    }

    if (y > 0) {
        if (currGenCells[y - 1][x]) {
            neighbourCount++;
        }
    }

    if (x < CELLS_IN_ROW - 1 && y < CELLS_IN_COLUMN - 1) {
        if (currGenCells[y + 1][x + 1]) {
            neighbourCount++;
        }
    }

    if (x < CELLS_IN_ROW - 1) {
        if (currGenCells[y][x + 1]) {
            neighbourCount++;
        }
    }

    if (y < CELLS_IN_COLUMN - 1) {
        if (currGenCells[y + 1][x]) {
            neighbourCount++;
        }
    }

    if (x > 0 && y < CELLS_IN_COLUMN - 1) {
        if (currGenCells[y + 1][x - 1]) {
            neighbourCount++;
        }
    }

    if (x < CELLS_IN_ROW - 1 && y > 0) {
        if (currGenCells[y - 1][x + 1]) {
            neighbourCount++;
        }
    }
    return neighbourCount;
}

function draw() {
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0,0,0,0.01)";
    ctx.fill();
    ctx.fillStyle = "#fff";
    for (let i = 0; i < currGenCells.length; i++) {
        for (let j = 0; j < currGenCells[i].length; j++) {
            if (currGenCells[i][j]) {
                ctx.fillRect(
                    j * CELL_SIZE,
                    i * CELL_SIZE,
                    CELL_SIZE,
                    CELL_SIZE
                );
            }
        }
    }
}

function startAnimation() {
    draw();
    setInterval(() => {
        updateState();
        draw();
    }, GENERATION_LENGTH);
}

setup();

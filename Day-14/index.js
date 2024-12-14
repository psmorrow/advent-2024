const fs = require("fs");

const BLANK_MARKER = ".";
const GRID_SIZE_X = 101; // sample = 11;
const GRID_SIZE_Y = 103; // sample = 7;
const CHECK_IN_SECONDS = 100;
const CHECK_FOR_CHRISTMAS_TREE_MAX_SECONDS = 10_000;

function parseLine(line) {
  const pattern = /p=(-?\d+,-?\d+)\s+v=(-?\d+,-?\d+)/;
  const [, p, v] = line.match(pattern);

  return {
    p: p.split(",").map(Number),
    v: v.split(",").map(Number),
  };
}

function moveRobotsOneSecond(data) {
  return data.map(({ p, v }) => {
    const [x, y] = p;
    const [vx, vy] = v;

    let newX = x + vx;
    let newY = y + vy;
    while (newX < 0 || newY < 0 || newX >= GRID_SIZE_X || newY >= GRID_SIZE_Y) {
      if (newX < 0) {
        newX = GRID_SIZE_X + newX;
      } else if (newX >= GRID_SIZE_X) {
        newX = newX - GRID_SIZE_X;
      }
      if (newY < 0) {
        newY = GRID_SIZE_Y + newY;
      } else if (newY >= GRID_SIZE_Y) {
        newY = newY - GRID_SIZE_Y;
      }
    }

    return { p: [newX, newY], v };
  });
}

function placeRobotsOnGrid(data) {
  const grid = Array.from({ length: GRID_SIZE_Y }, () =>
    Array.from({ length: GRID_SIZE_X }, () => BLANK_MARKER)
  );

  for (const { p } of data) {
    const [x, y] = p;
    if (grid[y][x] === BLANK_MARKER) {
      grid[y][x] = 1;
    } else {
      grid[y][x]++;
    }
  }

  return grid;
}

function moveRobots(data, seconds) {
  for (let i = 0; i < seconds; i++) {
    data = moveRobotsOneSecond(data);
  }

  return placeRobotsOnGrid(data);
}

function calculateSafetyFactor(grid) {
  let quadrant1 = 0;
  let quadrant2 = 0;
  let quadrant3 = 0;
  let quadrant4 = 0;

  const middleX = Math.floor(GRID_SIZE_X / 2);
  const middleY = Math.floor(GRID_SIZE_Y / 2);
  for (let y = 0; y < GRID_SIZE_Y; y++) {
    for (let x = 0; x < GRID_SIZE_X; x++) {
      if (x === middleX || y === middleY || grid[y][x] === BLANK_MARKER) {
        continue;
      }

      if (x < middleX && y < middleY) {
        quadrant1 += grid[y][x];
      } else if (x > middleX && y < middleY) {
        quadrant2 += grid[y][x];
      } else if (x < middleX && y > middleY) {
        quadrant3 += grid[y][x];
      } else if (x > middleX && y > middleY) {
        quadrant4 += grid[y][x];
      }
    }
  }

  return quadrant1 * quadrant2 * quadrant3 * quadrant4;
}

function checkGridForChristmasTreePattern(grid) {
  for (let y = 0; y < GRID_SIZE_Y; y++) {
    for (let x = 0; x < GRID_SIZE_X; x++) {
      if (grid[y][x] === BLANK_MARKER) {
        continue;
      }

      try {
        const isChristmasTree =
          Number.isInteger(grid[y][x]) &&
          Number.isInteger(grid[y + 1][x - 1]) &&
          Number.isInteger(grid[y + 1][x + 1]) &&
          Number.isInteger(grid[y + 2][x - 2]) &&
          Number.isInteger(grid[y + 2][x + 2]) &&
          Number.isInteger(grid[y + 3][x - 3]) &&
          Number.isInteger(grid[y + 3][x + 3]) &&
          Number.isInteger(grid[y + 4][x - 4]) &&
          Number.isInteger(grid[y + 4][x + 4]) &&
          Number.isInteger(grid[y + 5][x - 5]) &&
          Number.isInteger(grid[y + 5][x + 5]);

        if (isChristmasTree) {
          return true;
        }
      } catch (e) {
        // handle indexing out of bounds
        continue;
      }
    }
  }

  return false;
}

function findChristmasTreePattern(data) {
  let foundInSeconds = 0;

  while (foundInSeconds++ < CHECK_FOR_CHRISTMAS_TREE_MAX_SECONDS) {
    data = moveRobotsOneSecond(data);
    const grid = placeRobotsOnGrid(data);
    if (checkGridForChristmasTreePattern(grid)) {
      return foundInSeconds;
    }
  }

  return -1;
}

// read the input file

const input = fs.readFileSync("input.txt", "utf-8").trim().split("\n");

// process input

const data = input.map(parseLine);
const grid = moveRobots(data, CHECK_IN_SECONDS);
const safetyFactor = calculateSafetyFactor(grid);

const seconds = findChristmasTreePattern(data);

// print the result

console.log(`Safety factor: ${safetyFactor}`);
console.log(`Found Christmas tree in X seconds: ${seconds}`);

const fs = require("fs");

function findTrailheads(input) {
  let trailheads = [];
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      if (input[y][x] === 0) {
        trailheads.push([y, x]);
      }
    }
  }
  return trailheads;
}

function findAllPaths(input, trailhead, allowMultiplePathsTo9) {
  const paths = [];

  const [y, x] = trailhead;
  const beginStep = `${y},${x}`;
  const path = [beginStep];

  const endSteps = new Set(); // only allow a single path to each end step unless allowMultiplePathsTo9 is true

  function findPath(y, x) {
    if (input[y][x] === 9) {
      const stepEnd = `${y},${x}`;
      if (allowMultiplePathsTo9 || !endSteps.has(stepEnd)) {
        endSteps.add(stepEnd);
        paths.push(path);
      }
      return;
    }

    const moves = [
      [y - 1, x],
      [y + 1, x],
      [y, x - 1],
      [y, x + 1],
    ];

    for (const [ny, nx] of moves) {
      if (ny < 0 || ny >= input.length || nx < 0 || nx >= input[ny].length) {
        continue;
      }

      const nStep = `${ny},${nx}`;

      if (path.includes(nStep)) {
        continue;
      }

      if (input[ny][nx] === input[y][x] + 1) {
        path.push(nStep);
        findPath(ny, nx);
        path.pop();
      }
    }
  }

  findPath(y, x);

  return paths;
}

// read the input file

const input = fs
  .readFileSync("input.txt", "utf-8")
  .trim()
  .split("\n")
  .map(line => line.split(""))
  .map(line => line.map(Number));

// process the input

const trailheads = findTrailheads(input);

let totalScore = 0;
for (let i = 0; i < trailheads.length; i++) {
  const paths = findAllPaths(input, trailheads[i], false);
  totalScore += paths.length;
}

let totalRating = 0;
for (let i = 0; i < trailheads.length; i++) {
  const paths = findAllPaths(input, trailheads[i], true);
  totalRating += paths.length;
}

// print the result

console.log(`Total score: ${totalScore}`);
console.log(`Total rating: ${totalRating}`);

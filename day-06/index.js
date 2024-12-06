const fs = require("fs");

const EMPTY_MARKER = ".";
const OBSTACLE_MARKER = "#";
const VISITED_MARKER = "X";

function isGuard(char) {
  switch (char) {
    case "^":
      return "up";
    case "v":
      return "down";
    case "<":
      return "left";
    case ">":
      return "right";
    default:
      return null;
  }
}

function findGuard(input) {
  let guard = {
    x: 0,
    y: 0,
    direction: "down",
    visited: 0,
    distinct: 0,
    points: new Map(),
  };

  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      const direction = isGuard(input[i][j]);
      if (direction !== null) {
        input[i][j] = VISITED_MARKER;
        guard.x = j;
        guard.y = i;
        guard.direction = direction;
        guard.visited++;
        guard.distinct++;
        addPoint(guard);
        return guard;
      }
    }
  }

  return null;
}

function addPoint(guard) {
  const key = `${guard.x},${guard.y},${guard.direction}`;
  const value = guard.points.get(key) ?? 0;

  if (value === 1) {
    throw new Error("Guard is in a loop");
  }

  guard.points.set(key, value + 1);
}

function isGuardDone(guard, input) {
  const x = guard.x;
  const y = guard.y;

  return (
    x === 0 || y === 0 || x === input[0].length - 1 || y === input.length - 1
  );
}

function canGuardMove(guard, input) {
  let x = guard.x;
  let y = guard.y;
  let direction = guard.direction;

  switch (direction) {
    case "up":
      return y > 0 && input[y - 1][x] !== OBSTACLE_MARKER;
    case "down":
      return y < input.length - 1 && input[y + 1][x] !== OBSTACLE_MARKER;
    case "left":
      return x > 0 && input[y][x - 1] !== OBSTACLE_MARKER;
    case "right":
      return x < input[y].length - 1 && input[y][x + 1] !== OBSTACLE_MARKER;
  }
  return false;
}

function moveGuardForward(guard, input) {
  switch (guard.direction) {
    case "up":
      guard.y--;
      break;
    case "down":
      guard.y++;
      break;
    case "left":
      guard.x--;
      break;
    case "right":
      guard.x++;
      break;
  }
  addPoint(guard);

  guard.visited++;
  if (input[guard.y][guard.x] === EMPTY_MARKER) {
    input[guard.y][guard.x] = VISITED_MARKER;
    guard.distinct++;
  }
}

function rotateGuardRight(guard) {
  switch (guard.direction) {
    case "up":
      guard.direction = "right";
      break;
    case "down":
      guard.direction = "left";
      break;
    case "left":
      guard.direction = "up";
      break;
    case "right":
      guard.direction = "down";
      break;
  }
}

function moveGuard(guard, input) {
  while (!isGuardDone(guard, input)) {
    if (canGuardMove(guard, input)) {
      moveGuardForward(guard, input);
    } else {
      rotateGuardRight(guard);
    }
  }
}

// read file as 2d array

const input = fs
  .readFileSync("input.txt", "utf-8")
  .trim()
  .split("\n")
  .map(line => line.split(""));

// find and move the guard

const inputPart1 = input.map(row => row.slice());
let guardPart1 = findGuard(inputPart1);
if (guardPart1 === null) {
  console.log("Guard not found");
  process.exit(1);
}

try {
  moveGuard(guardPart1, inputPart1);
} catch (e) {
  console.log("Guard is in a loop");
}

// print the number of positions visited including distinct

console.log(`Visited: ${guardPart1.visited}`);
console.log(`Distinct: ${guardPart1.distinct}`);

// find loops

let loops = 0;
for (let i = 0; i < input.length; i++) {
  for (let j = 0; j < input[i].length; j++) {
    const inputPart2 = input.map(row => row.slice());
    const guardPart2 = findGuard(inputPart2);
    if (guardPart2 === null) {
      console.log("Guard not found");
      process.exit(1);
    }

    // skip the guard starting position
    if (guardPart2.x === j && guardPart2.y === i) continue;

    // set the obstacle
    inputPart2[i][j] = OBSTACLE_MARKER;

    try {
      moveGuard(guardPart2, inputPart2);
    } catch (e) {
    //   console.log("Guard is in a loop");
      loops++;
    }
  }
}

// print the number of loops

console.log(`Loops: ${loops}`);

// output the input to a new file named output.txt

// fs.writeFileSync("output.txt", input.map(line => line.join("")).join("\n"));

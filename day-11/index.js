const fs = require("fs");

const PART1_NUMBER_OF_BLINKS = 25;
const PART2_NUMBER_OF_BLINKS = 75;

function blinkStone(stone) {
  const newStones = [];

  if (stone === 0) {
    newStones.push(1);
  } else {
    const digits = Math.floor(Math.log10(stone)) + 1;
    if (digits % 2 === 0) {
      let divider = Math.pow(10, digits / 2);
      newStones.push(Math.floor(stone / divider));
      newStones.push(stone % divider);
    } else {
      newStones.push(stone * 2024);
    }
  }

  return newStones;
}

function blinkTimes(stonesMap, times) {
  for (let i = 0; i < times; i++) {
    let nextMap = new Map();
    for (let [stone, count] of stonesMap) {
      const newStones = blinkStone(stone);
      for (let j = 0; j < newStones.length; j++) {
        const newStone = newStones[j];
        const newCount = nextMap.get(newStone) || 0;
        nextMap.set(newStone, newCount + count);
      }
    }
    stonesMap = nextMap;
  }

  return stonesMap;
}

function countStones(stonesMap) {
  let count = 0;
  for (let [, value] of stonesMap) {
    count += value;
  }
  return count;
}

// read the input file

const input = fs
  .readFileSync("input.txt", "utf-8")
  .trim()
  .split(" ")
  .map(Number);

// create a map of stones (an array of stones is too big to handle and causes a fatal error)

const stonesMap = new Map();
for (let i = 0; i < input.length; i++) {
  const stone = input[i];
  const count = stonesMap.get(stone) || 0;
  stonesMap.set(stone, count + 1);
}

// process the input

const part1StonesMap = blinkTimes(stonesMap, PART1_NUMBER_OF_BLINKS);
const part1StonesCount = countStones(part1StonesMap);

const part2StonesMap = blinkTimes(stonesMap, PART2_NUMBER_OF_BLINKS);
const part2StonesCount = countStones(part2StonesMap);

// print the result

console.log(`Part 1 stones count: ${part1StonesCount}`);
console.log(`Part 2 stones count: ${part2StonesCount}`);

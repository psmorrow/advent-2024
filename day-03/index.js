const fs = require("fs");

// read file

const input = fs.readFileSync("input.txt", "utf-8");

// use regex to find mul(x,y) commands where x & y are numbers 1 to 3 digits long, also find do() and don't() commands

const part1_regex = /mul\((\d{1,3}),(\d{1,3})\)/g;
const part2_regex = /mul\((\d{1,3}),(\d{1,3})\)|do\(\)|don't\(\)/g;

const matches = input.match(part2_regex);

// loop and do the multiplication, if do() is called, if don't() is called skip the multiplication

let doMultiply = true;
let result = 0;
matches.forEach(match => {
  if (match === "do()") {
    // console.log("do() called");
    doMultiply = true;
  } else if (match === "don't()") {
    // console.log("don't() called");
    doMultiply = false;
  } else if (doMultiply && match.includes("mul")) {
    const [x, y] = match.match(/\d{1,3}/g);
    result += Number(x) * Number(y);
  }
});

console.log(`Result: ${result}`);

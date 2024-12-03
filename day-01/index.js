const fs = require("fs");

function numericSort(a, b) {
  return a - b;
}

// read the file and parse the input

const listLeft = [];
const listRight = [];

const mapRight = new Map();

const input = fs.readFileSync("input.txt", "utf-8").split("\n");
input.forEach(line => {
  const parts = line.split("   ");
  if (parts.length === 2) {
    listLeft.push(Number(parts[0]));
    listRight.push(Number(parts[1]));

    const mapRightCount = mapRight.get(Number(parts[1])) ?? 0;
    mapRight.set(Number(parts[1]), mapRightCount + 1);
  }
});

listLeft.sort(numericSort);
listRight.sort(numericSort);

// calculate the distance

let distance = 0;
listLeft.forEach((listLeftItem, index) => {
  distance += Math.abs(listLeftItem - listRight[index]);
});

console.log(`This distance is: ${distance}`);

// calculate the similarity

let similarity = 0;
listLeft.forEach(listLeftItem => {
  similarity += listLeftItem * (mapRight.get(listLeftItem) ?? 0);
});

console.log(`This similarity score is: ${similarity}`);

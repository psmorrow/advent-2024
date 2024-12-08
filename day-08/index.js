const fs = require("fs");

const EMPTY_MARKER = ".";

function getLocations(input) {
  let locations = new Map();

  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[0].length; x++) {
      const key = input[y][x];
      if (key === EMPTY_MARKER) continue;

      const value = `${y},${x}`;

      const current = locations.get(key) ?? [];
      current.push(value);
      locations.set(key, current);
    }
  }

  return locations;
}

function getAntinodes(locations, withHarmonics) {
  let antinodes = new Map();

  for (let [key, value] of locations) {
    if (value.length >= 2) {
      for (let i = 0; i < value.length; i++) {
        for (let j = 0; j < value.length; j++) {
          if (i === j) continue;

          const [y1, x1] = value[i].split(",").map(Number);
          const [y2, x2] = value[j].split(",").map(Number);

          const dy = y1 - y2;
          const dx = x1 - x2;

          let ay = y1 + dy;
          let ax = x1 + dx;

          do {
            if (!isLocationOnMap(ay, ax, input)) break;

            const antinode = `${ay},${ax}`;
            const current = antinodes.get(key) ?? [];
            current.push(antinode);
            antinodes.set(key, current);

            if (!withHarmonics) break;

            ay += dy;
            ax += dx;
          } while (true);
        }
      }
    }
  }

  return antinodes;
}

function isLocationOnMap(y, x, input) {
  return y >= 0 && y < input.length && x >= 0 && x < input[0].length;
}

function getUniqueAntinodes(input, withHarmonics = false) {
  const locations = getLocations(input);
  const antinodes = getAntinodes(locations, withHarmonics);

  let uniqueAntinodes = new Set();

  if (withHarmonics) {
    for (let [key, value] of locations) {
      for (let i = 0; i < value.length; i++) {
        uniqueAntinodes.add(value[i]);
      }
    }
  }

  for (let [key, value] of antinodes) {
    for (let i = 0; i < value.length; i++) {
      uniqueAntinodes.add(value[i]);
    }
  }

  return uniqueAntinodes;
}

// read file as a 2d array

const input = fs
  .readFileSync("input.txt", "utf-8")
  .trim()
  .split("\n")
  .map(line => line.split(""));

// process

let uniqueAntinodes = getUniqueAntinodes(input);
let uniqueAntinodesWithHarmonics = getUniqueAntinodes(input, true);

// print

console.log(`Unique antinodes: ${uniqueAntinodes.size}`);
console.log(
  `Unique antinodes with harmonics: ${uniqueAntinodesWithHarmonics.size}`
);

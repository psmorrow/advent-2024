const fs = require("fs");

function getRegion(input, row, col, visited) {
  const region = [];
  const stack = [[row, col]];
  const letter = input[row][col];

  while (stack.length > 0) {
    const [row, col] = stack.pop();
    if (row < 0 || row >= input.length || col < 0 || col >= input[row].length) {
      continue;
    }
    if (visited.has(`${row},${col}`)) {
      continue;
    }
    if (input[row][col] !== letter) {
      continue;
    }
    visited.add(`${row},${col}`);
    region.push([row, col]);
    stack.push([row - 1, col]);
    stack.push([row + 1, col]);
    stack.push([row, col - 1]);
    stack.push([row, col + 1]);
  }

  return region;
}

function getAllRegions(input) {
  const regions = [];
  const visited = new Set();

  for (let row = 0; row < input.length; row++) {
    for (let col = 0; col < input[row].length; col++) {
      if (!visited.has(`${row},${col}`)) {
        const region = getRegion(input, row, col, visited);
        regions.push(region);
      }
    }
  }

  return regions;
}

function getPlotEdges(input, region, row, col) {
  let edges = 4;

  if (row - 1 >= 0 && region.some(([r, c]) => r === row - 1 && c === col)) {
    edges--;
  }
  if (
    row + 1 < input.length &&
    region.some(([r, c]) => r === row + 1 && c === col)
  ) {
    edges--;
  }
  if (col - 1 >= 0 && region.some(([r, c]) => r === row && c === col - 1)) {
    edges--;
  }
  if (
    col + 1 < input[row].length &&
    region.some(([r, c]) => r === row && c === col + 1)
  ) {
    edges--;
  }

  return edges;
}

function getRegionPricesByPlotEdges(input) {
  const regions = getAllRegions(input);
  const prices = regions.map(region => {
    const area = region.length;
    const perimeter = region.reduce((perimeter, [row, col]) => {
      const edges = getPlotEdges(input, region, row, col);
      return perimeter + edges;
    }, 0);
    return area * perimeter;
  });

  return prices;
}

function getFencePriceByPlotEdges(input) {
  return getRegionPricesByPlotEdges(input).reduce(
    (total, price) => total + price,
    0
  );
}

function getRegionCorners(input, region, row, col) {
  let corners = 0;

  // check for outer corners, an outer corner has one top or bottom plot and one left or right plot that is not in the region

  if (row - 1 < 0 || !region.some(([r, c]) => r === row - 1 && c === col)) {
    if (col - 1 < 0 || !region.some(([r, c]) => r === row && c === col - 1)) {
      corners++;
    }
    if (
      col + 1 >= input[row].length ||
      !region.some(([r, c]) => r === row && c === col + 1)
    ) {
      corners++;
    }
  }
  if (
    row + 1 >= input.length ||
    !region.some(([r, c]) => r === row + 1 && c === col)
  ) {
    if (col - 1 < 0 || !region.some(([r, c]) => r === row && c === col - 1)) {
      corners++;
    }
    if (
      col + 1 >= input[row].length ||
      !region.some(([r, c]) => r === row && c === col + 1)
    ) {
      corners++;
    }
  }

  // check for inner corners, an inner corner has one top or bottom plot and one left or right plot that is in the region with the diagonal plot in between them not in the region

  if (
    row - 1 >= 0 &&
    region.some(([r, c]) => r === row - 1 && c === col) &&
    col - 1 >= 0 &&
    region.some(([r, c]) => r === row && c === col - 1) &&
    !region.some(([r, c]) => r === row - 1 && c === col - 1)
  ) {
    corners++;
  }
  if (
    row - 1 >= 0 &&
    region.some(([r, c]) => r === row - 1 && c === col) &&
    col + 1 < input[row].length &&
    region.some(([r, c]) => r === row && c === col + 1) &&
    !region.some(([r, c]) => r === row - 1 && c === col + 1)
  ) {
    corners++;
  }
  if (
    row + 1 < input.length &&
    region.some(([r, c]) => r === row + 1 && c === col) &&
    col - 1 >= 0 &&
    region.some(([r, c]) => r === row && c === col - 1) &&
    !region.some(([r, c]) => r === row + 1 && c === col - 1)
  ) {
    corners++;
  }
  if (
    row + 1 < input.length &&
    region.some(([r, c]) => r === row + 1 && c === col) &&
    col + 1 < input[row].length &&
    region.some(([r, c]) => r === row && c === col + 1) &&
    !region.some(([r, c]) => r === row + 1 && c === col + 1)
  ) {
    corners++;
  }

  return corners;
}

function getRegionPricesByRegionEdges(input) {
  const regions = getAllRegions(input);
  const prices = regions.map(region => {
    const area = region.length;
    const perimeter = region.reduce((perimeter, [row, col]) => {
      const edges = getRegionCorners(input, region, row, col); // the number of edges equals the number of corners
      return perimeter + edges;
    }, 0);
    return area * perimeter;
  });

  return prices;
}

function getFencePriceByRegionEdges(input) {
  return getRegionPricesByRegionEdges(input).reduce(
    (total, price) => total + price,
    0
  );
}

// read the input file

const input = fs
  .readFileSync("input.txt", "utf-8")
  .trim()
  .split("\n")
  .map(line => line.split(""));

// process the input

const priceByPlotEdges = getFencePriceByPlotEdges(input);
const priceByRegionEdges = getFencePriceByRegionEdges(input);

// print the result

console.log(`Price by plot edges: ${priceByPlotEdges}`);
console.log(`Price by region edges: ${priceByRegionEdges}`);

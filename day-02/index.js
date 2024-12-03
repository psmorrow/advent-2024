const fs = require("fs");

function spliceArray(a, i, c = 1) {
  const newArray = [...a];
  newArray.splice(i, c);
  return newArray;
}

// read the file and parse the input

const reports = [];

const input = fs.readFileSync("input.txt", "utf-8").split("\n");
input.forEach(line => {
  if (line.trim() === "") {
    return;
  }

  const report = [];

  const parts = line.split(" ");
  parts.forEach(part => {
    report.push(Number(part));
  });

  reports.push(report);
});

function isIncreasingSafe(report) {
  for (let i = 0; i < report.length - 1; i++) {
    const current = report[i];
    const next = report[i + 1];
    if (current >= next) {
      return false;
    }
  }
  return true;
}

function isDecreasingSafe(report) {
  for (let i = 0; i < report.length - 1; i++) {
    const current = report[i];
    const next = report[i + 1];
    if (current <= next) {
      return false;
    }
  }
  return true;
}

function isAdjacentSafe(report) {
  for (let i = 0; i < report.length - 1; i++) {
    const current = report[i];
    const next = report[i + 1];
    const diff = Math.abs(current - next);
    if (diff < 1 || diff > 3) {
      return false;
    }
  }
  return true;
}

function getIncreasingTolerateReport(report) {
  if (isIncreasingSafe(report)) {
    return report;
  }
  for (let i = 0; i < report.length; i++) {
    const fixed = spliceArray(report, i, 1);
    if (isIncreasingSafe(fixed)) {
      return fixed;
    }
  }
  return report;
}

function getDecreasingTolerateReport(report) {
  if (isDecreasingSafe(report)) {
    return report;
  }
  for (let i = 0; i < report.length; i++) {
    const fixed = spliceArray(report, i, 1);
    if (isDecreasingSafe(fixed)) {
      return fixed;
    }
  }
  return report;
}

function getAdjacentTolerateReport(report) {
  if (isAdjacentSafe(report)) {
    return report;
  }
  for (let i = 0; i < report.length; i++) {
    const fixed = spliceArray(report, i, 1);
    if (isAdjacentSafe(fixed)) {
      return fixed;
    }
  }
  return report;
}

function isSafe(report) {
  return (
    (isIncreasingSafe(report) || isDecreasingSafe(report)) &&
    isAdjacentSafe(report)
  );
}

function isTolerate(report) {
  const increasingTolerateReport = getIncreasingTolerateReport(report);
  if (isSafe(increasingTolerateReport)) {
    return true;
  }

  const decreasingTolerateReport = getDecreasingTolerateReport(report);
  if (isSafe(decreasingTolerateReport)) {
    return true;
  }

  const adjacentTolerateReport = getAdjacentTolerateReport(report);
  if (isSafe(adjacentTolerateReport)) {
    return true;
  }

  return false;
}

// calculate safe and tolerate reports

let safe = 0;
let tolerate = 0;
let failed = 0;
reports.forEach(report => {
  if (isSafe(report)) {
    safe++;
    return;
  }

  if (isTolerate(report)) {
    tolerate++;
    return;
  }

  failed++;
});

console.log(`Total reports: ${reports.length}`);
console.log(`Safe: ${safe}`);
console.log(`Tolerate: ${tolerate}`);
console.log(`Safe and tolerate: ${safe + tolerate}`);
console.log(`Failed: ${failed}`);

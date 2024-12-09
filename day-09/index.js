const fs = require("fs");

const EMPTY_MARKER = ".";

function getFileBlocks(diskMap) {
  const fileBlocks = [];

  for (let i = 0, id = 0; i < diskMap.length; i++) {
    const block = Number(diskMap[i]);
    const char = i % 2 === 0 ? id++ : EMPTY_MARKER;
    for (let k = 0; k < block; k++) {
      fileBlocks.push(char);
    }
  }

  return fileBlocks;
}

function compactFileBlocks(fileBlocks) {
  const compactedFileBlocks = [...fileBlocks];

  for (let i = 0; i < compactedFileBlocks.length; i++) {
    if (compactedFileBlocks[i] === EMPTY_MARKER) {
      const emptyMarkerIndex = i;

      let valueIndex = -1;
      for (let j = compactedFileBlocks.length - 1; j >= 0; j--) {
        if (compactedFileBlocks[j] !== EMPTY_MARKER) {
          valueIndex = j;
          break;
        }
      }

      if (emptyMarkerIndex >= valueIndex) break;

      compactedFileBlocks[emptyMarkerIndex] = compactedFileBlocks[valueIndex];
      compactedFileBlocks[valueIndex] = EMPTY_MARKER;
    }
  }

  return compactedFileBlocks;
}

function compactFiles(fileBlocks) {
  const compactedFileBlocks = [...fileBlocks];

  function findRightMostFile(fileBlocks, start) {
    for (let i = start; i >= 0; i--) {
      if (fileBlocks[i] !== EMPTY_MARKER) {
        let j = i;
        while (j >= 0 && fileBlocks[j] === fileBlocks[i]) {
          j--;
        }
        return { start: j + 1, length: i - j };
      }
    }
    return null;
  }

  function findEmptySpotForFile(fileBlocks, length) {
    for (let i = 0; i < fileBlocks.length; i++) {
      if (fileBlocks[i] === EMPTY_MARKER) {
        let j = i;
        while (j < fileBlocks.length && fileBlocks[j] === EMPTY_MARKER) {
          j++;
        }
        if (j - i >= length) {
          return i;
        }
      }
    }
    return null;
  }

  let { start, length } = findRightMostFile(
    compactedFileBlocks,
    fileBlocks.length - 1
  );
  while (start) {
    const emptySpot = findEmptySpotForFile(compactedFileBlocks, length);
    if (emptySpot !== null && emptySpot < start) {
      for (let i = 0; i < length; i++) {
        compactedFileBlocks[emptySpot + i] = compactedFileBlocks[start + i];
        compactedFileBlocks[start + i] = EMPTY_MARKER;
      }
    }
    ({ start, length } = findRightMostFile(compactedFileBlocks, start - 1));
  }

  return compactedFileBlocks;
}

function getChecksum(compactedFileBlocks) {
  return compactedFileBlocks.reduce((acc, block, index) => {
    return acc + (block !== EMPTY_MARKER ? index * block : 0);
  }, 0);
}

// read the file

const diskMap = fs.readFileSync("input.txt", "utf-8").trim().split("");

// process

const fileBlocks = getFileBlocks(diskMap);
const compactedFileBlocks = compactFileBlocks(fileBlocks);
const checksum = getChecksum(compactedFileBlocks);

const compactedFileBlocks2 = compactFiles(fileBlocks);
const checksum2 = getChecksum(compactedFileBlocks2);

// print the result

console.log(`Checksum: ${checksum}`);
console.log(`Checksum2: ${checksum2}`);

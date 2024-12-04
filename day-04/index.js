const fs = require("fs");

const wordToFind = "XMAS";
const wordBackwardsToFind = wordToFind.split("").reverse().join("");

const wordXdToFind = "MAS";
const wordXdBackwardsToFind = wordXdToFind.split("").reverse().join("");
const wordXdOffset = Math.floor(wordXdToFind.length / 2);

function checkForWord(words, i, j) {
  let count = 0;

  // check horizontal
  const wordHorizontal = words[i].slice(j, j + wordToFind.length).join("");
  if (wordHorizontal === wordToFind || wordHorizontal === wordBackwardsToFind) {
    // console.log(i, j, wordHorizontal, "horizontal");
    count++;
  }

  // check vertical
  const wordVertical = words
    .slice(i, i + wordToFind.length)
    .map(row => row[j])
    .join("");
  if (wordVertical === wordToFind || wordVertical === wordBackwardsToFind) {
    // console.log(i, j, wordVertical, "vertical");
    count++;
  }

  // check diagonal (left to right)
  const wordDiagonalLR = words
    .slice(i, i + wordToFind.length)
    .map((row, index) => row[j + index])
    .join("");
  if (wordDiagonalLR === wordToFind || wordDiagonalLR === wordBackwardsToFind) {
    // console.log(i, j, wordDiagonalLR, "diagonal LR");
    count++;
  }

  // check diagonal (right to left)
  const wordDiagonalRL = words
    .slice(i, i + wordToFind.length)
    .map((row, index) => row[j - index])
    .join("");
  if (wordDiagonalRL === wordToFind || wordDiagonalRL === wordBackwardsToFind) {
    // console.log(i, j, wordDiagonalRL, "diagonal RL");
    count++;
  }

  return count;
}

function checkForXdWords(words, i, j) {
  let count = 0;

  // check diagonal (left to right) at the middle of the word
  const wordDiagonalLR = words
    .slice(i - wordXdOffset, i - wordXdOffset + wordXdToFind.length)
    .map((row, index) => row[j - wordXdOffset + index])
    .join("");

  // check diagonal (right to left) at the middle of the word
  const wordDiagonalRL = words
    .slice(i - wordXdOffset, i - wordXdOffset + wordXdToFind.length)
    .map((row, index) => row[j + wordXdOffset - index])
    .join("");

  if (
    (wordDiagonalLR === wordXdToFind ||
      wordDiagonalLR === wordXdBackwardsToFind) &&
    (wordDiagonalRL === wordXdToFind ||
      wordDiagonalRL === wordXdBackwardsToFind)
  ) {
    // console.log(i, j, wordDiagonalLR, wordDiagonalRL);
    count++;
  }

  return count;
}

// read file

const input = fs.readFileSync("input.txt", "utf-8");

// split input into 2d array of characters

const words = [];
input.split("\n").forEach(line => {
  if (line.trim() === "") {
    return;
  }
  words.push(line.split(""));
});

// count how many times the word XMAS is found in the words 2d array horizontal, vertical, diagonal, written backwards, or even overlapping other words

let countWords = 0;
let countXdWords = 0;
for (let i = 0; i < words.length; i++) {
  for (let j = 0; j < words[i].length; j++) {
    countWords += checkForWord(words, i, j);
    countXdWords += checkForXdWords(words, i, j);
  }
}

console.log(`Word count: ${countWords}`);
console.log(`Xd word count: ${countXdWords}`);

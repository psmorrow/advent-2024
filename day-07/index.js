const fs = require("fs");

// create all the permutations of adding and multiplying X numbers
// a recursive function that creates all the permutations of adding and multiplying X numbers
function generatePermutations(numbersArray) {
  if (numbersArray.length === 1) {
    return numbersArray;
  }

  const [first, second, ...rest] = numbersArray;

  const firstPerms = generatePermutations([first + second, ...rest]);
  const secondPerms = generatePermutations([first * second, ...rest]);
  const thirdPerms = generatePermutations([
    Number(String(first) + String(second)),
    ...rest,
  ]);

  return [...firstPerms, ...secondPerms, ...thirdPerms];
}

// read file

const input = fs.readFileSync("input.txt", "utf-8").trim().split("\n");

// process each line of input

let total = 0;

input.map(line => {
  let [value, numbers] = line.split(": ");
  value = Number(value);
  const numbersArray = numbers.split(" ").map(Number);

  // get all permutations of adding and multiplying numbers and also concatenation
  const permutations = generatePermutations(numbersArray);
  for (let i = 0; i < permutations.length; i++) {
    const permutation = permutations[i];
    // if permutation is equal to value, add value to total
    if (permutation === value) {
      total += value;
      break;
    }
  }
});

// print total of values that are equal to the permutations

console.log(`Total: ${total}`);

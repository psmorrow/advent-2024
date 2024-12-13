const fs = require("fs");

const NO_SOLUTION = -1;
const PRIZE_OFFSET = 10_000_000_000_000;

function playGame(xa, ya, xb, yb, xp, yp) {
  const b = (xa * yp - ya * xp) / (xa * yb - ya * xb);
  const a = (xp - b * xb) / xa;

  if (Number.isInteger(a) && Number.isInteger(b)) {
    return 3 * a + b;
  }

  return NO_SOLUTION;
}

function playAllGames(games, offset) {
  let minimumTokens = 0;

  for (let i = 0; i < games.length; i++) {
    const game = games[i].split("\n");

    const xa = Number(game[0].split(" ")[2].replace("X+", "").replace(",", ""));
    const ya = Number(game[0].split(" ")[3].replace("Y+", ""));
    const xb = Number(game[1].split(" ")[2].replace("X+", "").replace(",", ""));
    const yb = Number(game[1].split(" ")[3].replace("Y+", ""));
    const xp = Number(game[2].split(" ")[1].replace("X=", "").replace(",", ""));
    const yp = Number(game[2].split(" ")[2].replace("Y=", ""));

    const tokens = playGame(xa, ya, xb, yb, xp + offset, yp + offset);

    if (tokens !== NO_SOLUTION) {
      minimumTokens += tokens;
    }
  }

  return minimumTokens;
}

// read the input file

const input = fs.readFileSync("input.txt", "utf-8").trim().split("\n\n");

// process the input

const part1MinimumTokens = playAllGames(input, 0);
const part2MinimumTokens = playAllGames(input, PRIZE_OFFSET);

// print the result

console.log(`Part 1 minimum tokens: ${part1MinimumTokens}`);
console.log(`Part 2 minimum tokens: ${part2MinimumTokens}`);

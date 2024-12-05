const fs = require("fs");

function isUpdateInOrder(rulesMap, update) {
  for (let i = 1; i < update.length; i++) {
    const mustBeAfter = rulesMap.get(update[i]) ?? [];
    for (let j = 0; j < i; j++) {
      if (mustBeAfter.includes(update[j])) {
        return false;
      }
    }
  }
  return true;
}

function bucketUpdates(rulesMap, updates) {
  let inOrderUpdates = [];
  let outOrderUpdates = [];

  updates.forEach(update => {
    if (isUpdateInOrder(rulesMap, update)) {
      inOrderUpdates.push(update);
    } else {
      outOrderUpdates.push(update);
    }
  });

  return [inOrderUpdates, outOrderUpdates];
}

function findInOrderUpdate(rulesMap, outOrderUpdate) {
  let inOrderUpdate = [...outOrderUpdate];
  for (let i = 1; i < inOrderUpdate.length; i++) {
    const mustBeAfter = rulesMap.get(inOrderUpdate[i]) ?? [];
    for (let j = 0; j < i; j++) {
      if (mustBeAfter.includes(inOrderUpdate[j])) {
        let temp = inOrderUpdate[i];
        inOrderUpdate[i] = inOrderUpdate[j];
        inOrderUpdate[j] = temp;
      }
    }
  }
  return inOrderUpdate;
}

function fixOutOrderUpdates(rulesMap, outOrderUpdates) {
  let fixedOrderUpdates = [];

  outOrderUpdates.forEach(update => {
    let inOrderUpdate = findInOrderUpdate(rulesMap, update);
    fixedOrderUpdates.push(inOrderUpdate);
  });

  return fixedOrderUpdates;
}

// read file

let [rules, updates] = fs
  .readFileSync("input.txt", "utf-8")
  .trim()
  .split("\n\n");
rules = rules.split("\n").map(rule => rule.split("|"));
updates = updates.split("\n").map(update => update.split(","));

// add the rules into a map for easy lookup

const rulesMap = new Map();
rules.forEach(rule => {
  const page1 = rule[0];
  const page2 = rule[1];
  if (!rulesMap.has(page1)) {
    rulesMap.set(page1, []);
  }
  rulesMap.get(page1).push(page2);
});

// what pages are in and out of order as per the rules?

let [inOrderUpdates, outOrderUpdates] = bucketUpdates(rulesMap, updates);

// Sum the middle page numbers for the in order updates

let sumInOrderMiddlePages = 0;
inOrderUpdates.forEach(update => {
  sumInOrderMiddlePages += Number(update[Math.floor(update.length / 2)]);
});

console.log(
  `Sum of the in order updates middle pages: ${sumInOrderMiddlePages}`
);

// Fix the order of the updates not in order

outOrderUpdates = fixOutOrderUpdates(rulesMap, outOrderUpdates);

// Sum the middle page numbers for the out order updates

let sumOutOrderMiddlePages = 0;
outOrderUpdates.forEach(update => {
  sumOutOrderMiddlePages += Number(update[Math.floor(update.length / 2)]);
});

console.log(
  `Sum of the out order updates middle pages: ${sumOutOrderMiddlePages}`
);

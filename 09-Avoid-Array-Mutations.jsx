// Reminder: New ES6 syntax...
// `const addCounter = (list) => {};` is the same as...
// addCounter(list) {};

const addCounter = (list) => {
  // First basic attempt will pass but we need to avoid mutations...
  // list.push(0);

  // Better option...
  // return list.concat([0]);

  // Best option using ES6...
  return [...list, 0];
};

const removeCounter = (list, index) => {
  // First basic attempt will use splice() but this is a mutation method...
  // list.splice(index, 1);

  // The non-mutating method removes the element before and after what you want to remove
  // before concatentating them together...
  // return list
  //   .slice(0, index)
  //   .concat(list.slice(index + 1));

  // Again, we can use ES6 spread operator for cleaner code...
  return [
    ...list.slice(0, index),
    ...list.slice(index + 1)
  ];
};

const incrementCounter = (list, index) => {
  // Basic operation leads to mutation...
  // list[index]++;
  // return list;

  return [
    ...list.slice(0, index),
    list[index] + 1,
    ...list.slice(index + 1 )
  ]
}

const testAddCounter = () => {
  const listBefore = [];
  const listAfter = [0];

  // To avoid mutations the instructor uses DeepFreeze to test...
  deepFreeze(listBefore);

  expect(
    addCounter(listBefore);
  ).toEqual(listAfter);
};

testAddCounter();
console.log('All tests passed.');

const testRemoveCounter = () => {
  const listBefore = [0, 10, 20];
  const listAfter = [0, 20];

  deepFreeze(listBefore);

  expect(
    removeCounter(listBefore);
  ).toEqual(listAfter);
}

const testIncrementCounter = () => {
  const listBefore = [0, 10, 20];
  const listAfter = [0, 11, 20];

  deepFreeze(listBefore);

  expect(
    incrementCounter(listBefore, 1)
  ).toEqual(listAfter);
}

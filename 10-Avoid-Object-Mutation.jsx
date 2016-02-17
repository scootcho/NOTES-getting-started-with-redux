const toggleTodo = (todo) => {
  // First version = mutated...
  // todo.completed = !todo.completed;
  // return todo;

  // One alt method would be to create new copy of object
  // However, this is brittle. If we add props later.
  // return {
  //  id: todo.id,
  //  text: todo.text,
  //  completed: !todo.completed
  // };

  // Instead, use new ES6 method Object.assign()...
  // First arg is empty to prevent mutation of existing data.
  // REMINDER: This method is not native. Thus, requires Babel or other transpiler...
  return Object.assign({}, todo, {
    completed: !todo.completed;
  });
};

const testToggleTodo = () => {
  const todoBefore = {
    id: 0,
    text: 'Learn Redux',
    completed: false
  };
  const todoAfter = {
    id: 0,
    text: 'Learn Redux',
    completed: true
  };

  deepFreeze(todoBefore);

  expect(
    toggleTodo(todoBefore);
  ).toEqual(todoAfter);
}

testToggleTodo();
console.log('All tests passed');

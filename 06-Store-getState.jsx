// Bring in counter from previous lesson
const counterClean = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
      break;
    case 'DECREMENT':
      return state - 1;
      break;
    default:
      return state;
  }
}

// Using Babel syntax to import a single function from Redux
import { createStore } from Redux;

// Store binds together 3 principals of Redux...
// 1 - Holds current state
// 2 - Dispatches actions
// 3 - Specifies reducer that defines how state is updated
const store = createStore(counter);

console.log(store.getState());

const render = () => {
  document.body.innerText = store.getState();
};

// Send actions to change state of application
store.dispatch({ type: 'INCREMENT'});

// Register callback to be rendered out...
// Render method is registered above and then called once to set initial state.
store.subscribe(render);
render();

document.addEventListener('click', () => {
  store.dispatch({ type: 'INCREMENT' });
})

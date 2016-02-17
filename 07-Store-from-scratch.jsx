// Bring in counter from previous lesson
const counterClean = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      reutrn state + 1;
      break;
    case 'DECREMENT':
      return state - 1;
      break;
    default:
      return state;
  }
}

// Creating a 'createStore' function from scratch to understand tool...
const createStore = (reducer) => {
  // Store holds current state
  let state;
  // Because subscribe can be called many times we need an array...
  let listeners = [];

  // Return current valued
  const getState = () => state;

  // Dispatchers are the only way to change state...
  const dispatch = (action) => {
    state = reducer(state, action);
    // Whenever an action fires, each listener must be updated
    listeners.forEach(listener => listener());
  };

  const subscribe = (listener) => {
    // Each time subscribe is called we need to push it to listeners...
    listeners.push(listener);
    // Since there is no dedicated 'unsubscribe' we use the following...
    return () => {
      listeners = listeners.filter(l => l !== listener);
    }
  };

  // Populate initial state with dummy action...
  dispatch({});

  return { getState, dispatch, subscribe };
}



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

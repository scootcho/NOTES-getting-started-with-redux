const todo = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
          id: action.id,
          text: action.text,
          completed: false
        };
      break;
    case 'TOGGLE_TODO':
      if (todo.id !== action.id) {
        return state;
      }

      return {
        ...state,
        completed: !state.completed;
      };
      break;
    default:
      return state;
  }
}

const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        todo(undefined, action)
      ]
      break;
    case 'TOGGLE_TODO':
      return state.map(t => todo(t, action));
      break;
    default:
      return state;
  }
};

const visibilityFilter = (
  state = 'SHOW_ALL',
  action
) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
      break;
    default:
      return state;
  }
};

import { combineReducers } from Redux;

const todoApp = combineReducers({
  todos,
  visibilityFilter
});

import { createStore } from Redux;
const store = createStore(todoApp);

import React from 'react';

const FilterLink = ({
  filter,
  children
}) => {
  // If filter is active, it turns the link into unclickable span
  if (filter === currentFilter) {
    return <span>{children}</span>
  }

  return (
    <a href='#'
      onClick={e => {
        e.preventDefault();
        store.dispatch({
          type: 'SET_VISIBLITY_FILTER',
          filter
        });
      }}
    >
      {children}
    </a>
  )
}

const getVisibleTodos = (
  todos,
  filter
) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
      break;
    case 'SHOW_ACTIVE':
      return todos.filter(
        t => !t.completed;
      );
      break;
    case 'SHOW_COMPLETED':
      return todos.filter(
        t => t.completed;
      );
      break;
  }
}

// First we need to create a global var that can be passed down as key
let nextTodoId = 0;
class TodoApp extends React.Component {
  // Creating a const here allows you to pass the same values without having to de
  const {
    todos,
    visibilityFilter
  } = this.props;
  const visibleTodos = getVisibleTodos(
    todos,
    visibilityFilter
  );
  render () {
    return (
      <div>
        {/* NOTE: The ref prop below uses single arg functon shorthand */}
        <input ref={ node => {
          this.input = node;
        }}/>
        {/* onClick we want to execute a nameless function to dispatch our action */}
        <button onClick={() => {
          store.dispatch({
            type: 'ADD_TODO',
            text: this.input.value,
            id: nextTodoId++
          });
          // NOTE: Once action is completed we want to reset the input field
          this.input.value = '';
        }}>
          Add Todo
        </button>
        {/* We also want to display a list of all todo items already in state */}
        <ul>
          {/* We use the map method to easily pull out todo props */}
          {visibleTodos.map(todo =>
            <li
              key={todo.id}
              onClick={() => {
                store.dispatch({
                  type: 'TOGGLE_TODO',
                  id: todo.id
                });
              }}
              style={{
                textDecoration:
                  todo.completed ?
                    'line-through' :
                    'none'
              }}
            >
              {todo.text}
            </li>
          )}
        </ul>
        <p>
          Show:
          {' '}
          <FilterLink filter='SHOW_ALL' currentFilter={visibilityFilter}>All</FilterLink>
          {' '}
          <FilterLink filter='SHOW_ACTIVE' currentFilter={visibilityFilter}>Active</FilterLink>
          {' '}
          <FilterLink filter='SHOW_COMPLETED' currentFilter={visibilityFilter}>Copleted</FilterLink>
        </p>
      </div>
    )
  }
}

// NOTE: React apps often are the source of actions being dispatched, but it is equally important that they can read a current state.
// Here the render function is simply grabbing the current state and passing it to the React component as a prop
// Whenever state changes, the listeners will fire, store.subscribe() activated, and render will use new state
const render = () => {
  ReactDom.render(
    <TodoApp
      {...store.getState()}
    />
    document.getElementById('root')
  );
}

// NOTE: Subscribe will run anytime the state changes; thus, firing the render function anew.
store.subscribe(render);
// NOTE: As mentioned before, we run the render(); once at the end of the file to instatiate the view.
render();

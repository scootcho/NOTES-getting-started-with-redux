// NOTE: Accessing the store from a top-level variable, as seen in previous examples, is not a scalable solution.
// The store variable has been refactored into a prop from the bottom and only passed to container elements that req it

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


import React from 'react';

const Link = ({
  active,
  children,
  onClick
}) => {
  if (active) {
    return <span>{children}</span>
  }

  return (
    <a href='#'
      onClick={e => {
        e.preventDefault();
        onClick();
      }}
    >
      {children}
    </a>
  )
}

class FilterLink extends React.Component {
  componentDidMount() {
    const { store } = this.context
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    );
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const props = this.props;
    const { store } = this.context;
    const state = store.getState();

    return (
      <Link
        active={
          props.filter ===
          state.visibilityFilter
        }
        onClick={() =>
          store.dispatch({
            type: 'SET_VISIBILITY_FILTER',
            filter: props.filter
          })
        }
      >
        {props.children}
      </Link>
    );
  }
}

FilterLink.contextTypes = {
  store: React.PropTypes.object
};

const Footer = () => {
  return (
    <p>
      Show:
      {' '}
      <FilterLink filter='SHOW_ALL' >
        All
      </FilterLink>
      {' '}
      <FilterLink filter='SHOW_ACTIVE' >
        Active
      </FilterLink>
      {' '}
      <FilterLink filter='SHOW_COMPLETED' >
        Copleted
      </FilterLink>
    </p>
  );
};

const Todo = ({
  onClick,
  completed,
  text
}) => (
  <li
    onClick={onClick}
    style={{
      textDecoration:
        todo.completed ?
          'line-through' :
          'none'
    }}
  >
    {todo.text}
  </li>
);

const TodoList = ({
  todos,
  onTodoClick
}) => (
  <ul>
    {todos.map(todo =>
      <Todo
        key={todo.id}
        {...todo}
        onClick={() => onTodoClick(todo.id)}
      />
    )}
  </ul>
);

let nextTodoId = 0;

// NOTE: For functional components that don't have `this`, they also receive context, but as a second argument after props.
const AddTodo = (props, { store }) => {
  let input;

  return (
    <input ref={ node => {
      input = node;
    }}/>
    <button onClick={() => {
      store.dispatch({
        type: 'ADD_TODO',
        id: nextTodoId++,
        text: input.value
      });
      input.value = '';
    }}>
      Add Todo
    </button>
  );
};

// NOTE: Still need to declare context types...
AddTodo.contextTypes = {
  store: React.PropTypes.object
};

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

class VisibleTodoList extends React.Component {
  componentDidMount() {
    const { store } = this.context;
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    );
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const props = this.props;
    const { store } = this.context;
    const state = store.getState();

    return (
      <TodoList
        todos={
          getVisibleTodos(
            state.todos,
            state.visibilityFilter
          )
        }
        onTodoClick={ id =>
          store.dispatch({
            type: 'TOGGLE_TODO'
            id
          })
        }
      />
    );
  }
}

// NOTE: Context is opt-in for the receiving components, so you MUST specify which context to receive vs pass down.
// If you forget to declare this, your component will not work.
VisibleTodoList.contextTypes = {
  store: React.PropTypes.object
};

const TodoApp = () => {
  <div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
}

// NOTE: Using the advanced React feature called 'Context' we can create a component that will pass props down to its children and grand children. This prevents excessive boilerplate code to pass props.
// NOTE: 'Context' is a very powerful feature, but in a way contradicts React data flow. Essentially, a global variable across component tree. Usually a bad idea, unless you are using it for dependency inject.
// NOTE: 'Context' API is NOT stable, so use sparingly.

class Provider extends React.Component {
  // NOTE: This is an advanced context feature that will make the store part of the context for any child or granchild of the component.
  getChildContext() {
    return {
      store: this.props.store
    }
  }
}

// NOTE: For the above context to work, you must specify child context types!
Provider.childContextTypes = {
  store: React.PropTypes.object
};

import { createStore } from Redux;

ReactDom.render(
  <Provider store={createStore(todoApp)}>
    <TodoApp />
  </Provider>,
  document.getElementById('root')
);

store.subscribe(render);
render();

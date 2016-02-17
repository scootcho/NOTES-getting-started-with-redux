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
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    );
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const props = this.props;
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

//----------------------------BEGIN HERE ------------------
// Throughout any app, we want to make components as small and flexible as reasonably possible
// While not required, it's nice to keep components as purely presentational if possible
// We use the component props to explicitly declare the data that a component needs to render.
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

const AddTodo = ({
  onAddClick
}) => {
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
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    );
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const props = this.props;
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

let nextTodoId = 0;
const TodoApp =() => {
  <div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
}

ReactDom.render(
  <TodoApp />
  document.getElementById('root')
);

store.subscribe(render);
render();

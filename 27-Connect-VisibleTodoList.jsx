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

// ----------------------------------------- BEGIN HERE ------------------------------------------

// NOTE: All 'container' components are very similar
//  - They need to re-render when the store state changes
//  - They need to unsubscribe when they unmount
//  - They need to take current state of store to render their presentational components
//  - They need to specify context types

// NOTE: New component to map Redux store state and takes props to pass down from current state.
// These props are going to be updated whenever the state changes.
const mapStateToProps = (state) => {
  return {
    todos: getVisibleTodos(
      state.todos,
      state.visibilityFilter
    )
  };
};

// NOTE: This function maps dispatch method of store to callback behaviors.
// This returns all props that are used by dispatch.
const mapDispatchToProps = (dispatch) => {
  return {
    // NOTE: Moving this dispatch means we no longer have reference to store so we just use `dispatch`
    onTodoClick: (id) => {
      dispatch({
        type: 'TOGGLE_TODO'
        id
      })
    }
  };
};

// NOTE: Because the two functions above describe the container component so well, we can simply generate it use connect() function...
import { connect } from 'react-redux';

// NOTE: Now, instead of declaring a class, we can declare a variable with connect() method
// class VisibleTodoList extends React.Component {
//   componentDidMount() {
//     const { store } = this.context;
//     this.unsubscribe = store.subscribe(() =>
//       this.forceUpdate()
//     );
//   }
//
//   componentWillUnmount() {
//     this.unsubscribe();
//   }
//
//   render() {
//     const props = this.props;
//     const { store } = this.context;
//     const state = store.getState();
//
//     return (
//       <TodoList
//         todos={
//
//         }
//         onTodoClick={ id =>
//
//         }
//       />
//     );
//   }
// }

// NOTE: The second part is the presentational component that we need to pass the props to.
// NOTE: This MUST be invoked twice. connect(mapStateToProps, mapDispatchToProps, mergeProps)(MyComponent)
const VisibleTodoList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList);

// NOTE: Connect method renders the need for context specification moot.
// VisibleTodoList.contextTypes = {
//   store: React.PropTypes.object
// };

const TodoApp = () => {
  <div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
}

import { Provider } from 'react-redux';
import { createStore } from Redux;

ReactDom.render(
  <Provider store={createStore(todoApp)}>
    <TodoApp />
  </Provider>,
  document.getElementById('root')
);

store.subscribe(render);
render();

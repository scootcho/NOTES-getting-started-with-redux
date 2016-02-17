// NOTE: We can typically keep standard names of mapStateToProps, etc. However, this course uses single file example, so we will need to make these function names unique as we apply connect() to other components.
// NOTE: This is NOT required for larger projects that will have components saved in their own files.

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

// NOTE: Since context is unstable in API, we will refactor using connect()
// NOTE: Changing `AddTodo` from 'const' to 'let' binding, it allows us to reassign below
// NOTE: `AddTodo` component accepts 'dispatch' as prop, but it has no clue how to get data from the store by default
let AddTodo = ({ dispatch }) => {
  let input;

  return (
    <input ref={ node => {
      input = node;
    }}/>
    <button onClick={() => {
      dispatch({
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

// NOTE: Now the consuming component does not need to specify the dispatch prop because it will be injected during component creation via connect()

// AddTodo = connect(
//   // NOTE: First arg of connect() is always mapStateToProps; however, this example does not require any props to be passed. Thus, we pass an empty object.
//   // state => {
//   //   return {};
//   // },
//   // NOTE: Since the 'AddTodo' component does not need any callback props, we simply return the 'dispatch' prop
//   dispatch => {
//     return { dispatch };
//   }
// )(AddTodo);

// NOTE: The above example is later described as wasteful. Since the generated component does not need to subscribe to the store and the pattern of just injecting 'dispatch' is so common that both argumnets can be null...

// AddTodo = connect(
//  null,
//  null
// )(AddTodo);

// NOTE: Since both argumnets above are null, we can rewrite the connect function even more concisely...
// REMINDER: This will generate a component that is by default NOT subscribed to store and injects JUST the 'dispatch' function as a prop...
// By using the same component name, the generated component will bind 'dispatch' when it is called below in TodoApp
AddTodo = connect()(AddTodo);

// NOTE: Here again, connect() allows us to remove the contextTypes function...
// Although the generated container component above will NOT pass any state-dependent props, it WILL pass 'dispatch' itself so that the component can read it from the props and use it without worrying about context or specifying contextTypes like below...

// AddTodo.contextTypes = {
//   store: React.PropTypes.object
// };

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

import { connect } from 'react-redux';
const mapStateToTodoListProps = (state) => {
  return {
    todos: getVisibleTodos(
      state.todos,
      state.visibilityFilter
    )
  };
};
const mapDispatchToTodoListProps = (dispatch) => {
  return {
    onTodoClick: (id) => {
      dispatch({
        type: 'TOGGLE_TODO'
        id
      })
    }
  };
};
const VisibleTodoList = connect(
  mapStateToTodoListProps,
  mapDispatchToTodoListProps
)(TodoList);

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

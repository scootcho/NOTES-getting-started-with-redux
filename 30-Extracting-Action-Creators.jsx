/*
  External dependencies
 */
import React from 'react';
import ReactDOM  from 'react-dom';
import { createStore, combineReducers } from Redux;
import { Provider, connect } from 'react-redux';

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

const todoApp = combineReducers({
  todos,
  visibilityFilter
});

// -------------------------------------- BEGIN HERE --------------------------------------
// NOTE: In current 'AddTodo', we dispatch an action using onClick; however, this precludes another component from dispatching the same action because it requires the 'nextTodoId' which is not / should not be global...
// NOTE: It would also be nice if the component below didn't have to worry about dispatch id, since its only job is to transmit the text value.
// NOTE: Although this may seem like boilerplate code, it's actual very useful for documenting what kind of actions each component can dispatch.

let nextTodoId = 0;
const addTodo = (text) => {
  return {
    type: 'ADD_TODO',
    id: nextTodoId++,
    text
  };
};

const setVisibilityFilter = (filter) => {
  return {
    type: 'SET_VISIBILITY_FILTER',
    filter
  };
};

const toggleTodo = (id) => {
  return {
    type: 'TOGGLE_TODO'
    id
  };
}

// --------------------------------------------------------------------------------------------

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

const mapStateToLinkProps = (
  state,
  ownProps
) => {
  return {
    active:
      ownProps.filter ===
      state.visibilityFilter
  };
};

const mapDispatchToLinkProps (
  dispatch,
  ownProps
) => {
  return {
    dispatch(setVisibilityFilter(ownProps.filter))
  };
}

const FilterLink - connect(
  mapStateToLinkProps,
  mapDispatchToLinkProps
)(Link)

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

let AddTodo = ({ dispatch }) => {
  let input;

  return (
    <input ref={ node => {
      input = node;
    }}/>
    <button onClick={() => {
      dispatch(addTodo(input.value));
      input.value = '';
    }}>
      Add Todo
    </button>
  );
};

AddTodo = connect()(AddTodo);

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
      dispatch(toggleTodo(id));
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

ReactDom.render(
  <Provider store={createStore(todoApp)}>
    <TodoApp />
  </Provider>,
  document.getElementById('root')
);

store.subscribe(render);
render();

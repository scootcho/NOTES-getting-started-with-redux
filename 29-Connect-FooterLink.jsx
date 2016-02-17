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

// ---------------------------------------- BEGIN HERE -------------------------------------

const mapStateToLinkProps = (
  state,
  ownProps
) => {
  return {
    active:
      // NOTE: We notice the expression below references the 'filter' method for FilterLink component.
      // Thus, it is critical that we pass the container 'props' to calculate child props.
      // We use 'ownProps' to clarify difference between parent and child
      ownProps.filter ===
      state.visibilityFilter
  };
};

const mapDispatchToLinkProps (
  dispatch,
  ownProps
) => {
  return {
    // NOTE: Again, we reference props again
    dispatch({
      type: 'SET_VISIBILITY_FILTER',
      filter: ownProps.filter
    })
  };
}

const FilterLink - connect(
  mapStateToLinkProps,
  mapDispatchToLinkProps
)(Link)

// NOTE: Now, we can remove the entire FilterLink class and contextTypes...

// class FilterLink extends React.Component {
//   componentDidMount() {
//     const { store } = this.context
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
//       <Link
//         active={
//
//         }
//         onClick={() =>
//
//         }
//       >
//         {props.children}
//       </Link>
//     );
//   }
// }
//
// FilterLink.contextTypes = {
//   store: React.PropTypes.object
// };

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

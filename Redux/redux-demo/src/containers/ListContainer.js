import React from 'React';
import {connect} from 'react-redux';

import List from '../components/List';

const mapStateToProps = (state) => {
  return {
    items: state.list
  };
}

const mapDispatchToProps = dispatch => {
  return {
    // onTodoClick: id => {
    //   dispatch(toggleTodo(id))
    // }
  };
}

const ListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(List);

export default ListContainer;

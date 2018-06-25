import React from 'react';
import {connect} from 'react-redux';

import List from '../components/List';

const addItem = (item) => ({ type: 'CREATE_ITEM', payload: { title: item } });

const mapStateToProps = (state) => {
  return {
    items: state.list
  };
}

const mapDispatchToProps = dispatch => {
  return {
    onAddItem: item => {
      dispatch(addItem(item))
    }
  };
}

const ListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(List);

export default ListContainer;

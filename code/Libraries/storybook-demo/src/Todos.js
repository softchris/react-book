import React from 'react';
import styled from 'styled-components';

const Todo = styled.div`
  box-shadow: 0 0 5px grey;
  padding: 10px;
  margin-bottom: 10px;
`;

const Todos = ({ todos }) => (
  <React.Fragment>
    <h3>List of todos</h3>
    {todos.map(t => <Todo key={t.title}>{t.title}</Todo>)}
  </React.Fragment>
);

export default Todos;

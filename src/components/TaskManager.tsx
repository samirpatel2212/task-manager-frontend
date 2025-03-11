import React from 'react';
import styled from 'styled-components';
import TaskList from './TaskList'; // Assuming TaskList.tsx is in the same directory

const TaskManagerContainer = styled.div`
  font-family: sans-serif;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 20px;
`;

const TaskManager: React.FC = () => {
  return (
    <TaskManagerContainer>
      <Header>
        <h1>Task Manager</h1>
      </Header>
      <TaskList />
    </TaskManagerContainer>
  );
};

export default TaskManager;
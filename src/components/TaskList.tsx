import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useTaskMutations } from '../hooks/useTaskMutations';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import { Task } from '../types/taskTypes';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import _ from 'lodash';
import { CloseButton, ToastContainer } from '../common/styled';
import { useTaskListUpdate } from '../hooks/useTaskListUpdate';

const ListContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
`;
const StyledTable = styled.table`
  border-collapse: collapse;
  th,
  td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
  }

  tbody tr:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const TableWrapper = styled.div`
  margin-top: 20px;
  min-height: 420px;
  max-height: 420px;
  overflow-y: auto;
  border: 1px solid #ddd;
`;
const LoadingIndicator = styled.div`
  text-align: center;
  padding: 10px;
`;

const TaskList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [tasksList, setTasksList] = useState<Task[]>([]);
  const onRemoveTask = () => {
    setPage(1);
  };
  const { tasks, isLoading, removeTask, error, hasNextPage } = useTaskMutations(page, onRemoveTask);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [toast, setToast] = useState<{type: 'success' | 'failure', message: string } | null>(null);
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null); 

  useTaskListUpdate({ tasks, page, setTasksList });

  useEffect(() => {
    timeoutId.current = setTimeout(() => {
        setToast(null);
    }, 2000);  
  }, [toast]);

  useEffect(() => {
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, []);


  const { targetRef } = useIntersectionObserver({
    onIntersect: () => {
      if (!isLoading) {
        setPage((prevPage) => prevPage + 1);
      }
    },
    enabled: !isLoading && hasNextPage,
  });

  const handleTaskEdit = (task: Task) => {
    setEditingTask(task);
  };
  const deleteTask = (taskId: string) => {
    removeTask.mutate(taskId, {
      onError: () => setToast({
        type: 'failure',
        message: 'Failed to delete task'
      }), 
      onSuccess: () => setToast({
        type: 'success',
        message: 'Task delete successfully'
      })
  });
  };
  const handleFailure = (message: string) => {
    setToast({
      type: 'failure',
      message,
    })
  };
  const onSuccess = (message: string) => {
    setToast({
      type: 'success',
      message,
    })
  }
  useEffect(() => {
    console.log('Tasks:', tasks);  // Log the tasks inside TaskList
    console.log('tasksList:', tasksList);  // Log the tasks inside TaskList
  }, [tasks]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading tasks: {error.message}</p>;

  return (
    <ListContainer>
        {(toast?.message) && 
          <ToastContainer type={toast.type}>
            <span>{toast.message}</span>
            <CloseButton onClick={() => setToast(null)}>&times;</CloseButton>
          </ToastContainer>}
        <TableWrapper>
            <StyledTable>
                <thead>
                    <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Due Date</th>
                    <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                  {tasksList?.map((task) => (
                      <TaskItem key={task.id} task={task} editTask={handleTaskEdit} removeTask={deleteTask} />
                  ))}
                </tbody>
            </StyledTable>
            <LoadingIndicator ref={targetRef}>
              {isLoading && 'Loading...'}
            </LoadingIndicator>
        </TableWrapper>
        <TaskForm 
          task={editingTask}
          page={page}
          resetTask={() => setEditingTask(null)}
          onSuccess={onSuccess}
          onError={handleFailure} 
        />
    </ListContainer>
  );
};

export default TaskList;
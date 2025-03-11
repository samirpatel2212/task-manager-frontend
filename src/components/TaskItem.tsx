import React from 'react';
import { Task } from '../types/taskTypes';
import { dateToString } from '../common/utils';
import { priorityMap, statusMap } from '../common/constants';
import { Button } from '../common/styled';

const TaskItem: React.FC<{
    task: Task,
    editTask: (task: Task)=> void,
    removeTask: (taskId: string)=> void
}> = ({
    task,
    editTask,
    removeTask,
 }) => {
  return (
        <tr key={task.id}>
        <td>{task.title}</td>
        <td>{task.description}</td>
        <td>{statusMap[task.status]}</td>
        <td>{priorityMap[task.priority]}</td>
        <td>{dateToString(task.dueDate)}</td>
        <td>
            <Button onClick={() => editTask(task)}>Edit</Button>
            <Button onClick={() => removeTask(task.id)}>Delete</Button>
        </td>
        </tr>
    );
};

export default TaskItem;
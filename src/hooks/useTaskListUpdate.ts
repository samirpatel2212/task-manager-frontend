import { useEffect, useRef } from 'react';
import _ from 'lodash';
import { Task } from '../types/taskTypes'; // Adjust import path as needed

interface UseTaskListUpdateProps {
  tasks: Task[] | undefined;
  page: number;
  setTasksList: React.Dispatch<React.SetStateAction<Task[]>>;
}

/**
 * Custom hook to manage the task list updates based on the fetched tasks and pagination.
 * This hook handles updating the task list state by filtering out duplicate tasks and
 * appending new tasks based on the current page. It also uses deep comparison to
 * prevent unnecessary state updates.
 *
 * @param {UseTaskListUpdateProps} props - The props for the hook.
 * @param {Task[] | undefined} props.tasks - The fetched tasks array, or undefined if loading.
 * @param {number} props.page - The current page number.
 * @param {React.Dispatch<React.SetStateAction<Task[]>>} props.setTasksList - The state setter for the task list.
 *
 */
export const useTaskListUpdate = ({ tasks, page, setTasksList }: UseTaskListUpdateProps) => {
  const previousTasksRef = useRef<Task[]>([]);

  useEffect(() => {
    if (tasks) {
      if (_.isEqual(previousTasksRef.current, tasks)) {
        return;
      }
      if (page === 1) {
        setTasksList(tasks);
      } else {
        setTasksList((prevTasks) => {
          const newTasks = tasks.filter(
            (newTask) => !prevTasks.some((prevTask) => prevTask.id === newTask.id)
          );
          return [...prevTasks, ...newTasks];
        });
      }
      previousTasksRef.current = tasks;
    } else if (page === 1) {
      setTasksList([]);
    }
  }, [tasks, page, setTasksList]);
};
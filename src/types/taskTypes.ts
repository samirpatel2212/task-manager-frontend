export interface Task {
    id: string;
    title: string;
    description?: string;
    status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    dueDate: Date;
    createdAt: Date;
    updatedAt: Date;

}

export type CreateTask = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateTask = Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>;
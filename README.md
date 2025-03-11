# Task Manager Frontend

This project is a React-based frontend application for managing tasks. It allows users to create, view, update, and delete tasks through a user-friendly interface.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Folder Structure](#folder-structure)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Application Architecture and Design Choices](#application-architecture-and-design-choices)
- [Additional Notes and Considerations](#additional-notes-and-considerations)
- [Contributing](#contributing)
- [License](#license)

## Technologies Used

-   **React:** For building the user interface.
-   **TypeScript:** For static typing and improved code quality.
-   **@tanstack/react-query:** For efficient data fetching and caching.
-   **lodash:** For utility functions.
-   **styled-components:** For styling components.
-   **@testing-library/react:** For testing React components.
-   **@testing-library/jest-dom:** for jest dom matchers.
-   **@testing-library/user-event:** for simulating user events.

## Folder Structure

task-manager-frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── TaskList.tsx
│   │   ├── TaskForm.tsx
│   │   ├── TaskItem.tsx
│   │   └── ... (other components)
│   ├── hooks/
│   │   ├── useTaskListQuery.ts
│   │   ├── useTaskMutations.ts
│   │   └── useTaskListUpdate.ts
│   ├── types/
│   │   └── taskTypes.ts
│   ├── App.tsx
│   ├── index.tsx
│   └── api/
│       └── taskApi.ts
├── package.json
├── tsconfig.json
├── README.md


-   **`public/`**: Contains the `index.html` file, which is the entry point for the application.
-   **`src/components/`**: Houses all reusable React components.
-   **`src/hooks/`**: Contains custom React hooks for data fetching and state management.
-   **`src/types/`**: Defines TypeScript interfaces and types.
-   **`src/api/`**: Contains api calls.
-   **`src/App.tsx`**: The main application component.
-   **`src/index.tsx`**: The entry point for rendering the React application.

## Installation

1.  Clone the repository:

    ```bash
    git clone <repository_url>
    ```

2.  Navigate to the project directory:

    ```bash
    cd task-manager-frontend
    ```

3.  Install dependencies:

    ```bash
    npm install
    ```

## Running the Application

1.  Start the development server:

    ```bash
    npm start
    ```

2.  Open your browser and navigate to `http://localhost:3000`.

## Application Architecture and Design Choices

-   **Component-Based Architecture:** The application is built using a component-based architecture, which makes it easy to manage and reuse UI elements.
-   **React Hooks:** React hooks are used for state management and side effects, promoting functional components and cleaner code.
-   **@tanstack/react-query:** This library is used for data fetching, caching, and state management, simplifying API interactions and improving performance.
-   **Styled Components:** Styled components are used for styling, providing a clean and maintainable way to style React components.
-   **Typescript:** Typescript is used to provide type safety, and to help catch errors early.
-   **Seperation of concerns:** The code is divided into components, hooks, types, and api calls, to promote code reusability, and to keep the code organized.
-   **User Experience:** The design focuses on providing a user-friendly interface for managing tasks, with clear and intuitive interactions.

## Additional Notes and Considerations

-   **API Integration:** This frontend application assumes a backend API is available for managing tasks. Ensure the backend API is running and accessible.
-   **Testing:** Unit tests are included to ensure the reliability of the components and hooks.
-   **Error Handling:** Basic error handling is implemented, but more robust error handling can be added for production use.
-   **Accessibility:** Consider adding accessibility features to improve the user experience for all users.
-   **Responsiveness:** The application can be made responsive to work on different screen sizes.


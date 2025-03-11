import React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import logo from './logo.svg';
import './App.css';
import TaskManager from './components/TaskManager';

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (error: Error) => {
        console.error('Global Mutation Error:', error);
      },
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header> */}
        <TaskManager />
      </div>
    </QueryClientProvider>
  );
}

export default App;

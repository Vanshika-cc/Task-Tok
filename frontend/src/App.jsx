import React, { useState } from 'react';
import TaskTok from './components/TaskTok';
import TaskTokAuth from './components/TaskTokAuth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="App">
      {isAuthenticated ? (
        <TaskTok />
      ) : (
        <TaskTokAuth onAuthenticated={() => setIsAuthenticated(true)} />
      )}
    </div>
  );
}

export default App;
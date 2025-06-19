import React from 'react';
import logo from './logo.svg';

function App() {
  return (
    <div className="text-center">
      <header className="bg-gray-800 min-h-screen flex flex-col items-center justify-center text-white text-2xl">
        <img 
          src={logo} 
          className="h-40 pointer-events-none animate-spin" 
          style={{ animationDuration: '20s' }}
          alt="logo" 
        />
        <p className="mt-8">
          Edit <code className="font-mono bg-gray-700 px-2 py-1 rounded">src/App.tsx</code> and save to reload.
        </p>
        <a
          className="text-blue-400 hover:text-blue-300 transition-colors duration-200 mt-4"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

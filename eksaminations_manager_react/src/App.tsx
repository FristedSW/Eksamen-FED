import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Home } from './components/Home';
import { CreateExam } from './components/CreateExam';
import { AddStudents } from './components/AddStudents';
import { StartExam } from './components/StartExam';
import { ViewHistory } from './components/ViewHistory';

function App() {
  return (
    <Router>
      <div className="h-[calc(100vh-64px)] bg-gray-50 flex flex-col overflow-hidden">
        {/* Navigation */}
        <nav className="bg-blue-600 text-white shadow-lg fixed top-0 left-0 right-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="text-xl font-bold">
                  Exam Manager
                </Link>
              </div>
              <div className="flex items-center space-x-4">
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 mt-16 flex-1 flex flex-col overflow-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-exam" element={<CreateExam />} />
            <Route path="/add-students" element={<AddStudents />} />
            <Route path="/start-exam" element={<StartExam />} />
            <Route path="/history" element={<ViewHistory />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

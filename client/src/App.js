import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import TodoPage from './pages/TodoPage';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/todos" /> : <Login />} 
        />
        <Route 
          path="/signup" 
          element={isAuthenticated ? <Navigate to="/todos" /> : <SignUp />} 
        />
        <Route 
          path="/todos" 
          element={isAuthenticated ? <TodoPage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/" 
          element={<Navigate to={isAuthenticated ? "/todos" : "/login"} />} 
        />
      </Routes>
    </Router>
  );
}

export default App; 
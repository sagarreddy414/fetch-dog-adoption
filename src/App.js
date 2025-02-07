// src/App.js
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import DogSearch from './DogSearch';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const theme = createTheme({
    palette: {
      primary: { main: '#1976d2' }
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
        <Route path="/search" element={isAuthenticated ? <DogSearch /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;

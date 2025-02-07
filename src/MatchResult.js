// src/MatchResult.js
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

function MatchResult({ matchedDog }) {
  return (
    <Box sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Your Match!
        </Typography>
        {matchedDog && (
          <>
            <img
              src={matchedDog.img}
              alt={matchedDog.name}
              style={{ maxWidth: '100%', height: 'auto', marginBottom: '16px' }}
            />
            <Typography variant="body1">
              Congratulations! You have been matched with <strong>{matchedDog.name}</strong>.
            </Typography>
          </>
        )}
      </Paper>
    </Box>
  );
}

export default MatchResult;

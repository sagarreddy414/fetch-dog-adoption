// src/MatchResult.js
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

function MatchResult({ matchId }) {
  return (
    <Box sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>
          Your Match!
        </Typography>
        <Typography variant="body1">
          Congratulations! You have been matched with the dog with ID: <strong>{matchId}</strong>
        </Typography>
      </Paper>
    </Box>
  );
}

export default MatchResult;

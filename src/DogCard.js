// src/DogCard.js
import React from 'react';
import { Card, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material';

function DogCard({ dog, isFavorite, toggleFavorite }) {
  return (
    <Card>
      <CardMedia
        component="img"
        height="200"
        image={dog.img}
        alt={dog.name}
      />
      <CardContent>
        <Typography variant="h6">{dog.name}</Typography>
        <Typography variant="body2">Breed: {dog.breed}</Typography>
        <Typography variant="body2">Age: {dog.age}</Typography>
        <Typography variant="body2">Zip Code: {dog.zip_code}</Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          variant={isFavorite ? "contained" : "outlined"}
          color="primary"
          onClick={() => toggleFavorite(dog)}
        >
          {isFavorite ? "Remove Favorite" : "Add Favorite"}
        </Button>
      </CardActions>
    </Card>
  );
}

export default DogCard;

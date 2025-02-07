// src/DogSearch.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Pagination,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DogCard from './DogCard';
import MatchResult from './MatchResult';

const API_BASE = 'https://frontend-take-home-service.fetch.com';
const PAGE_SIZE = 25;

function DogSearch() {
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState('');
  const [sortField, setSortField] = useState('breed');
  const [sortDirection, setSortDirection] = useState('asc');
  const [dogs, setDogs] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [matchResult, setMatchResult] = useState(null);
  
  const navigate = useNavigate();

  // Logout function
  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE}/auth/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.error('Logout error', err);
    }
    // Redirect back to login
    window.location.href = '/login';
  };

  // Fetch list of breeds on mount
  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const response = await axios.get(`${API_BASE}/dogs/breeds`, { withCredentials: true });
        setBreeds(response.data);
      } catch (err) {
        console.error('Error fetching breeds', err);
      }
    };
    fetchBreeds();
  }, []);

  // Function to fetch dogs based on filters and pagination
  const fetchDogs = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        size: PAGE_SIZE,
        sort: `${sortField}:${sortDirection}`,
      };
      if (selectedBreed) {
        // API expects an array of breeds.
        params.breeds = [selectedBreed];
      }
      // Using an offset for pagination
      params.from = (page - 1) * PAGE_SIZE;
      
      // GET /dogs/search
      const searchResponse = await axios.get(`${API_BASE}/dogs/search`, { params, withCredentials: true });
      const { resultIds, total } = searchResponse.data;
      setTotalResults(total);

      // Now, fetch dog details via POST /dogs
      if (resultIds && resultIds.length > 0) {
        const dogsResponse = await axios.post(`${API_BASE}/dogs`, resultIds, { withCredentials: true });
        setDogs(dogsResponse.data);
      } else {
        setDogs([]);
      }
      setCurrentPage(page);
    } catch (err) {
      console.error('Error fetching dogs', err);
    }
    setLoading(false);
  };

  // Fetch dogs on initial load and when filters change.
  useEffect(() => {
    fetchDogs(1);
  }, [selectedBreed, sortField, sortDirection]);

  const handleBreedChange = (e) => setSelectedBreed(e.target.value);
  const handleSortFieldChange = (e) => setSortField(e.target.value);
  const handleSortDirectionChange = (e) => setSortDirection(e.target.value);
  const handlePageChange = (event, value) => fetchDogs(value);

  const toggleFavorite = (dog) => {
    if (favorites.find(fav => fav.id === dog.id)) {
      setFavorites(favorites.filter(fav => fav.id !== dog.id));
    } else {
      setFavorites([...favorites, dog]);
    }
  };

  const handleGenerateMatch = async () => {
    if (favorites.length === 0) return;
    try {
      const favoriteIds = favorites.map(dog => dog.id);
      const matchResponse = await axios.post(`${API_BASE}/dogs/match`, favoriteIds, { withCredentials: true });
      setMatchResult(matchResponse.data.match);
    } catch (err) {
      console.error('Error generating match', err);
    }
  };

  const totalPages = Math.ceil(totalResults / PAGE_SIZE);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Logout Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="outlined" color="secondary" onClick={handleLogout}>Logout</Button>
      </Box>

      <Typography variant="h4" gutterBottom>Search Dogs for Adoption</Typography>
      
      {/* Filters & Sorting */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="breed-label">Breed</InputLabel>
          <Select
            labelId="breed-label"
            label="Breed"
            value={selectedBreed}
            onChange={handleBreedChange}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {breeds.map((breed) => (
              <MenuItem key={breed} value={breed}>{breed}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="sort-field-label">Sort Field</InputLabel>
          <Select
            labelId="sort-field-label"
            label="Sort Field"
            value={sortField}
            onChange={handleSortFieldChange}
          >
            <MenuItem value="breed">Breed</MenuItem>
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="age">Age</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="sort-direction-label">Sort Direction</InputLabel>
          <Select
            labelId="sort-direction-label"
            label="Sort Direction"
            value={sortDirection}
            onChange={handleSortDirectionChange}
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Dog Search Results */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={2}>
            {dogs.map((dog) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={dog.id}>
                <DogCard
                  dog={dog}
                  isFavorite={!!favorites.find(fav => fav.id === dog.id)}
                  toggleFavorite={toggleFavorite}
                />
              </Grid>
            ))}
          </Grid>
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color="primary" />
            </Box>
          )}
        </>
      )}

      {/* Favorites Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5">Favorites</Typography>
        {favorites.length === 0 ? (
          <Typography>No favorites selected.</Typography>
        ) : (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {favorites.map((dog) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={dog.id}>
                <DogCard dog={dog} isFavorite={true} toggleFavorite={toggleFavorite} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Generate Match Button */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button variant="contained" color="secondary" onClick={handleGenerateMatch} disabled={favorites.length === 0}>
          Generate Match
        </Button>
      </Box>

      {matchResult && <MatchResult matchId={matchResult} />}
    </Container>
  );
}

export default DogSearch;

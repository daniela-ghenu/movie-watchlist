import { updateSearchedMoviesUI } from './utils.js';
import getTemplate from './handlebars-setup.js';

const API_KEY = "fb9fa955";
const API_URL = "https://www.omdbapi.com/";

const searchForm = document.querySelector(".js-search-form");
const searchBar = document.querySelector(".js-search-input");
const movieListContainer = document.querySelector(".movie-list-container");
const loader = document.querySelector(".loader");

searchForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  handleSearch();
});

async function handleSearch() {
  if (!searchBar.value) return;

  showLoader();
  const searchResults = await fetchMovies(searchBar.value);
  hideLoader();

  if (searchResults.error) {
    displayError(searchResults.error);
  } else {
    renderMovies(searchResults);
  }
  searchForm.reset();
}

function showLoader() {
  const placeholder = document.querySelector(".placeholder");
  const movies = document.querySelectorAll(".movie-item");
  
  if (placeholder) {
    placeholder.style.display = "none";
  } else if (movies) {
    movies.forEach(movie => movie.style.display = "none");
  }
  
  loader.style.display = "block";
}

function hideLoader() {
  loader.style.display = "none";
}

// Fetches movies from the OMDB API. Returns array of movie objects or an error object.
async function fetchMovies(searchQuery) {
  try {
    const response = await fetch(
      `${API_URL}?apikey=${API_KEY}&s=${searchQuery}`
    );
    const data = await response.json();
    if (data.Error) throw new Error();

    // Fetch details for each movie
    const movies = await Promise.all(
      data.Search.map((movie) => fetchMovieDetails(movie.Title))
    );
    // Remove duplicate movie items
    return removeDuplicateMovies(movies);
  } catch (error) {
    return { error: "We were unable to find your movie..." };
  }
}

// Fetches details for a single movie. Returns a single movie object.
async function fetchMovieDetails(title) {
  const response = await fetch(`${API_URL}?apikey=${API_KEY}&t=${title}`);
  return response.json();
}

function removeDuplicateMovies(movies) {
  const uniqueMovies = [];

  // Check if the movie item already exists in uniqueMovies
  movies.forEach((movie) => {
    if (!uniqueMovies.some((movieItem) => movieItem.imdbID === movie.imdbID)) {
      uniqueMovies.push(movie);
    }
  });

  return uniqueMovies;
}

// Renders the list of movies to the UI.
function renderMovies(movies) {
  const moviesHtml = getTemplate("moviesList", { movies, context: "search" });
  movieListContainer.innerHTML = moviesHtml;
  updateSearchedMoviesUI();
}

// Displays an error message in the UI.
function displayError(message) {
  movieListContainer.innerHTML = getTemplate("placeholder", { message, context: "error" });
}

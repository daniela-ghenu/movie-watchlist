import { getWatchlist, saveWatchlist, updateSearchedMoviesUI } from './utils.js';
import getTemplate from './handlebars-setup.js';

let watchlist =  getWatchlist();
document.querySelector(".movie-list")?.addEventListener("click", manageWatchlist);
const clearButton = document.querySelector(".js-clear-watchlist-btn");
clearButton?.addEventListener("click", clearWatchlist);

window.addEventListener("load", () =>  {
  renderWatchlist();
  updateClearButtonState();
});

function clearWatchlist() {
  localStorage.clear();
  watchlist = getWatchlist();
  renderWatchlist();
  updateClearButtonState();
}

function updateClearButtonState() {
  if(clearButton) {
    clearButton.disabled = watchlist.length === 0;
  }
}

function manageWatchlist(e) {
  const toggleWatchlist = e.target.closest(".js-toggle-watchlist");
  const removeMovieBtn = e.target.closest(".js-remove-movie");
  
  if(toggleWatchlist || removeMovieBtn) {  
    const movie  = toggleWatchlist? toggleWatchlist.closest(".movie-item") : removeMovieBtn.closest(".movie-item");
    const movieData = getMovieData(movie);

    if(toggleWatchlist?.classList.contains("is-added") || removeMovieBtn) {
      removeMovie(movieData);
    } else {
      addMovie(movieData);
    }
  
    updateSearchedMoviesUI();
    renderWatchlist();
    updateClearButtonState();
  } 
}

function addMovie(movie) {
  watchlist.push(movie);
  saveWatchlist(watchlist);
}

function removeMovie(movie) {
  watchlist = watchlist.filter((item) => item.imdbID !== movie.imdbID);
  saveWatchlist(watchlist);
}

function getMovieData(movie) {
  return {
    imdbID: movie.dataset.id,
    Title: movie.dataset.title,
    Poster: movie.dataset.poster,
    Year: movie.dataset.year,
    Runtime: movie.dataset.runtime,
    Genre: movie.dataset.genre,
    imdbRating: movie.dataset.rating,
    Rated: movie.dataset.rated,
    Plot: movie.querySelector(".movie-plot")?.textContent || "",
    Director: movie.dataset.director,
    Actors: movie.dataset.actors,
    Awards: movie.dataset.awards,
  };
}

function renderWatchlist() {
  const watchlistContainer = document.querySelector(".movie-watchlist-container");
  const watchlistHtml = getTemplate("moviesList", { movies: watchlist, context: "watchlist" });
  const placeholderHtml = getTemplate("placeholder", { message:"", context: "watchlist" });

  if(watchlistContainer) {
    watchlistContainer.innerHTML = watchlist.length? watchlistHtml : placeholderHtml;
  }
}
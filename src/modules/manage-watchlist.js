import { getWatchlist, saveWatchlist, updateSearchedMoviesUI } from './utils.js';
import getMoviesTemplate from './handlebars-setup.js';

let watchlist =  getWatchlist();
document.querySelector(".movie-list")?.addEventListener("click", manageWatchlist);
window.addEventListener("load", () =>  renderWatchlist());

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

function getPlaceholder() {
  return `<div class="placeholder watchlist">
            <div class="container">
              <svg aria-hidden="true" focusable="false" width="84px" height="84px">
								<title>Movie Icon</title>
								<use xlink:href="#movie-icon"/>
							</svg>
              <p>Your watchlist is looking a little empty</p>
              <a href="/" class="placeholder-movies-btn">
                <svg class="icon-plus" aria-hidden="true" focusable="false" width="24px" height="24px">
                  <title>Plus Icon</title>
                  <use xlink:href="#plus-icon"/>
                </svg>
                <span>Let's add some movies</span>
              </a>
            </div>
          </div>`
}

function renderWatchlist() {
  const watchlistHtml = getMoviesTemplate(watchlist, "watchlist");
  const watchlistContainer = document.querySelector(".movie-watchlist-container");

  if(watchlistContainer) {
    watchlistContainer.innerHTML = watchlist.length? watchlistHtml : getPlaceholder();
  }
}
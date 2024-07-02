import {getWatchlist, saveWatchlist, updateSearchedMoviesUI} from './utils.js';

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

function createMovieTemplate(movie) {
  const {
    Title,
    Poster,
    Year,
    imdbRating,
    Rated,
    imdbID,
    Runtime,
    Genre,
    Plot,
    Director,
    Actors,
    Awards,
  } = movie;

  // Check if the movie's information is available
  if (!imdbID) return;

  return `
    <div class="movie-item" 
      data-id="${imdbID}"
      data-title="${Title}"
      data-poster=${
        Poster !== "N/A" ? Poster : `/images/image-fallback.png`
      }"
      data-year="${Year}"
      data-runtime="${Runtime}"
      data-genre="${Genre}"
      data-rating="${imdbRating}"
      data-rated="${Rated}"
      data-director="${Director}"
      data-actors="${Actors}"
      data-awards="${Awards}"
    >
      <div class="movie-header">
        <button class="movie-poster js-open-modal-btn" data-movie="${imdbID}">
          <img src="${
            Poster !== "N/A" ? Poster : `/images/image-fallback.png`
          }" 
          alt="${Title}" title="${Title}" width="275" height="250">
        </button>
      </div>
      
      <div class="movie-body">
        <h2 class="movie-title">${Title}</h2>
        <div class="movie-info-container">
          <span class="movie-year">${Year} •</span>
          <span class="movie-runtime">${Runtime} •</span>
          <span class="movie-genre">${Genre}</span>
        </div>

        <div class="movie-rating">
          <img class="rating-star-icon" src="/icons/rating-star-icon.svg" alt="Movie rating star icon">
          <span>${imdbRating}</span>
        </div>											
      </div>
      <div class="movie-buttons-container">
        <button class="remove-movie-btn js-remove-movie" data-movie="${imdbID}">
          <img class="icon" src="/icons/minus-icon.svg" alt="Minus icon">
          <span>Watchlist</span>
        </button>
        <button class="movie-info-btn js-open-modal-btn" data-movie="${imdbID}">
          <span>i</span>
        </button>
      </div>

      <dialog class="movie-modal">
        <div class="modal-wrapper">
          <button class="close-modal-btn js-close-modal-btn">
            <svg aria-hidden="true" focusable="false" width="28px" height="28px">
              <title>Close Icon</title>
              <use xlink:href="#close-icon"/>
            </svg>
          </button>
          <div class="modal-header">
            <div class="movie-img-wrapper">
              <img class="movie-img" src="${
                Poster !== "N/A"
                  ? Poster
                  : `/images/image-fallback.png`
              }" width="120" height="156">
            </div>
            <div class="header-info-container">
              <h2>${Title}</h2>
              <div class="info-container">
                <span>${Year} </span>
                <span>• ${Runtime}</span>
                <span>• ${Rated}</span>					
              </div>
              <p>${Genre}</p>
              <div class="rating">
                <img class="rating-star-icon" src="/icons/rating-star-icon.svg" alt="Movie rating star icon">
                <span>${imdbRating} / 10</span>
              </div>			
            </div>
          </div>
          <div class="modal-body">
            <p class="movie-plot">${Plot}</p>
            <p><span>Director:</span> ${Director}</p>
            <p><span>Actors:</span> ${Actors}</p>
            <p><span>Awards:</span> ${Awards}</p>
          </div>
        </div>
      </dialog> 
    </div>
  `;
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
  const watchlistContainer = document.querySelector(".movie-watchlist-container");
  const watchlistHtml = watchlist.map(movie => createMovieTemplate(movie)).join("");
 
  if(watchlistContainer) {
    watchlistContainer.innerHTML = watchlist.length? watchlistHtml : getPlaceholder();
  }
}
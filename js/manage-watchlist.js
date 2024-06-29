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
        Poster !== "N/A" ? Poster : `../assets/images/image-fallback.png`
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
            Poster !== "N/A" ? Poster : `../assets/images/image-fallback.png`
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
          <img class="rating-star-icon" src="../assets/icons/rating-star-icon.svg" alt="Movie rating star icon">
          <span>${imdbRating}</span>
        </div>											
      </div>
      <div class="movie-buttons-container">
        <button class="remove-movie-btn js-remove-movie" data-movie="${imdbID}">
          <img class="icon" src="../assets/icons/minus-icon.svg" alt="Minus icon">
          <span>Watchlist</span>
        </button>
        <button class="movie-info-btn js-open-modal-btn" data-movie="${imdbID}">
          <span>i</span>
        </button>
      </div>

      <dialog class="movie-modal">
        <div class="modal-wrapper">
          <button class="close-modal-btn js-close-modal-btn">
            <svg width="28px" height="28px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_429_11083)">
                <path d="M7 7.00006L17 17.0001M7 17.0001L17 7.00006" stroke="#282828" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </g>
              <defs>
                <clipPath id="clip0_429_11083">
                  <rect width="24" height="24" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </button>
          <div class="modal-header">
            <div class="movie-img-wrapper">
              <img class="movie-img" src="${
                Poster !== "N/A"
                  ? Poster
                  : `../assets/images/image-fallback.png`
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
                <img class="rating-star-icon" src="../assets/icons/rating-star-icon.svg" alt="Movie rating star icon">
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
              <svg width="84px" height="84px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" stroke-width="0"/>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
                <g id="SVGRepo_iconCarrier"> <rect width="18" height="18" rx="3" transform="matrix(1.39071e-07 1 1 -1.39071e-07 3 3)" stroke="#4f4b4b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> <line x1="7" y1="4" x2="7" y2="20" stroke="#4f4b4b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> <line x1="6" y1="8" x2="3" y2="8" stroke="#4f4b4b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> <line x1="21" y1="8" x2="18" y2="8" stroke="#4f4b4b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> <line x1="6" y1="16" x2="3" y2="16" stroke="#4f4b4b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> <line x1="21" y1="16" x2="18" y2="16" stroke="#4f4b4b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> <line x1="17" y1="4" x2="17" y2="20" stroke="#4f4b4b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> <path d="M21 12L3 12" stroke="#4f4b4b" stroke-width="2" stroke-linecap="round"/> </g>
              </svg>
              <p>Your watchlist is looking a little empty</p>
              <a href="/" class="placeholder-movies-btn">
                <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19" stroke="#ef4873" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 5L12 19" stroke="#ef4873" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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
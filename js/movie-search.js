const API_KEY = "fb9fa955";
const API_URL = "http://www.omdbapi.com/";

const searchForm = document.querySelector(".js-search-form");
const searchBar = document.querySelector(".js-search-input");
const movieListContainer = document.querySelector(".movie-list-container");

searchForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  handleSearch();
});

async function handleSearch() {
  if (!searchBar.value) return;

  const searchResults = await fetchMovies(searchBar.value);

  if (searchResults.error) {
    displayError(searchResults.error);
  } else {
    renderMovies(searchResults);
  }
  searchForm.reset();
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
    if (!uniqueMovies.some((movieItem) => isEqual(movieItem, movie))) {
      uniqueMovies.push(movie);
    }
  });

  return uniqueMovies;
}

function isEqual(movieItem, movie) {
  return JSON.stringify(movieItem) === JSON.stringify(movie);
}

// Renders the list of movies to the UI.
function renderMovies(movies) {
  const moviesHtml = movies.map((movie) => createMovieTemplate(movie)).join("");
  movieListContainer.innerHTML = moviesHtml;

  // Dispatch (trigger) custom event when movies are loaded
  const moviesLoadedEvent = new Event("moviesLoaded");
  document.dispatchEvent(moviesLoadedEvent);
}

// Generates HTML template for a single movie.
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
        <button class="add-to-watchlist-btn js-add-to-watchlist-btn" data-movie="${imdbID}">
          <img class="icon" src="../assets/icons/plus-icon.svg" alt="Plus icon">
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

            <button class="add-to-watchlist-btn js-add-to-watchlist-btn">
              <img class="icon" src="../assets/icons/plus-icon.svg" alt="Plus icon">
              <span>Watchlist</span>
            </button>
          </div>
        </div>
      </dialog> 
    </div>
  `;
}

// Displays an error message in the UI.
function displayError(message) {
  movieListContainer.innerHTML = `
    <div class="error-container">
        <p class="error-message">${message}</p>
    </div>`;
}

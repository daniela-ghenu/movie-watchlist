import {updateSearchedMoviesUI} from './utils.js';

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
  updateSearchedMoviesUI();
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
        <button class="toggle-watchlist-btn js-toggle-watchlist" data-movie="${imdbID}">
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

            <button class="toggle-watchlist-btn js-toggle-watchlist" data-movie="${imdbID}">
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
    <section class="placeholder-section error">
			<div class="container">
				<svg fill="#4f4b4b" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="84px" height="84px" viewBox="0 0 106.059 106.059" xml:space="preserve" stroke="#7a7a7a">
          <g id="SVGRepo_bgCarrier" stroke-width="0"/>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
          <g id="SVGRepo_iconCarrier"> <g> <path d="M90.546,15.518C69.858-5.172,36.199-5.172,15.515,15.513C-5.173,36.198-5.171,69.858,15.517,90.547 c20.682,20.684,54.341,20.684,75.027-0.004C111.23,69.858,111.229,36.2,90.546,15.518z M84.757,84.758 c-17.494,17.494-45.96,17.496-63.455,0.002c-17.498-17.497-17.496-45.966,0-63.46C38.796,3.807,67.261,3.805,84.759,21.302 C102.253,38.796,102.251,67.265,84.757,84.758z M77.017,74.001c0.658,1.521-0.042,3.286-1.562,3.943 c-1.521,0.66-3.286-0.042-3.944-1.562c-2.893-6.689-9.73-11.012-17.421-11.012c-7.868,0-14.747,4.319-17.522,11.004 c-0.479,1.154-1.596,1.851-2.771,1.851c-0.384,0-0.773-0.074-1.15-0.23c-1.53-0.636-2.255-2.392-1.62-3.921 c3.71-8.932,12.764-14.703,23.063-14.703C64.174,59.371,73.174,65.113,77.017,74.001z M33.24,38.671 c0-3.424,2.777-6.201,6.201-6.201c3.423,0,6.2,2.776,6.2,6.201c0,3.426-2.777,6.202-6.2,6.202 C36.017,44.873,33.24,42.097,33.24,38.671z M61.357,38.671c0-3.424,2.779-6.201,6.203-6.201c3.423,0,6.2,2.776,6.2,6.201 c0,3.426-2.776,6.202-6.2,6.202S61.357,42.097,61.357,38.671z"/> </g> </g>
        </svg>
        <p class="error-message">${message}</p>
			</div>
		</section>`;
}

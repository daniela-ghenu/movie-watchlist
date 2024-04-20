class MovieSearch {
  constructor() {
    this.API_KEY = "fb9fa955";
    this.API_URL = "http://www.omdbapi.com/";

    this.searchForm = document.querySelector(".js-search-form");
    this.searchBar = document.querySelector(".js-search-input");
    this.movieListContainer = document.querySelector(".movie-list-container");
    this.searchForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSearch();
    });
  }

  async handleSearch() {
    if (!this.searchBar.value) return;

    const searchResults = await this.fetchMovies(this.searchBar.value);

    if (searchResults.error) {
      this.displayError(searchResults.error);
    } else {
      this.renderMovies(searchResults);
    }
    this.searchForm.reset();
  }

  // Fetches movies from the OMDB API. Returns array of movie objects or an error object.
  async fetchMovies(searchQuery) {
    try {
      const response = await fetch(
        `${this.API_URL}?apikey=${this.API_KEY}&s=${searchQuery}`
      );
      const data = await response.json();
      if (data.Error) throw new Error();

      // Fetch details for each movie
      const movies = await Promise.all(
        data.Search.map((movie) => this.fetchMovieDetails(movie.Title))
      );
      return movies;
    } catch (error) {
      return { error: "We were unable to find your movie..." };
    }
  }

  // Fetches details for a single movie. Returns a single movie object.
  async fetchMovieDetails(title) {
    const response = await fetch(
      `${this.API_URL}?apikey=${this.API_KEY}&t=${title}`
    );
    return response.json();
  }

  // Renders the list of movies to the UI.
  renderMovies(movies) {
    const moviesHtml = movies
      .map((movie) => this.createMovieTemplate(movie))
      .join("");
    this.movieListContainer.innerHTML = moviesHtml;
  }

  // Generates HTML template for a single movie.
  createMovieTemplate(movie) {
    const {
      Title,
      Poster,
      Year,
      Released,
      imdbRating,
      imdbID,
      Runtime,
      Genre,
      Plot,
      Language,
      Director,
      Actors,
      Awards,
    } = movie;

    // Check if the movie's information is available
    if (!imdbID) return;

    return `
      <div class="movie-item" id="${imdbID}">
        <div class="movie-header">
          <button class="movie-poster js-open-modal" data-movie="${imdbID}">
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
            
          <div class="movie-buttons-container">
            <button class="add-to-watchlist-btn js-add-to-watchlist" data-movie="${imdbID}">
              <img class="icon" src="../assets/icons/plus-icon.svg" alt="Plus icon">
              <span>Watchlist</span>
            </button>
            <button class="movie-info-btn js-open-modal" data-movie="${imdbID}">
              <span>i</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Displays an error message in the UI.
  displayError(message) {
    this.movieListContainer.innerHTML = `
      <div class="error-container">
          <p class="error-message">${message}</p>
      </div>`;
  }
}

export default MovieSearch;

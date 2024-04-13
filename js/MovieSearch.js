class MovieSearch {
  constructor() {
    this.API_KEY = "fb9fa955";
    this.API_URL = "http://www.omdbapi.com/";

    this.searchForm = document.querySelector(".search-form");
    this.searchBar = document.querySelector(".search-input");
    this.movieListContainer = document.querySelector(".movie-list-container");
    this.searchForm.addEventListener("submit", (e) => {
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
    const { Title, Poster, imdbRating, Runtime, Genre, Plot, imdbID } = movie;
    return `
      <div class="movie-item" id="${imdbID}">
          <img class="movie-poster" src="${Poster}">
          <div class="movie-info">
              <div class="movie-antet">
                  <p class="movie-title">${Title}</p>
                  <p class="movie-rating">${imdbRating}</p>
              </div>
              <div class="extra-info">
                  <p class="movie-runtime">${Runtime}</p>
                  <p class="movie-genre">${Genre}</p>
                  <div id="add-icon-container">
                     <button>+ Watchlist</button>
                  </div>
              </div>
              <p class="movie-plot">${Plot}</p>
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

const movieList = document.querySelector(".movie-list");
movieList?.addEventListener("click", handleUserInteraction);

function handleUserInteraction(e) {
  const addToWatchlist = e.target.closest(".js-add-to-watchlist-btn");
  const removeFromWatchlist = e.target.closest(".js-remove-from-watchlist-btn");

  if (addToWatchlist) {
    addMovie(addToWatchlist.closest(".movie-item"));
  } else if (removeFromWatchlist) {
    removeMovie(removeFromWatchlist.closest(".movie-item"));
  }
}

function addMovie(movie) {
  if (!movie) return;

  const movieData = getMovieData(movie);

  const watchlist = getMoviesFromWatchlist();

  watchlist.push(movieData);

  setMoviesToWatchlist(watchlist);

  // renderWatchlist();
}

function removeMovie(movie) {
  if (!movie) return;

  const movieData = getMovieData(movie);

  const watchlist = getMoviesFromWatchlist();

  // Find the index of the movie with a specific id
  const moviePosition = watchlist.findIndex(
    (movie) => movie.id === movieData.id
  );

  if (moviePosition !== -1) {
    // Remove the movie from that position
    watchlist.splice(moviePosition, 1);

    setMoviesToWatchlist(watchlist);

    // renderWatchlist();
  }
}

function getMovieData(movie) {
  return {
    id: movie.dataset.id,
    title: movie.dataset.title,
    poster: movie.dataset.poster,
    year: movie.dataset.year,
    runtime: movie.dataset.runtime,
    genre: movie.dataset.genre,
    rating: movie.dataset.rating,
    rated: movie.dataset.rated,
    plot: movie.querySelector(".movie-plot")?.textContent || "",
    director: movie.dataset.director,
    actors: movie.dataset.actors,
    awards: movie.dataset.awards,
  };
}

function getMoviesFromWatchlist() {
  return JSON.parse(localStorage.getItem("watchlist")) || [];
}

function setMoviesToWatchlist(watchlist) {
  localStorage.setItem("watchlist", JSON.stringify(watchlist));
}

// function createMovieTemplate(movie) {}

// function renderWatchlist() {
//   const watchlist =  getMoviesFromWatchlist();
//   watchlist.forEach(movie => ...)
// }

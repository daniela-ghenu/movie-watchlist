export function getWatchlist() {
  return JSON.parse(localStorage.getItem("watchlist")) || [];
}

export function saveWatchlist(watchlist) {
  localStorage.setItem("watchlist", JSON.stringify(watchlist));
}

export function updateSearchedMoviesUI() {
  const watchlist = getWatchlist();
  const toggleButtons = document.querySelectorAll(".js-toggle-watchlist");

  toggleButtons.forEach(button => {
      const movie = button.closest(".movie-item");
      const buttonIcon = button.querySelector(".icon");

      if (watchlist.some(item => item.imdbID === movie.dataset.id)) {
        button.classList.add("is-added");
        buttonIcon.src = "/icons/check-icon.svg";
        
      } else {
        button.classList.remove("is-added");
        buttonIcon.src = "/icons/plus-icon.svg";
      }
  });
}

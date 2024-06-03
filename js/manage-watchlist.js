import {getWatchlist, saveWatchlist, updateSearchedMoviesUI} from './utils.js';

document.querySelector(".movie-list")?.addEventListener("click", handleWatchlistToggle);

function handleWatchlistToggle(e) {
  if(e.target.closest(".js-toggle-watchlist")) {
    const toggleWatchlist = e.target.closest(".js-toggle-watchlist");
    const movie  = toggleWatchlist.closest(".movie-item");
    const movieData = getMovieData(movie);

    if(toggleWatchlist.classList.contains("is-added")) {
      removeMovie(movieData);
    } else {
      addMovie(movieData);
    }

    updateSearchedMoviesUI();
  }
}

function addMovie(movie) {
  const watchlist = getWatchlist();
  watchlist.push(movie);
  saveWatchlist(watchlist);
}

function removeMovie(movie) {
  let watchlist = getWatchlist();
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

// function createMovieTemplate(movie) {
//   const {
//     Title,
//     Poster,
//     Year,
//     imdbRating,
//     Rated,
//     imdbID,
//     Runtime,
//     Genre,
//     Plot,
//     Director,
//     Actors,
//     Awards,
//   } = movie;

//   // Check if the movie's information is available
//   if (!imdbID) return;

//   return `
//     <div class="movie-item" 
//       data-id="${imdbID}"
//       data-title="${Title}"
//       data-poster=${
//         Poster !== "N/A" ? Poster : `../assets/images/image-fallback.png`
//       }"
//       data-year="${Year}"
//       data-runtime="${Runtime}"
//       data-genre="${Genre}"
//       data-rating="${imdbRating}"
//       data-rated="${Rated}"
//       data-director="${Director}"
//       data-actors="${Actors}"
//       data-awards="${Awards}"
//     >
//       <div class="movie-header">
//         <button class="movie-poster js-open-modal-btn" data-movie="${imdbID}">
//           <img src="${
//             Poster !== "N/A" ? Poster : `../assets/images/image-fallback.png`
//           }" 
//           alt="${Title}" title="${Title}" width="275" height="250">
//         </button>
//       </div>
      
//       <div class="movie-body">
//         <h2 class="movie-title">${Title}</h2>
//         <div class="movie-info-container">
//           <span class="movie-year">${Year} •</span>
//           <span class="movie-runtime">${Runtime} •</span>
//           <span class="movie-genre">${Genre}</span>
//         </div>

//         <div class="movie-rating">
//           <img class="rating-star-icon" src="../assets/icons/rating-star-icon.svg" alt="Movie rating star icon">
//           <span>${imdbRating}</span>
//         </div>											
//       </div>
//       <div class="movie-buttons-container">
//         <button class="remove-movie-btn js-remove-movie" data-movie="${imdbID}">
//           <img class="icon" src="../assets/icons/plus-icon.svg" alt="Plus icon">
//           <span>Watchlist</span>
//         </button>
//         <button class="movie-info-btn js-open-modal-btn" data-movie="${imdbID}">
//           <span>i</span>
//         </button>
//       </div>

//       <dialog class="movie-modal">
//         <div class="modal-wrapper">
//           <button class="close-modal-btn js-close-modal-btn">
//             <svg width="28px" height="28px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <g clip-path="url(#clip0_429_11083)">
//                 <path d="M7 7.00006L17 17.0001M7 17.0001L17 7.00006" stroke="#282828" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
//               </g>
//               <defs>
//                 <clipPath id="clip0_429_11083">
//                   <rect width="24" height="24" fill="white"/>
//                 </clipPath>
//               </defs>
//             </svg>
//           </button>
//           <div class="modal-header">
//             <div class="movie-img-wrapper">
//               <img class="movie-img" src="${
//                 Poster !== "N/A"
//                   ? Poster
//                   : `../assets/images/image-fallback.png`
//               }" width="120" height="156">
//             </div>
//             <div class="header-info-container">
//               <h2>${Title}</h2>
//               <div class="info-container">
//                 <span>${Year} </span>
//                 <span>• ${Runtime}</span>
//                 <span>• ${Rated}</span>					
//               </div>
//               <p>${Genre}</p>
//               <div class="rating">
//                 <img class="rating-star-icon" src="../assets/icons/rating-star-icon.svg" alt="Movie rating star icon">
//                 <span>${imdbRating} / 10</span>
//               </div>			
//             </div>
//           </div>
//           <div class="modal-body">
//             <p class="movie-plot">${Plot}</p>
//             <p><span>Director:</span> ${Director}</p>
//             <p><span>Actors:</span> ${Actors}</p>
//             <p><span>Awards:</span> ${Awards}</p>

//             <button class="remove-movie-btn js-remove-movie" data-movie="${imdbID}">
//               <img class="icon" src="../assets/icons/plus-icon.svg" alt="Plus icon">
//               <span>Watchlist</span>
//             </button>
//           </div>
//         </div>
//       </dialog> 
//     </div>
//   `;
// }

// function renderWatchlist() {
//   const watchlist =  getWatchlist();
//   const watchlistContainer = document.querySelector(".movie-watchlist-container");
//   const watchlistHtml = watchlist.map(movie => createMovieTemplate(movie)).join("");
 
//   if(watchlistContainer) {
//     console.log(watchlistHtml);
//     watchlistContainer.innerHTML = watchlistHtml;
//   }
// }
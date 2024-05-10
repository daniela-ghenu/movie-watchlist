const movieItems = document.querySelectorAll(".movie-item");

movieItems.forEach((movie) => {
  movie.addEventListener("click", function (e) {
    const openModalBtn = e.target.closest(".js-open-modal-btn");
    const closeModalBtn = e.target.closest(".js-close-modal-btn");
    const movieModal = this.querySelector(".movie-modal");

    if (openModalBtn) {
      movieModal.showModal();
    } else if (closeModalBtn) {
      movieModal.close();
    } else if (e.target.classList.contains("movie-modal")) {
      // Get the size and position of the modal, relative to the viewport
      const { left, right, top, bottom } = movieModal.getBoundingClientRect();

      // Close the modal if the user has clicked outside the modal box
      if (
        e.clientX < left ||
        e.clientX > right ||
        e.clientY < top ||
        e.clientY > bottom
      ) {
        movieModal.close();
      }
    }
  });
});

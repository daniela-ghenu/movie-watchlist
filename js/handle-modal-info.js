const movieList = document.querySelector(".movie-list");
movieList?.addEventListener("click", handleModalInteractions);

function handleModalInteractions(e) {
  const movieItem = e.target.closest(".movie-item");
  if (!movieItem) return;

  const openModalBtn = e.target.closest(".js-open-modal-btn");
  const closeModalBtn = e.target.closest(".js-close-modal-btn");
  const movieModal = movieItem.querySelector(".movie-modal");

  if (openModalBtn) {
    movieModal.showModal();
  } else if (closeModalBtn) {
    movieModal.close();
  } else if (e.target.classList.contains("movie-modal")) {
    closeModalOnOutsideClick(movieModal, e);
  }
}

function closeModalOnOutsideClick(movieModal, e) {
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

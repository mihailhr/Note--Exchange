// Functionality for a button that scrolls to the top of the page

const scrollButton = document.getElementById("scroll");

scrollButton.addEventListener("click", scrollToTop);

function scrollToTop() {
  // This function handles the actual scrolling

  window.scroll({
    top: 0,
    behavior: "smooth",
  });
}
function hideOrShowScrollButton() {
  // This function affects the visibility of the button by using a custom CSS class. It should be shown only when it's useful.
  if (window.scrollY > window.innerHeight * 0.1) {
    scrollButton.classList.remove("hidden");
  } else {
    scrollButton.classList.add("hidden");
  }
}
window.addEventListener("scroll", hideOrShowScrollButton);

function initialGamburgerBtn() {
  const btn = document.querySelector(".header__hamburger-btn");
  if (!btn) return;

  const aside = document.querySelector(".header__aside");
  if (!aside) return;

  btn.addEventListener("click", (evt) => {
    aside.classList.toggle("active");
    evt.target.closest(".header__hamburger-btn").classList.toggle("active");
  });
}

initialGamburgerBtn();

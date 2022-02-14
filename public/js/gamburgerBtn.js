function initialFilterBtn() {
    const btn = document.querySelector(".catalog__body-top__filter-btn");
    if(!btn) return;

    const aside = document.querySelector(".catalog__aside");
    if(!aside) return;

    btn.addEventListener('click', (evt) => {
        aside.classList.toggle('active');
        evt.target
          .closest(".catalog__body-top__filter-btn")
          .classList.toggle("active");
    })
}

initialFilterBtn();
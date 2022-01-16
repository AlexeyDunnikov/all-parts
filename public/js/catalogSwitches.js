function initialCatalogSwitches(){
    const switchBtns = document.querySelectorAll(".catalog__body-top__btn");
    if(!switchBtns) return;

    const catalog = document.querySelector(".catalog__body-list");

    switchBtns.forEach(switchBtn => {
        switchBtn.addEventListener('click', (evt) => {
            removeClassFrom(".catalog__body-top__btn", "active");
            const target = evt.target.closest(".catalog__body-top__btn");
            target.classList.add('active');

            const type = target.dataset.type;

            catalog.className = "catalog__body-list";
            catalog.classList.add(type);
        });
    })
}

function removeClassFrom(selector, removeClass){
    const elements = document.querySelectorAll(selector);
    if(!elements) return;

    elements.forEach(el => el.classList.remove(removeClass));
}

initialCatalogSwitches();
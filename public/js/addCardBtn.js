function initialAddCardBtn (){
    const btn = document.querySelector(".profile__card__add-btn");
    if(!btn) return;

    const form = document.querySelector(".select-card__form--profile");

    btn.addEventListener('click', (evt) => {
        form.classList.add('active');
    });
}

function initialDelCardBtns() {
  const btns = document.querySelectorAll(".profile__card__delete-form__btn");
  if (!btns) return;

  btns.forEach(btn => {
    btn.addEventListener("click", async (evt) => {
      const target = evt.target.closest(".profile__card__delete-form__btn");

      const item = target.closest(".profile__cards-item");
      item.remove();

      await delCardFromDB(target.dataset.cardId);
    });
  })
}

async function delCardFromDB(cardId) {
    await fetch("/delete-card", {
      method: "POST",
      body: JSON.stringify({
        cardId,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return;
}

initialAddCardBtn();
initialDelCardBtns();
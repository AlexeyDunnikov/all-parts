import { isUserAuth } from "./helper.js";

function initialToBasketBtns() {
  const toBasketBtns = document.querySelectorAll(
    ".catalog__body-item__basket-btn"
  );
  if (!toBasketBtns) return;

  toBasketBtns.forEach((toBasketBtn) => {
    if (toBasketBtn.classList.contains("active")) {
      toBasketBtn.innerHTML = `<span class="catalog__body-item__basket-btn__text">
                          Удалить из корзины
                        </span>`;
      toBasketBtn.removeEventListener("click", toBasketHandler);
      toBasketBtn.addEventListener("click", delBasketHandler);
    } else {
      toBasketBtn.innerHTML = `<svg
                          class="catalog__body-item__basket-btn__img"
                          width="20"
                          height="15"
                          viewBox="0 0 37 29"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M37 0L35.8545 3.22222H32.8807L27.5249 22.5556H7.11479L0 4.83333H25.9185L25.049 8.05556H4.63733L9.16521 19.3333H25.2417L30.5327 0H37V0ZM13.1042 24.1667C11.8277 24.1667 10.7917 25.2493 10.7917 26.5833C10.7917 27.9189 11.8277 29 13.1042 29C14.3807 29 15.4167 27.9189 15.4167 26.5833C15.4167 25.2493 14.3807 24.1667 13.1042 24.1667ZM23.7417 12.8889L20.8125 24.1667C19.536 24.1667 18.5 25.2477 18.5 26.5833C18.5 27.9189 19.536 29 20.8125 29C22.089 29 23.125 27.9189 23.125 26.5833C23.125 25.2493 22.089 24.1667 20.8125 24.1667L23.7417 12.8889Z"
                            fill="white"
                          ></path> 
                          <span class="catalog__body-item__basket-btn__text">
                          В корзину
                        </span>`;
      toBasketBtn.removeEventListener("click", delBasketHandler);
      toBasketBtn.addEventListener("click", toBasketHandler);
    }
  });
}

async function toBasketHandler(evt) {
  const target = evt.target.closest(".catalog__body-item__basket-btn");
  const partId = target.dataset.partId;

  await addToBasket(partId);
  target.classList.add("active");
  initialToBasketBtns();
}

async function delBasketHandler(evt) {
  const target = evt.target.closest(".catalog__body-item__basket-btn");
  const partId = target.dataset.partId;

  await delFromBasket(partId);
  target.classList.remove("active");

  initialToBasketBtns();
}

async function addToBasket(partId) {
  const isAuth = await isUserAuth();
  if (!isAuth) {
    toSignin();
    return;
  }

  await fetch("/add-to-basket", {
    method: "POST",
    body: JSON.stringify({
      partId,
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return;
}

async function toSignin() {
  window.location.href = `/signin`;
}

async function delFromBasket(partId) {
  await fetch("/delete-from-basket", {
    method: "DELETE",
    body: JSON.stringify({
      partId,
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return;
}

initialToBasketBtns();

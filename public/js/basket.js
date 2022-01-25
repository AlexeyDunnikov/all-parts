import { deleteFromBasket } from "./helper.js";
import { toCurrency } from "./formatPrice.js";

function initialBasketBtns() {
  const minusBtns = document.querySelectorAll(
    ".basket__item-amount__btn--minus"
  );
  if (!minusBtns) return;

  const plusBtns = document.querySelectorAll(".basket__item-amount__btn--plus");
  if (!minusBtns) return;

  minusBtns.forEach((minusBtn) => {
    minusBtn.addEventListener("click", minusBtnHandler);
  });

  plusBtns.forEach((plusBtn) => {
    plusBtn.addEventListener("click", plusBtnHandler);
  });
}

function initialBasketCheckboxes() {
  const checkboxes = document.querySelectorAll(".basket__item-checkbox");
  if (!checkboxes) return;

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", checkboxHandler);
  });

  const checkboxAll = document.querySelector(".basket__item-checkbox-all");
  if (!checkboxAll) return;

  checkboxAll.addEventListener("change", checkboxAllHandler);
}

async function checkboxHandler(evt) {
  const target = evt.target;

  await updateToOrderItems(target.value, target.checked);
  updateTotalPrice();

  const checkboxes = document.querySelectorAll(".basket__item-checkbox");
  if (!checkboxes) return;

  let len;
  if(target.checked){
    len = Array.from(checkboxes).filter(
      (checkbox) => !checkbox.checked
    ).length;
  }else{
    len = Array.from(checkboxes).filter((checkbox) => checkbox.checked).length;
  }

  const checkboxAll = document.querySelector(".basket__item-checkbox-all");
  if(target.checked && !checkboxAll.checked && len === 0){
    checkboxAll.click();
  }else if (!target.checked && checkboxAll.checked && len === 0) {
    checkboxAll.click();
  }
}

function checkboxAllHandler(evt) {
  const checkboxes = document.querySelectorAll(".basket__item-checkbox");
  if (!checkboxes) return;

  checkboxes.forEach((checkbox) => {
    if (evt.target.checked && !checkbox.checked) {
      checkbox.click();
    } else if (!evt.target.checked && checkbox.checked) {
      checkbox.click();
    }
  });
}

function renderTotalPrices() {
  const basketItems = document.querySelectorAll(".basket__item");
  if (!basketItems) return;

  basketItems.forEach((basketItem) => {
    updateTotalPriceOfItem(basketItem);
  });
}

function updateTotalPriceOfItem(basketItem) {
  const amount = +basketItem.querySelector(".basket__item-amount__value")
    .textContent;
  const pricePerOne = +basketItem.querySelector(".basket__item-price-per-one")
    .dataset.price;

  const totalPrice = amount * pricePerOne;
  basketItem.dataset.totalPrice = totalPrice;
  basketItem.querySelector(".basket__item-price-total").textContent =
    toCurrency(totalPrice);
  updateTotalPrice();
}

async function minusBtnHandler(evt) {
  const target = evt.target.closest(".basket__item-amount__btn");

  const amountEl = target.nextElementSibling;
  let amount = +amountEl.textContent;

  if (amount > 1) {
    amount--;
    amountEl.textContent = amount;
    await updateBasketAmount(target.dataset.partId, amount);
    updateTotalPriceOfItem(target.closest(".basket__item"));
  } else {
    target.closest(".basket__item").remove();
    await deleteFromBasket(target.dataset.partId);
  }
}

async function plusBtnHandler(evt) {
  const target = evt.target.closest(".basket__item-amount__btn");

  const amountEl = target.previousElementSibling;
  let amount = +amountEl.textContent;
  amount++;

  amountEl.textContent = amount;
  await updateBasketAmount(target.dataset.partId, amount);
  updateTotalPriceOfItem(target.closest(".basket__item"));
}

function updateTotalPrice() {
  const totalPriceEl = document.querySelector(".basket__total-price__value");
  if (!totalPriceEl) return;

  const basketItems = document.querySelectorAll(".basket__item");
  if (!basketItems) return;

  let sum = 0;
  basketItems.forEach((item) => {
    const checkbox = item.querySelector(".basket__item-checkbox");
    if (checkbox.checked) {
      sum += +item.dataset.totalPrice;
    }
  });
  totalPriceEl.textContent = toCurrency(sum);
}

async function updateBasketAmount(partId, amount) {
  await fetch("/update-basket-amount", {
    method: "PUT",
    body: JSON.stringify({
      partId,
      amount,
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return;
}

async function updateToOrderItems(partId, isAddToOrder) {
  await fetch("/update-to-order-items", {
    method: "PUT",
    body: JSON.stringify({
      partId,
      isAddToOrder,
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return;
}

renderTotalPrices();
initialBasketBtns();
initialBasketCheckboxes();

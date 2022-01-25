export async function isUserAuth() {
  const res = await fetch("/is-user-auth", {
    method: "POST",
  });

  return await res.json() ? true : false;
}


export async function deleteFromBasket(partId) {
  decreaseBasketAmount();

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


function decreaseBasketAmount() {
  const basketAmountEl = document.querySelector(".basket-num");
  if (!basketAmountEl) return;

  basketAmountEl.textContent = +basketAmountEl.textContent - 1;
}

export function formatPrice(selector) {
  const pricesEl = document.querySelectorAll(selector);
  if (!pricesEl) return;

  pricesEl.forEach((priceEl) => {
    priceEl.textContent = toCurrency(+parseFloat(priceEl.textContent));
  });
}

export function toCurrency(value) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "BYN",
  }).format(value);
}



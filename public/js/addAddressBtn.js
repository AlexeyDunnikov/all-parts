function initialAddAddressBtn() {
  const btn = document.querySelector(".profile__address__add-btn");
  if (!btn) return;

  const form = document.querySelector(".delivery-courier__form--profile");

  btn.addEventListener("click", (evt) => {
    form.classList.add("active");
  });
}

function initialDelAddressBtns() {
  const btns = document.querySelectorAll(".profile__address__delete-form__btn");
  if (!btns) return;

  btns.forEach((btn) => {
    btn.addEventListener("click", async (evt) => {
      console.log(evt);
      const target = evt.target.closest(".profile__address__delete-form__btn");

      const item = target.closest(".profile__addresses-item");
      item.remove();

      await delAddressFromDB(target.dataset.addressId);
    });
  });
}

async function delAddressFromDB(addressId) {
  await fetch("/delete-address", {
    method: "POST",
    body: JSON.stringify({
      addressId,
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return;
}

initialAddAddressBtn();
initialDelAddressBtns();

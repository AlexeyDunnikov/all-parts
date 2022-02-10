function initChangeInfoBtns() {
  const changeInfoBtns = document.querySelectorAll(".change-info__change-btn");
  if (!changeInfoBtns) return;

  changeInfoBtns.forEach((btn) => {
    btn.addEventListener("click", changeInfoHandler);
  });
}

function initCancelBtns() {
  const cancelBtns = document.querySelectorAll(".change-info__cancel-btn");
  if (!cancelBtns) return;

  cancelBtns.forEach((btn) => {
    btn.addEventListener("click", cancelHandler);
  });
}

function changeInfoHandler(evt) {
  evt.preventDefault();
  const target = evt.target.closest(".change-info__change-btn");

  const wrapperEl = target.closest(".change-info__form");

  const inputEl = wrapperEl.querySelector(".change-info__input");

  inputEl.disabled = false;
  inputEl.focus();

  wrapperEl.querySelector(".change-info__apply-btn").classList.add("active");
  wrapperEl.querySelector(".change-info__cancel-btn").classList.add("active");
  
   const changeInfoBtns = document.querySelectorAll(".change-info__change-btn");
   if (!changeInfoBtns) return;
   changeInfoBtns.forEach(btn => btn.classList.remove('active'))
}

function cancelHandler(evt) {
  evt.preventDefault();
  const target = evt.target.closest(".change-info__cancel-btn");

  const wrapperEl = target.closest(".change-info__form");

  const inputEl = wrapperEl.querySelector(".change-info__input");

  inputEl.value = inputEl.dataset.oldValue;
  inputEl.disabled = true;

  wrapperEl.querySelector(".change-info__apply-btn").classList.remove("active");
  target.classList.remove("active");

  const changeInfoBtns = document.querySelectorAll(".change-info__change-btn");
  if (!changeInfoBtns) return;
  changeInfoBtns.forEach((btn) => btn.classList.add("active"));
}

initChangeInfoBtns();
initCancelBtns();
